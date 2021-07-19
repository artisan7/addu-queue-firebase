<template>
  <div class="container">
    <div class="col">
      <div class="d-flex">
        <button class="btn btn-danger" @click="localResetQueue">
          Reset Queue
        </button>
        <button class="btn" @click="localSeedUsers">Seed Users</button>
        <button class="btn"></button>
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
import { useAdmin } from "../firebase";

export default {
  setup() {
    const { seedUsers, resetQueue } = useAdmin();

    const localSeedUsers = () => {
      console.log("Seeding...");
      seedUsers()
        .then(() => {
          console.log("Success!");
        })
        .catch((err) => console.log(err));
    };

    const localResetQueue = () => {
      console.log("Resetting...");
      resetQueue()
        .then((message) => {
          console.log("Done resetting!", message);
        })
        .catch((err) => console.error(err));
    };

    return { localSeedUsers, localResetQueue };
  },
};
</script>

<style></style>
