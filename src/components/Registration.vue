<template>
  <div>Registration
    <h2>Issue #</h2>
    <h1 v-html='latestQueueNo'></h1>
    <button @click='issueQueueNo'>ISSUE QUEUE #</button>
  </div>
</template>

<script>
export default {
  name: 'Registration',
  methods: {
    issueQueueNo() {
      // TODO: limit queue no to certain maximum
      this.latestQueueNo++;

      // create new queue item
      var queue_item = {
        number: this.latestQueueNo,
        stage: this.stage,
      };

      // add queue_item to database
      console.log(queue_item.number);
    }
  },
  data() {
    return {
      latestQueueNo: 0,
      stage: 0
    }
  }
}
</script>
