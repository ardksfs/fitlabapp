<template>
    <div class="chart-container">
        <component :is="chartComponent" :data="data" :options="options" />
    </div>
</template>

<script setup lang="ts">
import { Bar, Line, Doughnut, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler);

const props = defineProps(['data', 'options', 'type']);

const chartComponent = {
    bar: Bar,
    line: Line,
    doughnut: Doughnut,
    pie: Pie
}[props.type as string];
</script>

<style scoped>
.chart-container {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>