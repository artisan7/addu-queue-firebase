import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { ref, onUnmounted, computed } from "vue";

firebase.initializeApp({
    apiKey: "AIzaSyCgaJjOiWB4kq9YyiB29dfbBQWzUyMabZo",
    authDomain: "addu-queue-firebase.firebaseapp.com",
    projectId: "addu-queue-firebase",
    storageBucket: "addu-queue-firebase.appspot.com",
    messagingSenderId: "241997341660",
    appId: "1:241997341660:web:eeb4ad2f586983ec506519",
});

const auth = firebase.auth();

export function useAuth() {
    const user = ref(null);
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user));
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
const queueItemsCollection = firestore.collection("queueItem");
const queueItemsQuery = queueItemsCollection.orderBy("no", "asc");

export function useQueue() {
    const queueItems = ref([]);
    const unsubscribe = queueItemsQuery.onSnapshot(snapshot => {
        queueItems.value = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .reverse();
    });

    onUnmounted(unsubscribe);

    const sendQueueItem = text => {
        const queue = {
            no: text,
            stage: 0,
        };
        queueItemsCollection.add(queue);
    };

    return { queueItems, sendQueueItem };
}
