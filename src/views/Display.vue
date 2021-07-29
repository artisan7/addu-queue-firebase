<template>
  <MDBContainer fluid class="d-flex flex-column align-items-center w-100">
    <div v-if="stageId" class="w-100">
      <h3>
        <span style="text-transform: capitalize">{{
          $route.params.station
        }}</span>
        - Currently Serving #s
      </h3>
      <station-display
        :stationName="$route.params.station"
        :stageId="stageId"
      ></station-display>
    </div>
    <div v-else>
      <h3 class="display-3">This is not a valid station.</h3>
    </div>
  </MDBContainer>
</template>

<script>
import StationDisplay from "../components/StationDisplay";
import { MDBContainer } from "mdb-vue-ui-kit";

export default {
  components: { MDBContainer, StationDisplay },
  computed: {
    stageId() {
      return this.mapStage[this.$route.params.station];
    },
  },
  data: () => ({
    mapStage: {
      registration: 1,
      vitals: 3,
      counseling: 5,
      screening: 7,
      vaccination: 9,
      post: 11,
    },
  }),
};
</script>

<style></style>
