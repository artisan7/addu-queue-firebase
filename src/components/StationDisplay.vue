<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
  <div>
    <h1 v-html="stationName"></h1>
    <h2>Currently Serving #s</h2>
    <div v-for="item in serveNos" :key="item">
      {{ item.num }}
    </div>
  </div>
</template>

<script>
// import { ref } from "vue";
import { useQueue } from "../firebase";

export default {
  name: "StationDisplay",
  props: { stationName: String, stageId: Number },
  setup(props) {
    const { stationDisplayQueueNums } = useQueue();
    const serveNos = stationDisplayQueueNums(props.stageId);

    return { serveNos };
  },
};
</script>
