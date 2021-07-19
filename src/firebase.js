import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig, userUids } from "./secrets";

import { ref, onUnmounted, computed } from "vue";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export function useAuthServer() {
  const user = ref(null);
  auth.onAuthStateChanged((_user) => (user.value = _user));
  const isLogin = computed(() => user.value !== null);

  return { isLogin, user };
}

export function useAuth() {
  const user = ref(null);
  const unsubscribe = auth.onAuthStateChanged((_user) => (user.value = _user));
  onUnmounted(unsubscribe);
  const isLogin = computed(() => user.value !== null);

  const signInWithForm = async (email, password) => {
    return new Promise((resolve, reject) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          resolve("Logged in successfully!");
        })
        .catch((err) => reject(err));
    });
  };

  /**
   * 描述
   * @date 2021-07-08
   * @returns {any}
   */
  const signOut = () => {
    return new Promise((resolve, reject) => {
      auth
        .signOut()
        .then(resolve("Signed out!"))
        .catch((err) => reject(err));
    });
  };

  return { user, isLogin, signInWithForm, signOut };
}

const firestore = firebase.firestore();

/**
 * Collection of all queue numbers
 * @returns Collection
 */
const queueNumCollection = firestore.collection("queue");

/**
 * Collection of queue numbers in ascending order
 * @returns Collection
 */
const queueNumAscending = queueNumCollection.orderBy("queueTime", "asc");

/**
 * Counter for the queue
 * @returns Document
 */
const queueCounterRef = firestore.collection("counter").doc("queueNum");

/**
 * Reference to Station Details Collection in Firestore
 * The doc id == userUid
 * @returns Collection
 */
const stationDetailsRef = firestore.collection("stationDetails");

const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

