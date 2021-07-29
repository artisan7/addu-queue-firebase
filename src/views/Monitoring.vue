<template>
  <div>
    <station-monitoring
      v-if="stageId"
      :stationName="$route.params.station"
      :stationStage="stageId"
      :key="$route.params.station"
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
        registration: 1,
        vitals: 2,
        counseling: 4,
        screening: 6,
        vaccination: 8,
        post: 10,
      };
      return names[this.$route.params.station];
    },
  },
};
</script>

<style></style>
