<template>
  <div>
    <station-monitoring
      :stationName="$route.params.station"
      :stationStage="stageId"
    ></station-monitoring>
  </div>
</template>

<script>
import StationMonitoring from "../components/StationMonitoring.vue";
export default {
  components: { StationMonitoring },
  computed: {
    stageId() {
      const names = {
        screening: 2,
        monitoring: 4,
        vaccination: 6,
        post: 8,
        exit: 10,
      };
      return names[this.$route.params.station];
    },
  },
};
</script>

<style></style>