export function useQueue() {
  /**
   * Gets the queue items as a VueJS ref
   * @date 2021-07-05
   * @returns ref
   */
  const queueItems = ref([]);

  // Watch the queue items
  // Also, hook for cleanup when component is unmounted
  const unsubscribe = queueNumAscending.onSnapshot((snapshot) => {
    queueItems.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  onUnmounted(unsubscribe);

  /**
   * Issue Queue No
   * Uses transactions to get the current queue no.
   * @date 2021-07-05
   * @returns Number
   */
  const issueQueueNum = async () => {
    // Return value to indicate the number to be issued
    var newQueueNo;

    // Transaction start
    await firestore.runTransaction((transaction) => {
      // Reads the queue counter in the counter collection
      return transaction.get(queueCounterRef).then((counterRef) => {
        if (!counterRef) throw "Document does not exist";

        // Get the next count
        newQueueNo = counterRef.data().count + 1;

        // Create a new document in the queue number collection
        var queueNumRef = queueNumCollection.doc();

        // Increment the counter
        transaction.update(queueCounterRef, {
          count: newQueueNo,
        });

        // Save the new queue no
        transaction.set(queueNumRef, {
          num: newQueueNo,
          queueTime: firebase.firestore.FieldValue.serverTimestamp(),
          stage: 0,
          timestamps: {
            issue: firebase.firestore.FieldValue.serverTimestamp(),
            registration: null,
            screening: null,
            vitals: null,
            vaccination: null,
            observation: null,
            exit: null,
          },
          rejected: null,
          // issueTime: firebase.firestore.FieldValue.serverTimestamp(),
          // registrationTime: null,
          // screeningTime: null,
          // vitalsTime: null,
          // vaccinationTime: null,
          // postTime: null,
          // exitTime: null,
        });
      });
    });

    return newQueueNo;
  };

  // Function Definition for Station Control
  const callForNextNum = async (stage) => {
    try {
      const station = ["registration", "screening", "vitals", "vaccination"][
        stage / 2
      ];
      // Check to see if user is authenticated
      if (
        auth.currentUser === null ||
        auth.currentUser === undefined ||
        !(
          userUids[station].includes(auth.currentUser.uid) ||
          userUids.admin.includes(auth.currentUser.uid)
        )
      )
        throw "You are not authorized for this station.";

      var nextQueueNum;

      await firestore.runTransaction(async (transaction) => {
        // Get the latest num with the correct stage
        let query = await queueNumAscending
          .where("stage", "==", stage)
          .limit(1)
          .get();

        // If query is empty AKA No one w/ the stage is found,
        // Throw an error
        if (query.empty) throw "No one is in the waiting list.";

        const doc = query.docs[0].ref;

        // console.log("before transaction", query, doc);
        // Finally do the transaction.
        return transaction.get(doc).then((snapshot) => {
          // More error to throw
          if (!snapshot) throw "Document does not exist";

          // Get the next queue num object
          nextQueueNum = { id: query.docs[0].id, ...snapshot.data() };

          // Increment the stage
          const nextStage = snapshot.data().stage + 1;

          // Update the table
          transaction.update(doc, {
            stage: nextStage,
          });
          transaction.update(stationDetailsRef.doc(auth.currentUser.uid), {
            currentQueueId: { id: snapshot.id, ...snapshot.data() },
          });
        });
      });
    } catch (err) {
      // Return the error
      return Promise.reject(err);
    }

    return nextQueueNum;
  };

  const finishCurrentNum = async (queueId, station = "registration") => {
    try {
      // Authenticate the user
      if (!auth.currentUser) throw "You are not authenticated.";

      // Check if queue Id is invalid
      if (queueId === null || queueId === undefined)
        throw "You have returned an invalid queue number";

      // Update the queue item
      await queueNumCollection.doc(queueId).update({
        stage: increment,
        [`timestamps.${station}`]: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Update the station details
      await stationDetailsRef.doc(auth.currentUser.uid).update({
        currentQueueId: null,
      });

      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const stationDisplayQueueNums = (station) => {
    const displayQueueNums = ref([]);

    // Watch the queue items
    // Also, hook for cleanup when component is unmounted
    const displayUnsubscribe = stationDetailsRef
      .where("stationType", "==", station)
      .orderBy("stationNum", "asc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          let curr;
          if (doc.data().currentQueueId) curr = doc.data().currentQueueId.num;
          else curr = null;
          return {
            station: `Station ${doc.data().stationNum}`,
            currentNum: curr,
          };
        });
        const changes = snapshot
          .docChanges()
          .map((change) => `Station ${change.doc.data().stationNum}`);
        displayQueueNums.value = { data, changes };
      });

    onUnmounted(displayUnsubscribe);

    return displayQueueNums;
  };

  const getQueueNumberById = async (id) => {
    if (id == "" || id == null) return;
    let queueNum;

    queueNum = await queueNumCollection.doc(id).get();

    if (!queueNum.exists) return false;

    return { id: id, ...queueNum.data() };
  };

  const getQueueNumberByAuth = async (uid) => {
    try {
      const queueNum = await (await stationDetailsRef.doc(uid).get()).data()
        .currentQueueId;

      return Promise.resolve(queueNum);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  /**
   * Sends back the number to the back of the queue
   * @param String id
   * @returns Promise
   */
  const unqueueNum = async (id) => {
    return new Promise((resolve, reject) => {
      if (!id) reject("ID is not valid.");
      if (!auth.currentUser) reject("You are not authenticated.");

      queueNumCollection
        .doc(id)
        .get()
        .then((docRef) => {
          if (!docRef.exists) reject("Could not find queue number.");
          stationDetailsRef.doc(auth.currentUser.uid).update({
            currentQueueId: null,
          });
          docRef.ref
            .update({
              queueTime: firebase.firestore.FieldValue.serverTimestamp(),
              stage: decrement,
            })
            .then(() => {
              resolve("Queue number has been set back");
            });
        })
        .catch((err) => reject(err));
    });
  };

  return {
    queueItems,
    issueQueueNum,
    callForNextNum,
    finishCurrentNum,
    stationDisplayQueueNums,
    getQueueNumberById,
    unqueueNum,
    getQueueNumberByAuth,
  };
}

export function useAdmin() {
  const stations = ["registration", "screening", "vitals", "vaccination"];

  const seedUsers = async () => {
    try {
      const batch = firestore.batch();

      batch.set(queueCounterRef, {
        counter: 0,
      });

      for (const station of stations) {
        let uids = [];
        for (let x = 1; x <= 10; x++) {
          console.log(`Creating user ${x} of station ${station}`);
          const userCred = await auth.createUserWithEmailAndPassword(
            `station-${x}@${station}.station`,
            `${station}!stn${x}`
          );
          uids.push(userCred.user.uid);
          batch.set(
            firestore.collection("stationDetails").doc(userCred.user.uid),
            {
              currentQueueId: null,
              stationNum: x,
              stationType: station,
            }
          );
        }
        batch.set(firestore.collection("permissions").doc(station), {
          ids: uids,
        });
      }
      await batch.commit();
      return Promise.resolve("Done seeding!");
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const resetQueue = async () => {
    try {
      const writeBatch = firestore.batch();
      let deleteBatch = firestore.batch();
      const stationDetailsData = await firestore
        .collection("stationDetails")
        .get();
      const queueItemsData = await queueNumCollection.get();

      writeBatch.set(queueCounterRef, {
        count: 0,
      });

      stationDetailsData.docs.forEach((docRef) => {
        writeBatch.update(docRef.ref, {
          currentQueueId: null,
        });
      });

      let i = 0;

      for (const doc of queueItemsData.docs) {
        deleteBatch.delete(doc.ref);
        i++;
        if (i > 400) {
          i = 0;
          await deleteBatch.commit();
          deleteBatch = firestore.batch();
        }
      }

      await deleteBatch.commit();
      await writeBatch.commit();

      return Promise.resolve("Done resetting the queue!");
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return {
    seedUsers,
    resetQueue,
  };
}
