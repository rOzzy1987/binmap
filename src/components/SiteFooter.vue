<template>
    <footer class="footer">
        <div class="columns container">
            <div class="column">
                <p class="has-text-weight-bold">Binary visualizer</p>
                <p class="is-size-7">
                    created by <a href="https://github.com/rozzy1987">rOzzy87@github</a>
                </p>
                <p class="is-size-7">&copy;2025</p>
            </div>
            <div class="column vr"></div>
            <div class="column">
                <p class="has-text-weight-light">Support the project:</p>
                <support-me />
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import SupportMe from './SupportMe.vue'
</script>
<style scoped>
.column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-grow: 1;
}

.vr {
    background-color: rgba(0, 0, 0, 0.05);
    width: 0;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.05);
    flex-grow: 0;
}
</style>
