<template>
  <div class="container">
    <div class="col">
      <div class="d-flex">
        <button
          class="btn btn-danger"
          @click="localResetQueue"
          :disabled="processing"
        >
          Reset Queue
        </button>
        <button class="btn" @click="localSeedUsers" :disabled="processing">
          Seed Users
        </button>
        <button
          class="btn btn-primary"
          @click="testQueries"
          :disabled="processing"
        >
          Run Test Queries
        </button>
      </div>
    </div>

    <queue-list-table :queueNumList="queueNumList"></queue-list-table>
  </div>
</template>

<script>
import { createToast } from "mosha-vue-toastify";
import { useAdmin } from "../firebase";
import { ref, watch } from "@vue/runtime-core";
import QueueListTable from "../components/QueueListTable.vue";

export default {
  components: { QueueListTable },
  setup() {
    const { seedUsers, resetQueue, runTestQueries, getQueueNums } = useAdmin();
    const { testQuery, queryStatus } = runTestQueries();
    const { seedUserFn, seedStatus } = seedUsers();
    const queueNumList = getQueueNums();
    const processing = ref(false);

    const localSeedUsers = () => {
      let sure = prompt("Are you sure? Please type 'resbakuna' to verify.");
      if (sure !== "resbakuna") return;
      processing.value = true;

      seedUserFn()
        .then((message) => {
          createToast(
            {
              title: "Success!",
              description: message,
            },
            {
              type: "sucess",
              position: "top-center",
            }
          );

          processing.value = false;
        })
        .catch((err) => {
          createToast(
            {
              title: "Error",
              description: err,
            },
            {
              type: "danger",
              position: "top-center",
            }
          );
          processing.value = false;
        });
    };

    const localResetQueue = () => {
      console.log("Resetting...");

      let sure = prompt("Are you sure? Please type 'resbakuna' to verify.");
      if (sure !== "resbakuna") return;

      processing.value = true;
      resetQueue()
        .then((message) => {
          createToast(
            {
              title: "Success",
              description: message,
            },
            {
              type: "success",
              position: "top-center",
            }
          );
          processing.value = false;
        })
        .catch((err) => {
          createToast(
            {
              title: "Error",
              description: err.message,
            },
            {
              type: "danger",
              position: "top-center",
            }
          );

          processing.value = false;
        });
    };

    const testQueries = () => {
      processing.value = true;
      testQuery()
        .then((message) => {
          createToast(
            {
              title: "Success",
              description: message,
            },
            {
              type: "success",
              position: "top-center",
            }
          );

          processing.value = false;
        })
        .catch((err) => {
          createToast(
            {
              title: "Error",
              description: err.message,
            },
            {
              type: "danger",
              position: "top-center",
            }
          );

          processing.value = false;
        });
    };

    watch(
      () => queryStatus.value,
      (newVal) => {
        createToast(
          {
            title: "Success",
            description: newVal.message,
          },
          {
            type: "warning",
            position: "bottom-right",
          }
        );
      }
    );

    watch(
      () => seedStatus.value,
      (newVal) => {
        createToast(
          {
            title: "Success",
            description: newVal.message,
          },
          {
            type: newVal.status,
            position: "bottom-right",
            timeout: 3000,
          }
        );
      }
    );

    const getStage = (stage) => {
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
    };

    return {
      queueNumList,
      localSeedUsers,
      localResetQueue,
      testQueries,
      queryStatus,
      processing,
      getStage,
    };
  },
};
</script>

<style></style>
