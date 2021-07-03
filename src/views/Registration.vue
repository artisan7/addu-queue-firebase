<template>
    <div
        >Registration
        <h2>Issue #</h2>
        <h1 v-html="latestQueueNo"></h1>
        <button @click="issueQueueNoLocal" class="btn">Issue No.</button>
        <div v-if="previousQueueNo">
            You just issued Queue No. {{ previousQueueNo.no }}</div
        >
        <pre> {{ queueItems }}</pre>
        <div>{{ latestQueueNo }}</div>
    </div>
</template>

<script>
// import { ref, watch, nextTick } from "vue";
import { computed, ref } from "vue";
import { useQueue } from "../firebase";

export default {
    name: "Registration",
    setup() {
        const { queueItems, issueQueueNo } = useQueue();
        const latestQueueNo = computed(() => queueItems.value.length + 1);
        const previousQueueNo = ref(null);

        const issueQueueNoLocal = () => {
            issueQueueNo(latestQueueNo.value);
        };

        return {
            queueItems,
            issueQueueNoLocal,
            latestQueueNo,
            previousQueueNo,
        };
    },
};
</script>
<style>
.btn {
    background: none;
    border: 1px solid black;
    padding: 1rem 2rem;
    border-radius: 5px;
}

.btn:hover {
    background: rgba(0, 0, 0, 0.2);
}

.btn:focus {
    background: gray;
}
</style>
