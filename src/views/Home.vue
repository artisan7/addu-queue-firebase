<template>
  <div></div>
</template>

<script>
export default {
  name: "Home",
  props: ["error"],
  mounted() {
    if (this.error !== false) this.$emit("error", this.error);
  },
  methods: {},
};
</script>
