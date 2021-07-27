<template>
  <!-- TODO: Sort by queue no. Filter by stage -->
  <div class="row">
    <table class="table">
      <thead>
        <tr>
          <th>Queue Number</th>
          <th>Current Stage</th>
          <!-- <th>Actions</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="queueNum in queueNumList" :key="queueNum.num">
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
  methods: {
    getStage(stage) {
      const actualStage = stage + 1;
      const stages = [
        "Rejected",
        "Issued Num",
        // "Registration",
        "Registration",
        "Screening",
        "Screening",
        "Vitals",
        "Vitals",
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
