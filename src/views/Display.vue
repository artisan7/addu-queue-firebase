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
      screening: 2,
      vitals: 3,
      vaccination: 4,
    },
  }),
};
</script>

<style></style>
