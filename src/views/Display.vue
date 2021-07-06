<template>
  <station-display
    :stationName="$route.params.station"
    :stageId="stageId"
  ></station-display>
  {{ $route.params.station }}
  {{ stageId }}
</template>

<script>
import StationDisplay from "../components/StationDisplay";

export default {
  components: { StationDisplay },
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
