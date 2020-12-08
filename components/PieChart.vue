<template>
  <div class="small">
    <pie-chart :chartData="chartData"></pie-chart>
  </div>
</template>

<script>
  import PieChart from './PieChart.js'

  export default {
    components: {
      PieChart
    },
    props: {
      chartData: {
        type: Object,
        default: () => Object(),
        desciption: 'Chart Data'
      },
    }
  }
</script>

<style>
  .small {
    max-width: 400px;
    margin:  100px auto;
  }
</style>