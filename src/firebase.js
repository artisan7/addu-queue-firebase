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
        // Warning:
        // What lies before you is very stupid very hacky code
        // TODO: MAKE THIS BETTER
        // console.log("BEFORE QUERY");

        // Get the first possible queue number with the appropriate stage
        // Theoretically, this should be enough, but noooooo
        // Firestore is too picky
        let query = await queueNumAscending
          .where("stage", "==", stage)
          .limit(1)
          .get();

        // If query is empty AKA No one w/ the stage is found,
        // Throw an error
        if (query.empty) throw "No one is in the waiting list.";

        // Get the document reference from the collection...
        // With the document id we get from the query
        var doc = queueNumCollection.doc(query.docs[0].id);

        // console.log("before transaction", query, doc);
        // Finally do the transaction.
        return transaction.get(doc).then((snapshot) => {
          // More error to throw
          if (!snapshot) throw "Document does not exist";

          // Get the next queue num object
          nextQueueNum = { id: query.docs[0].id, ...snapshot.data() };

          // console.log(snapshot);

          const numId = snapshot.id;

          // Increment the stage
          const nextStage = snapshot.data().stage + 1;

          // Update the table
          transaction.update(doc, {
            stage: nextStage,
          });

          transaction.update(stationDetailsRef.doc(auth.currentUser.uid), {
            currentQueueId: numId,
          });
        });
      });
    } catch (err) {
      // Return the error
      return Promise.reject(err);
    }

    return nextQueueNum;
  };

  const finishCurrentNum = async (queueId) => {
    try {
      if (!auth.currentUser) throw "You are not authenticated.";
      if (queueId === null || queueId === undefined)
        throw "You have returned an invalid queue number";
      await queueNumCollection.doc(queueId).update({
        stage: increment,
      });
      await stationDetailsRef.doc(auth.currentUser.uid).update({
        currentQueueId: null,
      });
      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const stationDisplayQueueNums = (stage) => {
    const displayQueueNums = ref([]);

    // Watch the queue items
    // Also, hook for cleanup when component is unmounted
    const displayUnsubscribe = queueNumAscending
      .where("stage", "==", stage)
      .onSnapshot((snapshot) => {
        displayQueueNums.value = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .reverse();
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

  const seedUsers = async () => {
    const stations = ["registration", "screening", "vitals", "vaccination"];

    const batch = firestore.batch();

    await stations.forEach(async (station) => {
      await userUids[station].forEach(async (uid, ind) => {
        const stationRef = await firestore
          .collection("stationDetails")
          .doc(uid);

        batch.set(stationRef, {
          currentQueueId: null,
          stationNum: ind + 1,
          stationType: station,
        });
      });
    });

    batch.commit().then(() => console.log("Seeding done!"));
  };

  return {
    queueItems,
    issueQueueNum,
    callForNextNum,
    finishCurrentNum,
    stationDisplayQueueNums,
    getQueueNumberById,
    unqueueNum,
    seedUsers,
  };
}
