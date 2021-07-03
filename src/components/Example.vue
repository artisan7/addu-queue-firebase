<template>
  <div>Hello world!</div>
  <div>
    <input type="number" v-model="noInput" />
    <button @click="send">Add Item</button>
  </div>
  <pre>
      {{ queueItems }}
  </pre>
  <div>{{ noInput }}</div>
</template>

<script>
// import { ref, watch, nextTick } from "vue";
import { ref } from "vue";
import { useQueue } from "../firebase";

export default {
  setup() {
    const { queueItems, sendQueueItem } = useQueue();
    const noInput = ref(0);
    // watch( queueItems, () => {

    // })

    const send = () => {
      sendQueueItem(noInput.value);
    };

    return { queueItems, noInput, send };
  },
};
</script>