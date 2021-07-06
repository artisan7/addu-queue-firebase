<template>
  <div>
    <h2>Currently Serving #</h2>
    <h1 v-if="this.currentlyServing === null">None</h1>
    <h1 v-else>{{ currentlyServing.num }}</h1>
    <div v-if="this.currentlyServing">
      <button :disabled="processing" @click="finishAndCallNext">
        CALL NEXT #
      </button>
      <h2>
        Finish current patient and call for the next #
      </h2>
    </div>
    <div v-else>
      <button :disabled="processing" @click="callNext">CALL NEXT #</button>
      <h2>Call for the next #</h2>
    </div>
    <div v-if="this.currentlyServing">
      <button :disabled="processing" @click="finishCurrent">FINISH</button>
      <h2>
        Finish with current patient
      </h2>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQueue } from "../firebase";
export default {
  name: "StationControl",
  props: {
    stationName: {
      type: String,
      required: true,
    },
    stageId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { callForNextNum, finishCurrentNum } = useQueue();
    const currentlyServing = ref(null);
    const processing = ref(false);

    const finishCurrent = async () => {
      processing.value = true;
      await finishCurrentNum(currentlyServing.value.id);
      processing.value = false;
      currentlyServing.value = null;
    };

    const callNext = async () => {
      //   console.log("CALLING FOR NEXT", props.stageId);
      processing.value = true;
      await callForNextNum(props.stageId)
        .then((queueNum) => {
          currentlyServing.value = queueNum;
          processing.value = false;
        })
        .catch((err) => {
          console.log("Error: ", err);
          processing.value = false;
        });
    };

    const finishAndCallNext = async () => {
      await finishCurrent();
      await callNext();
    };

    return {
      currentlyServing,
      finishCurrent,
      callNext,
      processing,
      finishAndCallNext,
    };
  },
  created() {
    window.onbeforeunload = () => {
      alert("HELLO");
    };
  },
};
</script>
