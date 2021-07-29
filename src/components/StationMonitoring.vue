<template>
  <div class="container monitoring-layout">
    <!-- Number of People In Vitals -->
    <MDBCard style="grid-area: numWaiting">
      <MDBCardBody class="text-center">
        <MDBCardTitle
          >Number of People Waiting in {{ currentStationName }}</MDBCardTitle
        >
        <MDBCardText class="card-text display-2">
          <span v-if="waitingQueueList">
            {{ waitingQueueList.length }}
          </span>
          <span v-else>0</span>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>

    <!-- Average Waiting Time -->
    <MDBCard style="grid-area: avgTime">
      <MDBCardBody class="text-center">
        <MDBCardTitle>Average Waiting Time</MDBCardTitle>
        <MDBCardText class="card-text">
          <h2 class="display-2">{{ averageTimePerPerson }}</h2>
          <p class="subtitle-1" v-if="averageTimePerPerson != 'Waiting...'">
            h:m:s
          </p>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>

    <div
      class="bg-primary text-white display-6 text-center p-2 rounded shadow"
      style="grid-area: hero"
    >
      {{ monitoringTitle }}
    </div>

    <!-- Average Waiting Time -->
    <MDBCard style="grid-area: numSel">
      <MDBCardBody class="text-center">
        <MDBCardTitle>Number Selected</MDBCardTitle>
        <MDBCardText class="card-text display-2">
          <span v-if="currentQueueNumber">
            {{ currentQueueNumber.num }}
          </span>
          <span v-else>None</span>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>

    <div class="d-flex flex-column h-100 m-0 gap-2" style="grid-area: controls">
      <MDBBtn
        color="success"
        class="h-100"
        @click="advanceNum"
        :disabled="processing"
      >
        Move to Next Step
      </MDBBtn>
      <MDBBtn
        v-if="stationStage < 6"
        color="danger"
        class="h-100"
        @click="rejectNum"
        :disabled="processing"
      >
        Reject Patient
      </MDBBtn>
    </div>
    <!-- </div> -->
    <div
      class="row row-cols-2 row-cols-md-4 row-cols-lg-5 mt-4"
      style="grid-area: nums"
    >
      <div class="col" v-for="(queueItem, ind) in waitingQueueList" :key="ind">
        <MDBCard
          :bg="ind % 2 ? 'primary' : 'warning'"
          :text="ind % 2 ? 'white' : 'black'"
          class="text-center my-1"
        >
          <a
            href="#"
            :class="{
              'text-white': ind % 2,
              'text-black': !(ind % 2),
            }"
            @click.prevent="selectQueueNumber(ind)"
          >
            <MDBCardBody>
              <MDBCardTitle>{{ queueItem.num }}</MDBCardTitle>
              <MDBCardText>Queue Num</MDBCardText>
            </MDBCardBody>
          </a>
        </MDBCard>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import { useMonitoring } from "../firebase";
import { createToast } from "mosha-vue-toastify";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from "mdb-vue-ui-kit";

export default {
  props: ["stationName", "stationStage"],
  emits: ["error", "success"],
  components: { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText },
  setup(props) {
    const {
      getStationQueueList,
      advanceQueueNumber,
      rejectQueueNumber,
    } = useMonitoring(props.stationStage);

    const { queueList, waitTime } = getStationQueueList();
    const currentQueueNumber = ref(null);
    const processing = ref(false);

    const monitoringTitle = computed(() => {
      const names = {
        registration: "Registration to Screening",
        vitals: "Vitals to Counseling",
        counseling: "Counseling to Screening",
        screening: "Screening to Vaccination",
        vaccination: "Vaccination to Post-Vaccination",
        post: "Post-Vaccination to Exit",
      };
      return names[props.stationName];
    });

    const currentStationName = computed(() => {
      const names = {
        screening: "Screening",
        vitals: "Vitals",
        counseling: "Counseling",
        vaccination: "Vaccination",
        post: "Post-Vaccination",
      };
      return names[props.stationName];
    });

    const waitingQueueList = computed(() => {
      if (queueList.value)
        return queueList.value.filter(
          (queue) => queue.stage == props.stationStage
        );
      return [];
    });

    const selectQueueNumber = (ind) => {
      currentQueueNumber.value = queueList.value[ind];
    };

    const advanceNum = () => {
      processing.value = true;
      if (!currentQueueNumber.value) {
        processing.value = false;
        createToast(
          {
            title: "Error",
            description: "No number selected.",
          },
          {
            type: "warning",
            position: "top-center",
          }
        );
        return;
      }

      advanceQueueNumber(currentQueueNumber.value.id)
        .then((message) => {
          processing.value = false;
          createToast(
            {
              title: "Success",
              description: message,
            },
            {
              type: "success",
              position: "top-center",
            }
          );
          currentQueueNumber.value = null;
        })
        .catch((err) => {
          processing.value = false;
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
        });
    };

    const rejectNum = () => {
      processing.value = true;
      if (!currentQueueNumber.value) {
        createToast(
          {
            title: "Error",
            description: "No number selected.",
          },
          {
            type: "warning",
            position: "top-center",
          }
        );
        processing.value = false;
        return;
      }

      rejectQueueNumber(currentQueueNumber.value.id)
        .then((message) => {
          createToast(
            {
              title: "Success",
              description: message,
            },
            {
              type: "success",
              position: "top-center",
            }
          );
          currentQueueNumber.value = null;

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

    const averageTimePerPerson = computed(() => {
      if (waitTime.value)
        return new Date(waitTime.value * 1000).toISOString().substr(11, 8);
      else return "Waiting...";
    });

    return {
      // stationName,
      // stationStage
      currentStationName,
      monitoringTitle,
      waitingQueueList,
      currentQueueNumber,
      selectQueueNumber,
      advanceNum,
      waitTime,
      rejectNum,
      averageTimePerPerson,
      queueList,
      processing,
    };
  },
};
</script>
