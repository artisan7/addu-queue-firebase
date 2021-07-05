<template>
  <div>
    Registration
    <h2>Issue #</h2>
    <button @click="issueQueueNoLocal" :disabled="processing" class="btn">
      Issue No.
    </button>
    <div v-if="previousQueueNo">
      You just issued Queue No. {{ previousQueueNo }}
    </div>
    <pre> {{ queueItems }}</pre>
  </div>
</template>

<script>
// import { ref, watch, nextTick } from "vue";
import { ref } from "vue";
import { useQueue } from "../firebase";

export default {
  name: "Registration",
  setup() {
    const { queueItems, issueQueueNo } = useQueue();
    const processing = ref(false);
    const previousQueueNo = ref(null);

    const issueQueueNoLocal = () => {
      processing.value = true;
      // issueQueueNo(latestQueueNo.value);
      issueQueueNo().then((val) => {
        console.log(val);
        processing.value = false;

        previousQueueNo.value = val;
      });
    };

    return {
      queueItems,
      issueQueueNoLocal,
      previousQueueNo,
      processing,
    };
  },
};
</script>
<style>
.btn {
  background: none;
  border: 1px solid black;
  padding: 1rem 2rem;
  border-radius: 5px;
}

.btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.btn:focus {
  background: gray;
}
</style>
