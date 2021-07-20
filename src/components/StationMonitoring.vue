<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <!-- Number of People In Vitals -->
        <MDBCard>
          <MDBCardBody class="text-center">
            <MDBCardTitle
              >Number of People Waiting in
              {{ currentStationName }}</MDBCardTitle
            >
            <MDBCardText class="card-text display-2">
              <span v-if="waitingQueueList">
                {{ waitingQueueList.length }}
              </span>
              <span v-else>0</span>
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </div>
      <div class="col">
        <!-- Average Waiting Time -->
        <MDBCard>
          <MDBCardBody class="text-center">
            <MDBCardTitle>Average Waiting Time</MDBCardTitle>
            <MDBCardText class="card-text display-2"
              >{{ Math.round(waitTime / 60) }} min(s)</MDBCardText
            >
          </MDBCardBody>
        </MDBCard>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div
          class="bg-primary text-white display-6 text-center m-2 p-2 rounded shadow"
        >
          {{ monitoringTitle }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card my-2 h-100">
          <div class="card-body text-center">
            <h4 class="card-title">Number Selected</h4>
            <p class="card-text display-2">
              <span v-if="currentQueueNumber">
                {{ currentQueueNumber.num }}
              </span>
              <span v-else>None</span>
            </p>
          </div>
        </div>
      </div>
      <div class="col m-0">
        <div class="d-flex flex-column h-100 m-0 gap-2">
          <MDBBtn color="primary" class="h-100" @click="advanceNum">
            Move to Next Step
          </MDBBtn>
          <MDBBtn color="danger" class="h-100" @click="rejectNum">
            Reject Patient
          </MDBBtn>
        </div>
      </div>
    </div>
    <div class="row row-cols-2 row-cols-md-4 row-cols-lg-5 mt-4">
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

    const monitoringTitle = computed(() => {
      const names = {
        screening: "Screening to Vitals",
        vitals: "Vitals to Vaccination",
        vaccination: "Vaccination to Post-Vaccination",
        post: "Post-Vaccination to Exit",
      };
      return names[props.stationName];
    });

    const currentStationName = computed(() => {
      const names = {
        screening: "Screening",
        vitals: "Vitals",
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
        return;
      }

      advanceQueueNumber(currentQueueNumber.value.id)
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
        });
    };

    const rejectNum = () => {
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
        });
    };

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
    };
  },
};
</script>

<style></style>
