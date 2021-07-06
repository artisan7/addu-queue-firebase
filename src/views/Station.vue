<template>
  <station-control
    :stationName="$route.params.station"
    :stageId="stageId"
  ></station-control>
  {{ $route.params.station }}
  {{ stageId }}
</template>

<script>
import StationControl from "../components/StationControl";

export default {
  components: { StationControl },
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
