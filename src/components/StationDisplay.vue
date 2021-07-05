<!-- THIS COMPONENT IS USED TO DISPLAY ALL NUMBERS
THAT ARE CURRENTLY BEING SERVED IN THE STATION -->

<template>
    <div>
        <h1 v-html="stationName"></h1>
        <h2>Currently Serving #s</h2>
        <div v-for='item in getAllItemsAtStation()' :key='item.id'>{{item.no}}</div>
    </div>
</template>

<script>
export default {
    name: 'StationDisplay',
    props: { stationName: String, stationNo: Number },
    methods: {
        getAllItemsAtStation() {
            return this.testDB.filter(item => item.stage === this.waitingStage)
        }
    },
    mounted() {
        // this follows the pattern where
        // 1 = registered and waiting for station 1
        // 2 = in station 1, and so on...
        this.servingStage = this.stationNo * 2;
        this.waitingStage = this.servingStage - 1;
    },
    data() {
        return {
            waitingStage: 0,
            servingStage: 0,
            testDB: [
                    {id: 0, no: 32, stage: 1},
                    {id: 1, no: 25, stage: 1},
                    {id: 2, no: 50, stage: 1},
                    {id: 3, no: 12, stage: 2},
                ]
        }
    }
}
</script>