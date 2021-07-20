<template>
  <div>
    <station-monitoring></station-monitoring>
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
    },
  },
};
</script>

<style></style>
