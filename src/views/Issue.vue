<template>
  <MDBContainer md>
    <h3 style="text-transform: capitalize">Issue a Number</h3>

    <MDBCard id="issue-layout">
      <MDBCardBody id="issue-layout-body">
        <h2>Issue #</h2>
        <MDBBtn
          color="primary"
          @click="issueQueueNumLocal"
          :disabled="processing"
        >
          Issue No.
        </MDBBtn>
        <div id="num-card">
          <div v-if="previousQueueNum">
            <h6>You just issued Queue No.</h6>

            <h2>{{ previousQueueNum }}</h2>
          </div>
        </div>
        <pre> {{ queueItems }}</pre>
      </MDBCardBody>
    </MDBCard>
  </MDBContainer>
</template>

<script>
// import { ref, watch, nextTick } from "vue";
import { ref } from "vue";
import { useQueue } from "../firebase";
import { MDBContainer, MDBCard, MDBCardBody, MDBBtn } from "mdb-vue-ui-kit";

export default {
  name: "Registration",
  components: { MDBContainer, MDBCard, MDBCardBody, MDBBtn },
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
<style>
#issue-layout {
  border: 3px solid #d7d7d7;
  /* text-align: center; */
}
#header {
  text-transform: capitalize;
}

#issue-layout-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

#num-card h2,
#num-card h6 {
  color: #ffffff;
  padding: 5px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
