<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="row">
          <!-- Number Being Served -->
          <MDBCard>
            <MDBCardBody class="text-center">
              <MDBCardTitle>Number Being Served</MDBCardTitle>
              <MDBCardText class="card-text display-2">
                8
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </div>
        <div class="row">
          <!-- Number of People In Vitals -->
          <MDBCard>
            <MDBCardBody class="text-center">
              <MDBCardTitle
                >Number of People Waiting in {{ stationName }}</MDBCardTitle
              >
              <MDBCardText class="card-text display-2">
                <span v-if="queueList">
                  {{ queueList.length }}
                </span>
                <span v-else>0</span>
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <!-- Number Being Served -->
          <MDBCard>
            <MDBCardBody class="text-center">
              <MDBCardTitle>Number Being Served</MDBCardTitle>
              <MDBCardText class="card-text display-2">
                8
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </div>
        <div class="row">
          <!-- Average Waiting Time -->
          <MDBCard>
            <MDBCardBody class="text-center">
              <MDBCardTitle>Average Waiting Time</MDBCardTitle>
              <MDBCardText class="card-text display-2">10</MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="bg-primary text-white display-6 text-center m-2">
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
          <MDBBtn color="primary" class="h-100">
            Move to Next Step
          </MDBBtn>
          <MDBBtn color="danger" class="h-100">
            Reject Patient
          </MDBBtn>
        </div>
      </div>
    </div>
    <div class="row row-cols-2 row-cols-md-4 row-cols-lg-5 mt-4">
      <div class="col" v-for="(queueItem, ind) in queueList" :key="ind">
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
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from "mdb-vue-ui-kit";

export default {
  props: ["stationStage"],
  components: { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText },
  setup(props) {
    const { getStationQueueList } = useMonitoring(props.stationStage);

    const queueList = getStationQueueList();
    const currentQueueNumber = ref(null);

    const monitoringTitle = computed(() => {
      const names = {
        screening: "Registration to Screening",
        monitoring: "Screening to Monitoring",
        vaccination: "Monitoring to Vaccination",
        post: "Vaccination to Post-Vaccination",
        exit: "Post-Vaccination to Exit",
      };
      return names[props.stationName];
    });

    const stationName = computed(() => {
      const names = {
        screening: "Registration",
        monitoring: "Screening",
        vaccination: "Monitoring",
        post: "Vaccination",
        exit: "Post-Vaccination",
      };
      return names[props.stationName];
    });

    const selectQueueNumber = (ind) => {
      // console.log("SELECTING", ind);
      currentQueueNumber.value = queueList.value[ind];
      // console.log("NUM:", currentQueueNumber.value);
    };

    return {
      // stationName,
      // stationStage
      stationName,
      monitoringTitle,
      queueList,
      currentQueueNumber,
      selectQueueNumber,
    };
  },
};
</script>

<style></style>
