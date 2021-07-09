<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
  <MDBRow
    ><MDBCol> <h2>Currently Serving #s</h2> </MDBCol></MDBRow
  >
  <MDBRow>
    <MDBCol
      v-for="(item, index) in displayNums"
      :key="item"
      :class="{ new: item.new, even: index % 2 === 0, odd: index % 2 === 1 }"
    >
      <h3>{{ item.num }}</h3>
    </MDBCol>
  </MDBRow>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
import { useQueue } from "../firebase";
import { MDBRow, MDBCol } from "mdb-vue-ui-kit";

export default {
  name: "StationDisplay",
  components: { MDBRow, MDBCol },
  computed: {
    limitQueue() {
      if (this.displayNums.length > 10) return this.displayNums.slice(0, 10);
      return this.displayNums;
    },
  },
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
.even,
.odd {
  text-align: center;
  color: white;
  font-style: normal;
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
}
.even {
  background-color: #eca53b;
}
.odd {
  background-color: #3281c9;
}
</style>
