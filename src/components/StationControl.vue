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
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
import { useQueue } from "../firebase";
import { useRoute } from "vue-router";

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
    // Hooks
    const route = useRoute();
    const { callForNextNum, finishCurrentNum, getQueueNumberById } = useQueue();

    // Data
    const currentlyServing = ref(null);
    const processing = ref(false);

    // Methods

    // Finish current queue number
    const finishCurrent = async () => {
      processing.value = true;

      await finishCurrentNum(currentlyServing.value.id);

      processing.value = false;
      currentlyServing.value = null;

      localStorage.setItem("ateneoQueueId", null);
    };

    // Call for the next queue number
    const callNext = async () => {
      //   console.log("CALLING FOR NEXT", props.stageId);
      processing.value = true;

      await callForNextNum(props.stageId)
        .then((queueNum) => {
          currentlyServing.value = queueNum;
          localStorage.setItem("ateneoQueueId", queueNum.id);
          processing.value = false;
        })
        .catch((err) => {
          // TODO: Create error handling
          console.log("Error: ", err);
          localStorage.setItem("ateneoQueueId", null);
          processing.value = false;
        });
    };

    // Combine finish and calling
    const finishAndCallNext = async () => {
      await finishCurrent();
      await callNext();
    };

    // Check to see if there's still a number not yet finished
    function checkLocalStorage() {
      if (localStorage.getItem("ateneoQueueId"))
        getQueueNumberById(localStorage.getItem("ateneoQueueId")).then(
          (data) => {
            if (data) {
              if (data.stage == props.stageId + 1)
                currentlyServing.value = data;
              else currentlyServing.value = null;
            }
          }
        );
    }

    // On initial page load, check
    checkLocalStorage();

    // When route changes, check
    watch(
      () => route.params.station,
      () => {
        checkLocalStorage();
      }
    );

    return {
      currentlyServing,
      finishCurrent,
      callNext,
      processing,
      finishAndCallNext,
    };
  },
};
</script>
