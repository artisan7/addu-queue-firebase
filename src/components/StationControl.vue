<template>
  <div>
    <h2>Currently Serving #</h2>
    <h1 v-if="this.currentlyServing === null">None</h1>
    <h1 v-else>{{ currentlyServing.num }}</h1>
    <div>
      <button @click="callNext">CALL NEXT #</button>
      <h2 v-if="this.currentlyServing">
        Finish current patient and call for the next #
      </h2>
      <h2 v-else>Call for the next #</h2>
    </div>
    <div>
      <button @click="finishCurrent">FINISH</button>
      <h2 v-if="this.currentlyServing">
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
    const { callForNextNum } = useQueue();
    const currentlyServing = ref(null);

    console.log(props);

    const finishCurrent = () => {
      console.log("FINISH SERVE");
    };

    const callNext = () => {
      console.log("CALLING FOR NEXT", props.stageId);
      callForNextNum(props.stageId)
        .then((queueNum) => (currentlyServing.value = queueNum))
        .catch((err) => {
          console.log("Error: ", err);
        });
    };

    return {
      currentlyServing,
      finishCurrent,
      callNext,
    };
  },
};
</script>
