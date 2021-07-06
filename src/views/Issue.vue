<template>
  <div>
    Issue Num
    <h2>Issue #</h2>
    <button @click="issueQueueNumLocal" :disabled="processing" class="btn">
      Issue No.
    </button>
    <div v-if="previousQueueNum">
      You just issued Queue No. {{ previousQueueNum }}
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
    const { queueItems, issueQueueNum } = useQueue();
    const processing = ref(false);
    const previousQueueNum = ref(null);

    const issueQueueNumLocal = () => {
      processing.value = true;
      issueQueueNum().then((val) => {
        // console.log(val);
        processing.value = false;

        previousQueueNum.value = val;
      });
    };

    return {
      queueItems,
      issueQueueNumLocal,
      previousQueueNum,
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
