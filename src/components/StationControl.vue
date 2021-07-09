<template>
  <MDBCard id="control-layout">
    <MDBCardBody id="control-layout-body">
      <h2>Currently Serving #</h2>
      <h1 v-if="this.currentlyServing === null">None</h1>
      <h1 v-else>{{ currentlyServing.num }}</h1>
      <div v-if="this.currentlyServing">
        <MDBBtn color="info" class="btns" :disabled="processing">
          CALL Prev #
        </MDBBtn>
      </div>
      <div v-if="this.currentlyServing">
        <MDBBtn
          color="primary"
          class="btns"
          :disabled="processing"
          @click="finishAndCallNext"
          size="lg"
        >
          CALL NEXT #
        </MDBBtn>
      </div>
      <div v-else>
        <MDBBtn
          color="primary"
          :disabled="processing"
          @click="callNext"
          size="lg"
          >CALL NEXT #</MDBBtn
        >
      </div>
      <div v-if="this.currentlyServing">
        <MDBBtn
          color="warning"
          class="btns"
          :disabled="processing"
          @click="finishCurrent"
          >FINISH</MDBBtn
        >
        <h2 class="lead">Finish with current patient</h2>
      </div>

      <div v-if="this.currentlyServing">
        <MDBBtn color="danger" :disabled="processing" @click="finishCurrent"
          >Send Back</MDBBtn
        >
        <h2 class="lead">Finish with current patient</h2>
      </div>
    </MDBCardBody>
  </MDBCard>
  <section id="legend">
    <h5>Notes:</h5>
    <ul>
      <li class="notes">Call Next # - Calling next number</li>
      <li class="notes">
        Finish - When you are done with your current patient
      </li>
      <li class="notes">
        Call Prev # - Call the ones you have skipped because he/she didn't show
        up
      </li>
    </ul>
  </section>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ref, computed } from "vue";
import { useQueue } from "../firebase";
import { useRoute } from "vue-router";
import { MDBCard, MDBCardBody, MDBBtn } from "mdb-vue-ui-kit";

export default {
  name: "StationControl",
  components: { MDBCard, MDBCardBody, MDBBtn },
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
    // const mapStage = {
    //   registration: 0,
    //   screening: 2,
    //   vitals: 4,
    //   vaccination: 6,
    // };

    // Computed
    const localStorageName = computed(() => {
      return `ateneoQueueIdStation${route.params.station}`;
    });

    // Methods

    // Finish current queue number
    const finishCurrent = async () => {
      processing.value = true;

      await finishCurrentNum(currentlyServing.value.id);

      processing.value = false;
      currentlyServing.value = null;

      localStorage.setItem(localStorageName.value, null);
    };

    // Call for the next queue number
    const callNext = async () => {
      //   console.log("CALLING FOR NEXT", props.stageId);
      processing.value = true;

      await callForNextNum(props.stageId)
        .then((queueNum) => {
          currentlyServing.value = queueNum;
          localStorage.setItem(localStorageName.value, queueNum.id);
          processing.value = false;
        })
        .catch((err) => {
          // TODO: Create error handling
          console.log("Error: ", err);
          localStorage.setItem(localStorageName.value, null);
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
      if (localStorage.getItem(localStorageName.value) != "null")
        getQueueNumberById(localStorage.getItem(localStorageName.value)).then(
          (data) => {
            if (data) {
              currentlyServing.value = data;
            }
          }
        );
      else {
        currentlyServing.value = null;
      }
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
      localStorageName,
    };
  },
};
</script>

<style>
#control-layout {
  border: 3px solid #d7d7d7;
  text-align: center;
}
.btns {
  margin-bottom: 10px !important;
}

#num-card {
  background: #ff9901;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  text-align: center;
  border-radius: 10px;
  width: 70%;
}
#num-card h1 {
  font-style: normal;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
