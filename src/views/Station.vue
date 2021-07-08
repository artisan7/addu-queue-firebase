<template>
  <MDBContainer md>
    <h3 style="text-transform: capitalize">{{ $route.params.station }}</h3>
    <station-control
      :stationName="$route.params.station"
      :stageId="stageId"
    ></station-control>
  </MDBContainer>
</template>

<script>
import { MDBContainer } from "mdb-vue-ui-kit";
import StationControl from "../components/StationControl";

export default {
  components: { MDBContainer, StationControl },
  computed: {
    stageId() {
      return this.mapStage[this.$route.params.station];
    },
  },
  data: () => ({
    mapStage: {
      registration: 0,
      screening: 2,
      vitals: 4,
      vaccination: 6,
    },
  }),
};
</script>

<style></style>
