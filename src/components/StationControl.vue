<template>
  <MDBCard id="control-layout" class=" text-center">
    <MDBCardBody id="control-layout-body">
      <h2 class="display-3">Current Queue Number</h2>
      <div class="d-flex justify-content-center m-2">
        <queue-number-card>
          <span v-if="this.currentlyServing === null">None</span>
          <span v-else>{{ currentlyServing.num }}</span>
        </queue-number-card>
      </div>
      <div v-if="this.currentlyServing">
        <MDBBtn
          color="primary"
          class="btns"
          :disabled="processing"
          @click="finishAndCallNext"
          size="lg"
        >
          Call Next Number
        </MDBBtn>
        <h2 class="lead">
          Finish with current patient and call another number
        </h2>
      </div>
      <div v-else>
        <MDBBtn
          color="primary"
          :disabled="processing"
          @click="callNext"
          size="lg"
          >Call Next Number</MDBBtn
        >
        <h2 class="lead">Call a number from the queue</h2>
      </div>
      <div v-if="this.currentlyServing">
        <MDBBtn
          color="info"
          class="btns"
          :disabled="processing"
          @click="finishCurrent"
          >FINISH</MDBBtn
        >
        <h2 class="lead">Finish with current patient</h2>
        <MDBBtn
          color="danger"
          :disabled="processing"
          @click="unqueueNumLocal"
          outline
          size="sm"
          >Send Back</MDBBtn
        >
        <h2 class="lead">
          Send current patient back to the queue<br />
          <small class="text-danger"
            >Only do this when the patient is late or missing</small
          >
        </h2>
        <MDBBtn
          color="danger"
          :disabled="processing"
          @click="unqueueNumLocal"
          size="sm"
          >Reject</MDBBtn
        >
        <h2 class="lead">
          Remove current patient from the queue<br />
          <small class="text-danger"
            >Only do this when the patient is not valid for vaccination</small
          >
        </h2>
      </div>
    </MDBCardBody>
  </MDBCard>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
import { useQueue, useAuth } from "../firebase";
import { MDBCard, MDBCardBody, MDBBtn } from "mdb-vue-ui-kit";
import QueueNumberCard from "./QueueNumberCard";
import { createToast } from "mosha-vue-toastify";

export default {
  name: "StationControl",
  components: { MDBCard, MDBCardBody, MDBBtn, QueueNumberCard },
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
    const {
      callForNextNum,
      finishCurrentNum,
      unqueueNum,
      getQueueNumberByAuth,
    } = useQueue();
    const { user } = useAuth();

    // Data
    const currentlyServing = ref(null);
    const processing = ref(false);
    // const mapStage = {
    //   registration: 0,
    //   screening: 2,
    //   vitals: 4,
    //   vaccination: 6,
    // };

    // Methods

    // Finish current queue number
    const finishCurrent = async () => {
      processing.value = true;

      try {
        await finishCurrentNum(currentlyServing.value.id);
        currentlyServing.value = null;
      } catch (err) {
        createToast(
          {
            title: "Error",
            description: err,
          },
          {
            type: "danger",
            position: "top-center",
          }
        );
      }
      processing.value = false;
    };

    // Call for the next queue number
    const callNext = async () => {
      //   console.log("CALLING FOR NEXT", props.stageId);
      processing.value = true;

      await callForNextNum(props.stageId)
        .then((queueNum) => {
          currentlyServing.value = queueNum;
          processing.value = false;
        })
        .catch((err) => {
          createToast(
            {
              title: "Error",
              description: err,
            },
            {
              type: "danger",
              position: "top-center",
            }
          );
          processing.value = false;
        });
    };

    // Combine finish and calling
    const finishAndCallNext = async () => {
      await finishCurrent();
      await callNext();
    };

    // Unqueue current number
    function unqueueNumLocal() {
      // console.log(currentlyServing.value);
      unqueueNum(currentlyServing.value.id)
        .then(() => {
          currentlyServing.value = null;
        })
        .catch((err) =>
          createToast(
            {
              title: "Error",
              description: err,
            },
            {
              type: "danger",
              position: "top-center",
            }
          )
        );
    }

    processing.value = true;

    watch(
      () => user.value,
      () => {
        getQueueNumberByAuth(user.value.uid)
          .then((data) => {
            if (data) currentlyServing.value = data;
            processing.value = false;
          })
          .catch(() => {
            createToast(
              {
                title: "Error",
                description:
                  "Something went wrong with the loading of the data",
              },
              {
                type: "danger",
                position: "top-center",
              }
            );
          });
      }
    );

    return {
      currentlyServing,
      finishCurrent,
      callNext,
      processing,
      finishAndCallNext,
      unqueueNumLocal,
      getQueueNumberByAuth,
    };
  },
};
</script>

<style>
#control-layout {
  border: 3px solid #d7d7d7;
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
