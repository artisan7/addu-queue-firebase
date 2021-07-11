<template>
  <div>
    <button @click="seed">Seed Users</button>
  </div>
</template>

<script>
import { useQueue } from "../firebase";
export default {
  name: "Home",
  props: ["error"],
  mounted() {
    if (this.error !== false) this.$emit("error", this.error);
  },
  methods: {
    seed() {
      const { seedUsers } = useQueue();
      seedUsers();
    },
  },
};
</script>
