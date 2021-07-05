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
const queueNumCollection = firestore.collection("queue");
const queueItemsQuery = queueNumCollection.orderBy("num", "asc");
var queueCounterRef = firestore.collection("counter").doc("queueNum");

export function useQueue() {
  /**
   * Gets the queue items as a VueJS ref
   * @date 2021-07-05
   * @returns ref
   */
  const queueItems = ref([]);

  //   Watch the queue items
  // Also, hook for cleanup when component is unmounted
  const unsubscribe = queueItemsQuery.onSnapshot((snapshot) => {
    queueItems.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reverse();
  });

  onUnmounted(unsubscribe);

  /**
   * Issue Queue No
   * Uses transactions to get the current queue no.
   * @date 2021-07-05
   * @returns Number
   */
  const issueQueueNo = async () => {
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

  return { queueItems, issueQueueNo };
}
