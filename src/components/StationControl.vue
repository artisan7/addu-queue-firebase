<template>
    <div>
    <h2>Currently Serving #</h2>
    <h1 v-if='this.currentlyServing === null'>None</h1>
    <h1 v-else v-html='currentlyServing.no'></h1>
    <button @click='callNext'>CALL NEXT #</button>
    <button @click='finishCurrent'>FINISH</button>
  </div>
</template>

<script>
export default {
    name: 'StationControl',
    props: { stationName: String, stationNo: Number },
    methods: {
        callNext() {
            // ensures that the previous queue item (if any) moves to next stage
            this.finishCurrent();

            // TODO: Get Queue items from db
            var waiting_list = this.testDB.filter(item => item.stage === this.waitingStage);
            if (waiting_list.length > 0) {
                waiting_list.sort((first, second) => first.no - second.no );
                
                this.currentlyServing = waiting_list[0];
                this.currentlyServing.stage = this.servingStage;   // modify this in db
            }
        },
        finishCurrent() {
            if (this.currentlyServing !== null) {
                // move to waiting stage of next station
                this.currentlyServing.stage = this.servingStage + 1;
                this.currentlyServing = null;
            }
        }
    },
    mounted() {
        // this follows the pattern where
        // 1 = registered and waiting for station 1
        // 2 = in station 1, and so on...
        console.log(this.stationNo)
        this.servingStage = this.stationNo * 2 - 1;
        this.waitingStage = this.servingStage - 1;
    },
    data() {
        return {
            waitingStage: 0,
            servingStage: 0,
            currentlyServing: null,
            testDB: [
                {id: 0, no: 32, stage: 0},
                {id: 1, no: 25, stage: 0},
                {id: 2, no: 50, stage: 0}
            ]
        }
    }
}
</script>