<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
  <div>
    <h1 v-html="stationName"></h1>
    <h2>Currently Serving #s</h2>
    <div v-for="item in displayNums" :key="item" :class="{ new: item.new }">
      {{ item.num }}
    </div>
  </div>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
import { useQueue } from "../firebase";

export default {
  name: "StationDisplay",

  props: { stationName: String, stageId: Number },
  setup(props) {
    // Hooks
    const { stationDisplayQueueNums } = useQueue();

    // Data vars
    var serveNums = stationDisplayQueueNums(props.stageId);
    const displayNums = ref(null);

    // Watcher to see if there's new values in the array
    watch(serveNums, (newValue, oldValue) => {
      const oldValueIds = oldValue.map((val) => val.id);

      // Create a copy of the nums
      displayNums.value = newValue.slice(0);

      // Filter then indicate if a value is new
      displayNums.value
        .filter((val) => !oldValueIds.includes(val.id))
        .forEach((val) => {
          val.new = true;
          setInterval(() => {
            val.new = false;
          }, 5000);
        });
    });

    return { serveNums, displayNums };
  },
};
</script>

<style scoped>
.new {
  color: red;
}
</style>
