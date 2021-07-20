<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="row">
          <!-- Number Being Served -->
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title">Number Being Served</h4>
              <p class="card-text display-2">
                8
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- Number of People In Vitals -->
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title">Number of People Waiting in Vitals</h4>
              <p class="card-text display-2">10</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <!-- Number Being Served -->
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title">Number Being Served</h4>
              <p class="card-text display-2">
                8
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- Average Waiting Time -->
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title">Average Waiting Time</h4>
              <p class="card-text display-2">10</p>
            </div>
          </div>
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
            <p class="card-text display-2">None</p>
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
      <div
        class="col"
        v-for="(cards, ind) in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="ind"
      >
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
          >
            <MDBCardBody>
              <MDBCardTitle>{{ cards }}</MDBCardTitle>
              <MDBCardText>Queue Num</MDBCardText>
            </MDBCardBody>
          </a>
        </MDBCard>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from "mdb-vue-ui-kit";

export default {
  props: ["stationName", "stationStage"],
  components: { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText },
  setup(props) {
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

    // const { stationName, stationStage } = props;

    return {
      // stationName,
      // stationStage
      monitoringTitle,
    };
  },
};
</script>

<style></style>
