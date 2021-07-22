<template>
  <div class="dashboard-layout container">
    <MDBCard
      style="grid-area: numVax"
      bg="success"
      text="white"
      class="text-center"
    >
      <MDBCardBody>
        <MDBCardTitle>Number of People Vaccinated</MDBCardTitle>
        <MDBCardText class="display-2">{{ numVaccinated.length }}</MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <MDBCard style="grid-area: inQueue" bg="warning" class="text-center">
      <MDBCardBody>
        <MDBCardTitle>Number of People in Queue</MDBCardTitle>
        <MDBCardText class="display-2">{{ peopleInQueue.length }}</MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <MDBCard
      style="grid-area: AvgTime"
      bg="primary"
      text="white"
      class="text-center"
    >
      <MDBCardBody>
        <MDBCardTitle>Average Time Per Person</MDBCardTitle>
        <MDBCardText class="display-2"
          >{{ averageTimePerPerson ? averageTimePerPerson : `Waiting...` }}
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
    <MDBCard style="grid-area: latestIssued" bg="info" class="text-center">
      <MDBCardBody>
        <MDBCardTitle>Latest Number Issued</MDBCardTitle>
        <MDBCardText class="display-2">{{ queueNumList.length }}</MDBCardText>
      </MDBCardBody>
    </MDBCard>

    <MDBCard
      style="grid-area: rejected"
      bg="danger"
      text="white"
      class="text-center"
    >
      <MDBCardBody>
        <MDBCardTitle>Number of People Rejected</MDBCardTitle>
        <MDBCardText class="display-2">{{ numRejected.length }}</MDBCardText>
      </MDBCardBody>
    </MDBCard>

    <div class="num-person-display">
      <MDBCard
        v-for="(queue, ind) in queueInStations"
        :key="queue.station"
        :bg="ind % 2 ? 'primary' : 'warning'"
        :text="ind % 2 ? 'white' : 'black'"
        class="text-center"
      >
        <MDBCardBody>
          <MDBCardTitle
            >Number of People Served in {{ queue.station }}</MDBCardTitle
          >
          <MDBCardText class="display-2">{{ queue.count }}</MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>
  </div>
</template>

<script>
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
} from "mdb-vue-ui-kit";
import { useAdmin } from "../firebase";
import { computed } from "@vue/runtime-core";

export default {
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
  },
  setup() {
    const { getQueueNums } = useAdmin();
    const queueNumList = getQueueNums();

    const peopleInQueue = computed(() => {
      return queueNumList.value.filter(
        (queueNum) => queueNum.timestamps.exit === null
      );
    });

    const averageTimePerPerson = computed(() => {
      // Filter out the people still in queue
      const finished = queueNumList.value.filter(
        (queueNum) => queueNum.timestamps.exit !== null
      );
      const seconds =
        finished
          .map((queueNum) => {
            const enterTime = queueNum.timestamps.issue;
            const exitTime = queueNum.timestamps.exit;
            // Calculate the time in seconds
            return exitTime.seconds - enterTime.seconds;
          })
          .reduce((a, b) => a + b, 0) / finished.length; // Add up the seconds then average
      return new Date(seconds * 1000).toISOString().substr(11, 8);
    });

    const numRejected = computed(() => {
      return queueNumList.value.filter((num) => num.stage === -1);
    });

    const queueInStations = computed(() => {
      const conditions = [
        "registration",
        "screening",
        "vitals",
        "vaccination",
        "post",
      ];

      return conditions.map((station, ind) => {
        return {
          station: station.charAt(0).toUpperCase() + station.slice(1), // Capitalize
          count: queueNumList.value.filter((queueNum) => {
            console.log(queueNum.stage);
            if (queueNum.stage === ind * 2 || queueNum.stage == ind * 2 + 1)
              return queueNum;
          }).length,
        };
      });
    });

    const numVaccinated = computed(() => {
      return queueNumList.value.filter((queueNum) => queueNum.stage == 10);
    });

    return {
      queueNumList,
      peopleInQueue,
      averageTimePerPerson,
      numRejected,
      queueInStations,
      numVaccinated,
    };
  },
};
</script>

<style>
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "numVax numVax"
    "inQueue AvgTime"
    "latestIssued rejected"
    "numPerson numPerson";
  gap: 4px;
  margin: 1rem;
}

.num-person-display {
  grid-area: numPerson;
  display: grid;
  gap: 4px;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
