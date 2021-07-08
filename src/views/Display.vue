<template>
  <MDBContainer md>
    <h3 style="text-transform: capitalize">{{ $route.params.station }}</h3>
    <station-display
      :stationName="$route.params.station"
      :stageId="stageId"
    ></station-display>
  </MDBContainer>

  <!-- {{ $route.params.station }}
  {{ stageId }} -->
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
      screening: 3,
      vitals: 5,
      vaccination: 7,
    },
  }),
};
</script>

<style></style>
