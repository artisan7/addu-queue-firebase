<template>
  <div class="dashboard-layout container">
    <MDBCard
      style="grid-area: numVax"
      bg="primary"
      text="white"
      class="text-center"
    >
      <MDBCardBody>
        <MDBCardTitle>Number of People Vaccinated</MDBCardTitle>
        <MDBCardText class="display-2">2</MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <MDBCard style="grid-area: regServe" bg="warning" class="text-center">
      <MDBCardBody>
        <MDBCardTitle>Registration Now Serving</MDBCardTitle>
        <MDBCardText class="display-2">7</MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <MDBCard
      style="grid-area: AvgTime"
      bg="primary"
      text="white"
      class="text-center"
    >
      <MDBCardBody>
        <MDBCardTitle>Average Time Per Person</MDBCardTitle>
        <MDBCardText class="display-2">45</MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <MDBCard style="grid-area: latestIssued" bg="info" class="text-center">
      <MDBCardBody>
        <MDBCardTitle>Latest Number Issued</MDBCardTitle>
        <MDBCardText class="display-2">15</MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <MDBCard
      style="grid-area: rejected"
      bg="danger"
      text="white"
      class="text-center"
    >
      <MDBCardBody>
        <MDBCardTitle>Number of People Rejected</MDBCardTitle>
        <MDBCardText class="display-2">0</MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <div class="num-person-display">
      <MDBCard
        v-for="(num, ind) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        :key="ind"
        bg="primary"
        text="white"
        class="text-center"
      >
        <MDBCardBody>
          <MDBCardTitle>Number of People Served in Registration</MDBCardTitle>
          <MDBCardText class="display-2">0</MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>
  </div>
</template>

<script>
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
  },
};
</script>

<style>
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "numVax numVax"
    "regServe AvgTime"
    "latestIssued rejected"
    "numPerson numPerson";
  gap: 4px;
  margin: 1rem;
}

.num-person-display {
  grid-area: numPerson;
  display: grid;
  gap: 4px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>
