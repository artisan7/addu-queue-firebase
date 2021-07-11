<template>
  <MDBContainer md>
    <div class="p-5 text-center bg-light">
      <h1 class="display-2">Issue a Number</h1>
      <MDBBtn
        color="primary"
        @click="issueQueueNumLocal"
        :disabled="processing"
        size="lg"
      >
        Issue No.
      </MDBBtn>
      <div
        class="d-flex flex-column align-items-center mt-2"
        v-if="previousQueueNum"
      >
        <h4 class="my-3 lead">You just issued</h4>

        <queue-number-card>{{ previousQueueNum }}</queue-number-card>
      </div>
    </div>
  </MDBContainer>
</template>

<script>
// import { ref, watch, nextTick } from "vue";
import { ref } from "vue";
import { useQueue } from "../firebase";
import { MDBContainer, MDBBtn } from "mdb-vue-ui-kit";
import QueueNumberCard from "../components/QueueNumberCard.vue";

export default {
  name: "Registration",
  components: {
    MDBContainer,
    MDBBtn,
    QueueNumberCard,
  },
  setup() {
    const { queueItems, issueQueueNum } = useQueue();
    const processing = ref(false);
    const previousQueueNum = ref(null);

    const issueQueueNumLocal = () => {
      processing.value = true;
      issueQueueNum().then((val) => {
        // console.log(val);
        processing.value = false;
        previousQueueNum.value = val;
        // setTimeout(() => {
        //   previousQueueNum.value = null;
        // }, 2000);
      });
    };

    return {
      queueItems,
      issueQueueNumLocal,
      previousQueueNum,
      processing,
    };
  },
};
</script>
<style></style>
