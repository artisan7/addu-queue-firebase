<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
  <!-- <MDBRow>

    <MDBTable v-for="(nums, index) in displayNumSplit" :key="index">
      <thead>
        <tr>
          <th v-for="station in nums" :key="station.station" scope="col">
            {{ station.station }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="station in nums"
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
  </MDBRow> -->
  <div
    class="row row-cols-5 g-2"
    v-for="(nums, index) in displayNumSplit"
    :key="index"
  >
    <div class="col" v-for="station in nums" :key="station.station">
      <div
        class="card"
        :class="{
          'bg-warning': station.new,
        }"
      >
        <div class="card-body">
          <div class="card-title">
            {{ station.station }}
          </div>
          <div class="card-text">{{ station.currentNum || "Free" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "@vue/runtime-core";
import { useQueue } from "../firebase";
// import { MDBRow, MDBTable } from "mdb-vue-ui-kit";

export default {
  name: "StationDisplay",
  // components: { MDBRow, MDBTable },
  props: { stationName: String, stageId: Number },
  setup(props) {
    // Hooks
    const { stationDisplayQueueNums } = useQueue();

    // Data vars
    var serveNums = stationDisplayQueueNums(props.stationName);
    const alert = new Audio("/alert.wav");
    const newNums = ref({
      "Station 1": false,
      "Station 2": false,
      "Station 3": false,
      "Station 4": false,
      "Station 5": false,
      "Station 6": false,
      "Station 7": false,
      "Station 8": false,
      "Station 9": false,
      "Station 10": false,
    });

    // Computed
    const displayNumSplit = computed(() => {
      if (serveNums.value.data)
        return [
          serveNums.value.data.slice(0, 5).map((val) => {
            return {
              ...val,
              new: newNums.value[val.station],
            };
          }),
          serveNums.value.data.slice(5, 10).map((val) => {
            return {
              ...val,
              new: newNums.value[val.station],
            };
          }),
        ];
    });

    // Watcher to see if there's new values in the array
    watch(serveNums, (newValue) => {
      console.log("newval", newValue);
      const changeNums = Object.keys(newNums.value).filter((key) => {
        const stationVal = newValue.data.filter(
          (station) => station.station === key
        )[0];
        return newValue.changes.includes(key) && stationVal.currentNum != null;
      });

      console.log(changeNums);

      if (changeNums.length != 0) playAlert();

      changeNums.forEach((station) => {
        newNums.value[station] = true;
        setTimeout(() => (newNums.value[station] = false), 5000);
      });
    });

    function playAlert() {
      alert.play();
    }

    return { serveNums, displayNumSplit, playAlert, newNums };
  },
};
</script>

<style scoped>
.queue-num {
  transition: 1s all ease;
}
</style>
