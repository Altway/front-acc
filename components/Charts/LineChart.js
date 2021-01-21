import { Line, mixins } from 'vue-chartjs';

export default {
  name: 'line-chart',
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    extraOptions: Object,
    gradientColors: {
      type: Array,
      default: () => [
        'rgba(72,72,176,0.2)',
        'rgba(72,72,176,0.0)',
        'rgba(119,52,169,0)'
      ],
      validator: val => {
        return val.length > 1;
      }
    },
    gradientStops: {
      type: Array,
      default: () => [1, 0.4, 0],
      validator: val => {
        return val.length > 1;
      }
    }
  },
  mounted() {
    this.$watch(
      'chartData',
      (newVal, oldVal) => {
        if (!oldVal) {
          this.renderChart(this.chartData, this.extraOptions);
        }
      },
      { immediate: true }
    );
  }
};
