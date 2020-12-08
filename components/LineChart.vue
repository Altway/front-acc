<template>
  <div class="small">
    <line-chart :chartData="chartData"></line-chart>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'

  export default {
    components: {
      LineChart
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
    margin:  150px auto;
  }
</style>