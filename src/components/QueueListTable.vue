<template>
  <!-- TODO: Sort by queue no. Filter by stage -->
  <div class="row">
    <div class="row my-4">
      <div class="col">
        <label for="ascendingNums">Order Numbers: </label>
        <div id="ascendingNums">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              v-model="ascendingNums"
              type="radio"
              name="orderNums"
              id="numAsc"
              :value="true"
            />
            <label class="form-check-label" for="numAsc">Ascending</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              v-model="ascendingNums"
              type="radio"
              name="orderNums"
              id="numDesc"
              :value="false"
            />
            <label class="form-check-label" for="numDesc">Descending</label>
          </div>
        </div>
      </div>
      <div class="col">
        <label for="stageFilter">Filter by Stage</label>
        <select
          name="stageFilter"
          v-model="stageFilter"
          class="form-select shadow"
        >
          <option :value="0">No Filter</option>
          <option :value="1">Registration</option>
          <option :value="2">Vitals</option>
          <option :value="3">Counseling</option>
          <option :value="4">Screening</option>
          <option :value="5">Vaccination</option>
          <option :value="6">Post Vaccination</option>
          <option :value="7">Done</option>
          <option :value="8">Rejected</option>
        </select>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Queue Number</th>
          <th>Current Stage</th>
          <!-- <th>Actions</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="queueNum in filteredList" :key="queueNum.num">
          <td>{{ queueNum.num }}</td>
          <td>{{ getStage(queueNum.stage) }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["queueNumList"],
  data: () => ({
    stageFilter: 0,
    ascendingNums: true,
  }),
  computed: {
    filteredList() {
      // console.log(this.queueNumList.value);
      // if (!this.queueNumList.value) return;
      const filters = [
        [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // No filter
        [0, 1], // Registration
        [2, 3], //  Vitals
        [4, 5], // Counseling
        [6, 7], // Screening
        [8, 9], // Vaccination
        [10, 11], // Post-Vaccination
        [12], // Exit
        [-1], // Exit
      ];

      const filteredStage = this.queueNumList.filter((num) =>
        filters[this.stageFilter].includes(num.stage)
      );

      if (this.ascendingNums) return filteredStage;
      else return filteredStage.reverse();
      // return this.queueNumList.value;
    },
  },
  methods: {
    getStage(stage) {
      const actualStage = stage + 1;
      const stages = [
        "Rejected",
        "Issued Num",
        // "Registration",
        "Registration",
        "Vitals",
        "Vitals",
        "Counseling",
        "Counseling",
        "Screening",
        "Screening",
        "Vaccination",
        "Vaccination",
        "Post-Vaccination",
        "Post-Vaccination",
        "Done",
      ];
      return stages[actualStage];
    },
  },
};
</script>
