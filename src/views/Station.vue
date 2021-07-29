<template>
  <div>
    <div v-if="stageId !== null || stageId !== undefined" class="w-100">
      <h3 class="display-1 text-center" style="text-transform: capitalize">
        {{ $route.params.station }}
      </h3>
      <station-control
        :stationName="$route.params.station"
        :stageId="stageId"
      ></station-control>
    </div>
    <div v-else>
      <h3 class="display-2">This is not a valid station</h3>
    </div>
  </div>
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
      vitals: 2,
      counseling: 4,
      screening: 6,
      vaccination: 8,
      post: 10,
    },
  }),
};
</script>
