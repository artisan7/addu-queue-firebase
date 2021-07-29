import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "./secrets";
import { ref, onUnmounted, computed } from "vue";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

const stations = [
  "registration",
  "vitals",
  "counseling",
  "screening",
  "vaccination",
  "post",
];

/** Contains the user ids of the auth users and their permissions
 *
 * Warning: No security whatsoever.
 */
const permissions = () => {
  return new Promise((resolve, reject) => {
    try {
      let userPermissions = {};
      firestore
        .collection("permissions")
        .get()
        .then((snapshot) => {
          snapshot.docs.reduce((mapVal, doc) => {
            // console.log("IN LOOP: ", mapVal, doc.data().ids);
            mapVal[doc.id] = doc.data().ids;
            return mapVal;
          }, userPermissions);
          resolve(userPermissions);
        });
    } catch (err) {
      reject(err);
    }
  });
};

/** Hooks for router */
export function useAuthServer() {
  const user = ref(null);
  auth.onAuthStateChanged((_user) => (user.value = _user));
  const isLogin = computed(() => user.value !== null);

  return { isLogin, user, permissions };
}

/** Hooks for firebase auth in client */
export function useAuth() {
  const user = ref(null);
  const unsubscribe = auth.onAuthStateChanged((_user) => (user.value = _user));
  onUnmounted(unsubscribe);
  const isLogin = computed(() => user.value !== null);

  /**
   * Signs in user
   * @param String email
   * @param String password
   */
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

  /** Signs out user */
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

/*** Collection of all queue numbers */
const queueNumCollection = firestore.collection("queue");

/*** Collection of queue numbers in ascending order */
// const queueNumAscending = queueNumCollection.orderBy("queueTime", "asc");
const queueNumAscending = queueNumCollection.orderBy("num", "asc");

/** Counter for the queue */
const queueCounterRef = firestore.collection("counter").doc("queueNum");

/*** Reference to Station Details Collection in Firestore */
const stationDetailsRef = firestore.collection("stationDetails");

// const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

export function useQueue() {
  /*** Gets the queue items as a VueJS ref */
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
            vitals: null,
            screening: null,
            counseling: null,
            vaccination: null,
            post: null,
          },
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
      const station = stations[stage / 2];

      // Authenticate the user
      if (!auth.currentUser) throw "You are not authenticated.";

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
          // const nextStage = snapshot.data().stage + 1;

          // Update the timestamps
          const newData = snapshot.data();
          newData.timestamps[
            station
          ] = firebase.firestore.FieldValue.serverTimestamp();
          newData.stage = newData.stage + 1;

          // Update the table
          transaction.update(doc, newData);
          transaction.update(stationDetailsRef.doc(auth.currentUser.uid), {
            currentQueueId: { id: snapshot.id, ...newData },
          });
        });
      });
    } catch (err) {
      // Return the error
      console.error(err);
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
        stage: firebase.firestore.FieldValue.increment(1), // Comment this out if you're going to use monitoring
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

  /**
   * Displays the details of each station and their assigned queue numbers
   * @param String station - name of the station category
   * @returns
   */
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
            ...doc.data(),
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

  /** Get queue number by its id */
  const getQueueNumberById = async (id) => {
    if (id == "" || id == null) return;
    let queueNum;

    queueNum = await queueNumCollection.doc(id).get();

    if (!queueNum.exists) return false;

    return { id: id, ...queueNum.data() };
  };

  /** Get the queue number assigned to the authUser's station */
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
   * @param String id - ID of the queue number
   */
  const unqueueNum = (id) => {
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

  const rejectNum = (id) => {
    return new Promise((resolve, reject) => {
      if (!id) reject("ID is not valid.");
      if (!auth.currentUser) reject("You are not authenticated.");

      queueNumCollection
        .doc(id)
        .get()
        .then((docRef) => {
          if (!docRef.exists)
            if (!docRef.exists) reject("Could not find queue number.");
          stationDetailsRef.doc(auth.currentUser.uid).update({
            currentQueueId: null,
          });
          docRef.ref
            .update({
              stage: -1,
            })
            .then(() => {
              resolve("Queue number has been rejected");
            });
        });
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
    rejectNum,
    getQueueNumberByAuth,
  };
}

/** Hook for monitoring pages */
export function useMonitoring(stage) {
  let station;
  if (stage != 1) station = stations[stage / 2];
  else station = stations[0];
  const prevStation = stations[stage / 2 - 1];

  /** Get a list of queue numbers in the current station
   *  and the stations above it. This is so we can calculate
   *  wait times at the same time to save on reads
   */
  const getStationQueueList = () => {
    const queueList = ref(null);
    const waitTime = ref(null);

    queueNumCollection
      .where("stage", ">=", stage)
      .orderBy("stage", "asc")
      .orderBy("num", "asc")
      .onSnapshot((snapshot) => {
        const numCollection = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        queueList.value = numCollection.filter(
          (queueItem) => queueItem.stage == stage
        );
        waitTime.value =
          numCollection
            .filter(
              (queueItem) =>
                queueItem.stage > stage && queueItem.timestamps[station] != null
            )
            .map((queueItem) => {
              let currentStationTimestamp;
              let prevStationTimestamp;

              // console.log(station);

              if (stage != 1) {
                currentStationTimestamp = queueItem.timestamps[station];
                prevStationTimestamp = queueItem.timestamps[prevStation];
              } else {
                currentStationTimestamp = queueItem.timestamps["registration"];
                prevStationTimestamp = queueItem.timestamps["issue"];
              }

              // console.log(
              //   "curr:",
              //   currentStationTimestamp.seconds,
              //   "prev:",
              //   prevStationTimestamp.seconds,
              //   "difference:",
              //   currentStationTimestamp.seconds - prevStationTimestamp.seconds
              // );
              // console.log(
              //   currentStationTimestamp.seconds - prevStationTimestamp.seconds
              // );

              return (
                currentStationTimestamp.seconds - prevStationTimestamp.seconds
              );
            })
            .reduce((a, b) => a + b, 0) / numCollection.length;
      });

    return { queueList, waitTime };
  };

  /** Advance a queue number using the Monitoring UI instead of the station control */
  const advanceQueueNumber = (id) => {
    return new Promise((resolve, reject) => {
      queueNumCollection
        .doc(id)
        .get()
        .then((docRef) => {
          if (!docRef.exists) reject("Number does not exist.");

          const newTimestamp = docRef.data().timestamps;
          newTimestamp[
            station
          ] = firebase.firestore.FieldValue.serverTimestamp();

          // Special case for increment in registration
          let stageIncrement = 2;
          if (stage == 1) stageIncrement = 1;

          docRef.ref
            .update({
              stage: firebase.firestore.FieldValue.increment(stageIncrement), // Increments by 2 (usually) to follow the stage flow
              timestamps: newTimestamp,
            })
            .then(() => {
              resolve("Update successfull!");
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  };

  /** Reject a queue number with the Monitoring UI */
  const rejectQueueNumber = (id) => {
    return new Promise((resolve, reject) => {
      queueNumCollection
        .doc(id)
        .get()
        .then((docRef) => {
          if (!docRef.exists) reject("Number does not exist.");

          docRef.ref
            .update({
              stage: -1,
            })
            .then(() => {
              resolve("Rejection successfull!");
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  };

  return {
    getStationQueueList,
    advanceQueueNumber,
    rejectQueueNumber,
  };
}

/** Hooks for the Admin page. Requires the admin user */
export function useAdmin() {
  /**
   * Seed the entire firestore database
   *
   * Creates the queue counter, the station accounts, and the station details
   */
  const seedUsers = () => {
    const seedStatus = ref(null);
    const seedUserFn = async () => {
      try {
        const batch = firestore.batch();

        batch.set(queueCounterRef, {
          count: 0,
        });

        seedStatus.value = {
          status: "success",
          message: "Counter created.",
        };

        let uids;

        for (const station of ["issue", "monitoring"]) {
          uids = [];

          for (let x = 1; x <= 3; x++) {
            const email = `station-${x}@${station}.station`;
            const password = `${station}!stn${x}`;
            let userCred;
            try {
              userCred = await auth.createUserWithEmailAndPassword(
                email,
                password
              );
              seedStatus.value = {
                status: "success",
                message: `Created user account for ${station} #${x}`,
              };
            } catch (err) {
              userCred = await auth.signInWithEmailAndPassword(email, password);
              seedStatus.value = {
                status: "success",
                message: `Found user account for ${station} #${x}`,
              };
            }
            uids.push(userCred.user.uid);
          }

          batch.set(firestore.collection("permissions").doc(station), {
            ids: uids,
          });
        }

        for (const station of stations) {
          uids = [];
          for (let x = 1; x <= 10; x++) {
            const email = `station-${x}@${station}.station`;
            const password = `${station}!stn${x}`;
            console.log(`Creating user ${x} of station ${station}`);
            let userCred;
            try {
              userCred = await auth.createUserWithEmailAndPassword(
                email,
                password
              );
              seedStatus.value = {
                status: "success",
                message: `Created user account for ${station} station ${x}`,
              };
            } catch (err) {
              userCred = await auth.signInWithEmailAndPassword(email, password);
              seedStatus.value = {
                status: "success",
                message: `Found user account for ${station} station ${x}`,
              };
            }

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

    return {
      seedStatus,
      seedUserFn,
    };
  };

  /**
   * Resets the queue.
   *
   * Station Details collection will have their current queue numbers set to null
   *
   * The entire queue number collection will be deleted
   *
   * Resets counter to 0
   */
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

  const runTestQueries = () => {
    const queryStatus = ref(null);
    const testQuery = () => {
      return new Promise((resolve, reject) => {
        queueNumCollection
          .orderBy("queueTime", "asc")
          .get()
          .then(() => {
            queryStatus.value = {
              type: "success",
              message: "Station Controls OK!",
            };
            // console.log("Issue Num OK!", snapshot);
          })
          .then(() => {
            stationDetailsRef
              .where("stationType", "==", "registration")
              .orderBy("stationNum", "asc")
              .get()
              .then(() => {
                queryStatus.value = {
                  type: "success",
                  message: "Station Display OK!",
                };
                // console.log("Display OK!", snapshot);
              })
              .then(() => {
                queueNumCollection
                  .where("stage", ">=", 2)
                  .orderBy("stage", "asc")
                  .orderBy("num", "asc")
                  .get()
                  .then(() => {
                    queryStatus.value = {
                      type: "success",
                      message: "Monitoring OK!",
                    };
                    resolve("All systems are go!");
                  })
                  .catch((err) => reject(err));
              })
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      });
    };
    return {
      queryStatus,
      testQuery,
    };
  };

  const getQueueNums = () => {
    const queueNums = ref([]);
    queueNumCollection.orderBy("num", "asc").onSnapshot((snapshot) => {
      queueNums.value = snapshot.docs.map((doc) => doc.data());
    });
    return queueNums;
  };

  return {
    seedUsers,
    resetQueue,
    runTestQueries,
    getQueueNums,
  };
}
