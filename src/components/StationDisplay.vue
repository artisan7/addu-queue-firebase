<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
  <MDBRow>
    <MDBCol
      v-for="item in dummyNums"
      :key="item.num"
      :class="{ new: item.new, old: !item.new }"
      class="num-list"
    >
      {{ item.num }}
    </MDBCol>
  </MDBRow>
  <div>
    <div class="inline-layout">
      <div class="new-square" />
      &nbsp;
      <h5>Newly called</h5>
    </div>
    <div class="inline-layout">
      <div class="old-square" />
      &nbsp;
      <h5>
        Not called because of his/her absence so you are now in waiting list
      </h5>
    </div>
  </div>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
import { useQueue } from "../firebase";
import { MDBRow, MDBCol } from "mdb-vue-ui-kit";

export default {
  name: "StationDisplay",
  components: { MDBRow, MDBCol },
  data() {
    return {
      dummyNums: [
        {
          num: 789,
          new: true,
          station: 1,
        },
        {
          num: 987,
          new: false,
          station: 1,
        },
        {
          num: 278,
          new: true,
          station: 1,
        },
        {
          num: 456,
          new: true,
          station: 1,
        },
        {
          num: 512,
          new: true,
          station: 1,
        },
        {
          num: 467,
          new: false,
          station: 1,
        },
        {
          num: 298,
          new: false,
          station: 1,
        },
        {
          num: 299,
          new: true,
          station: 1,
        },
        {
          num: 106,
          new: true,
          station: 1,
        },
        {
          num: 199,
          new: true,
          station: 1,
        },
      ],
    };
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
  background-color: #3281c9;
  font-weight: bold !important;
  filter: drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.4));
}
.old {
  background-color: #eca53b;
  font-weight: regular !important;
}

.new-square {
  background-color: #3281c9;
  width: 20px;
  height: 20px;
}
.old-square {
  background-color: #eca53b;
  width: 20px;
  height: 20px;
}

.inline-layout {
  display: flex;
  flex-wrap: wrap;
}

.num-list {
  text-align: center;
  color: white;
  font-style: normal;
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
  font-size: 3rem;
}
</style>
