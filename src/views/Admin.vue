<template>
  <div class="container">
    <div class="col">
      <div class="d-flex">
        <button class="btn btn-danger" @click="localResetQueue">
          Reset Queue
        </button>
        <button class="btn" @click="localSeedUsers">Seed Users</button>
        <button class="btn btn-primary" @click="testQueries">
          Run Test Queries
        </button>
      </div>
    </div>
    <div class="row">
      <table class="table">
        <thead>
          <tr>
            <th>Queue ID</th>
            <th>Queue Number</th>
            <th>Current Stage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { createToast } from "mosha-vue-toastify";
import { useAdmin } from "../firebase";

export default {
  setup() {
    const { seedUsers, resetQueue, runTestQueries } = useAdmin();

    const localSeedUsers = () => {
      console.log("Seeding...");
      seedUsers()
        .then(() => {
          console.log("Success!");
        })
        .catch((err) =>
          createToast(
            {
              title: "Error",
              description: err,
            },
            {
              type: "danger",
              position: "top-center",
            }
          )
        );
    };

    const localResetQueue = () => {
      console.log("Resetting...");
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
        });
    };

    const testQueries = () => {
      runTestQueries()
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
        });
    };

    return { localSeedUsers, localResetQueue, testQueries };
  },
};
</script>

<style></style>
