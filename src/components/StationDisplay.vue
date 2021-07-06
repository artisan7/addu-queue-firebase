<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
  <div>
    <h1 v-html="stationName"></h1>
    <h2>Currently Serving #s</h2>
    <!-- <div v-for="item in serveNums" :key="item">
      {{ item.num }}
    </div> -->
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
    const { stationDisplayQueueNums } = useQueue();
    var serveNums = stationDisplayQueueNums(props.stageId);
    const displayNums = ref(null);

    watch(serveNums, (newValue, oldValue) => {
      //   const newValueIds = newValue.map((val) => val.id);
      const oldValueIds = oldValue.map((val) => val.id);

      displayNums.value = newValue.slice(0);

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
