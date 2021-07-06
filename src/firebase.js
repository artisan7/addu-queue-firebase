import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { ref, onUnmounted, computed } from "vue";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB7_aDpN3NAqRoIKCs7UDMBsE7BFFHZQrE",
  authDomain: "addu-vaccination-queue.firebaseapp.com",
  projectId: "addu-vaccination-queue",
  storageBucket: "addu-vaccination-queue.appspot.com",
  messagingSenderId: "671678336581",
  appId: "1:671678336581:web:364ad6f86c6802b0c1dd2c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export function useAuth() {
  const user = ref(null);
  const unsubscribe = auth.onAuthStateChanged((_user) => (user.value = _user));
  onUnmounted(unsubscribe);
  const isLogin = computed(() => user.value !== null);

  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(googleProvider);
  };

  const signOut = () => auth.signOut();

  return { user, isLogin, signIn, signOut };
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
const queueNumAscending = queueNumCollection.orderBy("num", "asc");

/**
 * Counter for the queue
 * @returns Document
 */
const queueCounterRef = firestore.collection("counter").doc("queueNum");

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
          stage: 0,
        });
      });
    });

    return newQueueNo;
  };

  // Function Definition for Station Control
  const callForNextNum = async (stage) => {
    var nextQueueNum;

    // .get()
    // .then((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     console.log(doc.data());
    //   });
    // });

    try {
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

          // Increment the stage
          const nextStage = snapshot.data().stage + 1;

          // Update the table
          transaction.update(doc, {
            stage: nextStage,
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
    if (queueId === null || queueId === undefined) return;
    const increment = firebase.firestore.FieldValue.increment(1);
    await queueNumCollection.doc(queueId).update({
      stage: increment,
    });
    return true;
  };

  const stationDisplayQueueNums = (stage) => {
    const displayQueueNums = ref([]);

    // Watch the queue items
    // Also, hook for cleanup when component is unmounted
    const displayUnsuscribe = queueNumAscending
      .where("stage", "==", stage)
      .onSnapshot((snapshot) => {
        displayQueueNums.value = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .reverse();
      });

    onUnmounted(displayUnsuscribe);

    return displayQueueNums;
  };

  const getQueueNumberById = async (id) => {
    let queueNum;

    queueNum = await queueNumCollection.doc(id).get();

    if (!queueNum.exists) return false;

    return { id: id, ...queueNum.data() };
  };

  return {
    queueItems,
    issueQueueNum,
    callForNextNum,
    finishCurrentNum,
    stationDisplayQueueNums,
    getQueueNumberById,
  };
}
