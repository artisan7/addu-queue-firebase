<template>
  <div id="nav">
    <router-link to="/issue">Issue Num</router-link> |
    <span v-for="(station, key) in stations" :key="station">
      <router-link :to="`/station/${station}`"> {{ key }} Controls</router-link>
      |
      <router-link :to="`/display/${station}`">Display {{ key }}</router-link> |
    </span>
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>

<script>
export default {
  data: () => ({
    stations: {
      Registration: "registration",
      Screening: "screening",
      Vitals: "vitals",
      Vaccination: "vaccination",
    },
  }),
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
