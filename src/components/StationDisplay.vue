<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
  <MDBRow>
    <MDBTable>
      <thead>
        <tr>
          <th v-for="station in displayNums" :key="station.station" scope="col">
            {{ station.station }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="station in displayNums"
            :key="station.station"
            class="queue-num"
            :class="{
              'bg-warning': station.new,
              'text-white': station.new,
            }"
          >
            {{ station.currentNum || "Free" }}
          </td>
        </tr>
      </tbody>
    </MDBTable>
  </MDBRow>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
import { useQueue } from "../firebase";
import { MDBRow, MDBTable } from "mdb-vue-ui-kit";

export default {
  name: "StationDisplay",
  components: { MDBRow, MDBTable },
  props: { stationName: String, stageId: Number },
  setup(props) {
    // Hooks
    const { stationDisplayQueueNums } = useQueue();

    // Data vars
    var serveNums = stationDisplayQueueNums(props.stationName);
    const displayNums = ref(null);

    console.log("SERVE NUMS", serveNums);
    // Watcher to see if there's new values in the array
    watch(serveNums, (newValue, oldValue) => {
      const oldValueIds = oldValue.map((val) => val.currentNum);

      // Create a copy of the nums
      displayNums.value = newValue.slice(0);

      // Filter then indicate if a value is new
      displayNums.value
        .filter((val) => !oldValueIds.includes(val.currentNum))
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
.queue-num {
  transition: 1s all ease;
}
</style>
