<template>
  <div class="container">
    <queue-list-table :queueNumList="queueNumList"></queue-list-table>
  </div>
</template>

<script>
import QueueListTable from "../components/QueueListTable.vue";
import { useAdmin } from "../firebase";

export default {
  components: { QueueListTable },
  setup() {
    const { getQueueNums } = useAdmin();
    const queueNumList = getQueueNums();

    return { queueNumList };
  },
};
</script>

<style></style>
