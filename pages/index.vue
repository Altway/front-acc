<template>
  <div class="row">
    <div class="col-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-6">
              <h5 class="card-category">Portefolio Value</h5>
              <h2 class="card-title">Performance</h2>
            </div>
            <div class="col-sm-6 d-flex d-sm-block">
              <div
                class="btn-group btn-group-toggle"
                data-toggle="buttons"
              >
                <label
                  v-for="(option, index) in this.bigLineChartCategories"
                  :key="option.name"
                  class="btn btn-sm btn-primary btn-simple"
                  :class="{ active: bigLineChart.activeIndex === index }"
                  :id="index"
                >
                  <input
                    type="radio"
                    @click="change(index)"
                    name="options"
                    autocomplete="off"
                    :checked="bigLineChart.activeIndex === index"
                  />
                  <span class="d-none d-sm-block">{{ option.name }}</span>
                  <span class="d-block d-sm-none">
                    <i :class="option.icon"></i>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </template>
        <div class="chart-area">
          <line-chart
            style="height: 100%"
            ref="bigChart"
            :chart-data="this.bigLineChart.chartData"
            :gradient-colors="bigLineChart.gradientColors"
            :gradient-stops="bigLineChart.gradientStops"
            :extra-options="bigLineChart.extraOptions"
          >
          </line-chart>
        </div>
      </card>
    </div>
    <div class="col-lg-7">
      <card card-body-classes="table-full-width">
        <h4 slot="header" class="card-title">Saved Hypothesis</h4>
        <el-table :data="this.hypothesisList">
          <el-table-column
            min-width="150"
            sortable
            label="Hypothesis name"
            property="name"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Assets Allocation"
            property="allocation"
          ></el-table-column>
          <el-table-column 
            min-width="150"
            header-align="right"
            label="Actions">
              <div slot-scope="{row}" class="text-right">
                <el-tooltip content="Info" :open-delay="300" placement="top">
                  <base-button type="info" size="sm" icon @click="update_chart(row)">
                    <i class="tim-icons icon-single-02"></i>
                  </base-button>
                </el-tooltip>
                <el-tooltip content="Settings" :open-delay="300" placement="top">
                  <base-button type="success" size="sm" icon>
                    <i class="tim-icons icon-settings"></i>
                  </base-button>
                </el-tooltip>
                <el-tooltip content="Delete" :open-delay="300" placement="top">
                  <base-button type="danger" size="sm" icon>
                    <i class="tim-icons icon-simple-remove"></i>
                  </base-button>
                </el-tooltip>
              </div>
          </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';
import * as chartConfigs from '@/components/Charts/config';
import TaskList from '@/components/Dashboard/TaskList';
import config from '@/config';
import { Table, TableColumn } from 'element-ui';

import { GET, POST } from '@/util/request.js';

import { mapMutations } from 'vuex'

export default {
  async fetch() {
    // Query the user's preferred hypothesis
    let user_preferred_hypothesis_id

    const cookiePreferredHypothesis = this.$cookies.get("preferred-hypothesis")
    if (cookiePreferredHypothesis != null) {
      user_preferred_hypothesis_id = cookiePreferredHypothesis
    }else{
      const userMetadata = await GET(
        "http://localhost:8000/personnal/users/"+this.$store.$auth.user.pk+"/usermeta",
      );
      user_preferred_hypothesis_id = userMetadata["preferred_hypothesis_id"]
      this.$cookies.set("preferred-hypothesis", user_preferred_hypothesis_id, {
        path: "/",
        maxAge: 7 * 24
      });
    }

    const userPreferredHypothesis= await GET(
      "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis/"+user_preferred_hypothesis_id,
    );
    this.tableData = userPreferredHypothesis.allocation

    // Query the hypothesis data
    const hypothesisData = await GET(
      "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis/"+user_preferred_hypothesis_id+"/hypothesis_data",
    );
    console.log(hypothesisData)
    this.bigChartLabels = hypothesisData["bigChartLabels"];
    console.log(this.bigChartLabels)

    // For each different mathematical calculation we populate the graph
    let bigChartData = []
    for (const [key, value] of Object.entries(hypothesisData["bigChartData"])) {bigChartData.push(value);}
    this.bigChartData = bigChartData;
    console.log(this.bigChartData)

    // We query a specific hypothesis to display in the graph
    // {"Content-Type": "application/json", "Authorization": this.$store.$auth.strategy.token.get()},
    const hypothesisList = await GET(
      "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis",
    );
    this.hypothesisList = hypothesisList
    console.log(this.hypothesisList)
   
    /* Snippet pour les Cookies
    this.$cookies.set("cookie-name", "cookie-value", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    const cookieRes = this.$cookies.get("cookie-name");
    console.log(cookieRes);*/
  },
  fetchOnServer: false,
  name: 'dashboard',
  components: {
    LineChart,
    BarChart,
    TaskList,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data () {
    return {
      tableData: [],
      bigChartData: {},
      bigChartLabels: [],
      hypothesisList: [],
      hypothesis_name: "",
      bigLineChartCategories: [
        {name: 'simple', icon: 'tim-icons icon-single-02'}, 
        {name: 'cumsum', icon: 'tim-icons icon-gift-2'},
        {name: 'pct', icon: 'tim-icons icon-tap-02'}
      ],
      bigChartDatasetOptions: {
        fill: true,
        borderColor: config.colors.primary,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: config.colors.primary,
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: config.colors.primary,
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
      },
    };
  },
  computed: {
    bigLineChart () {
      return {
        activeIndex: 0,
        chartData: {
          datasets: [
            {
              ...this.bigChartDatasetOptions,
              data: this.bigChartData[0]
            }
          ],
          labels: this.bigChartLabels
        },
        extraOptions: chartConfigs.purpleChartOptions,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: this.bigLineChartCategories
      };
    },
  },
  methods: {
    initBigChart (index) {
      let chartData = {
        datasets: [{
          ...this.bigChartDatasetOptions,
          data: this.bigChartData[index]
        }],
        labels: this.bigChartLabels
      };
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = index;
    },
    change (index) {
      this.initBigChart(index);
      this.$forceUpdate()
    },
    async update_chart(row) {
      const hypothesisData = await GET(
        "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis/"+row.id+"/hypothesis_data",
      );
      this.bigChartLabels = hypothesisData["bigChartLabels"];

      var bigChartData = []
      for (const [key, value] of Object.entries(hypothesisData["bigChartData"])) {bigChartData.push(value);}
      this.bigChartData = bigChartData;

      this.$cookies.set("preferred-hypothesis", row.id, {
        path: "/",
        maxAge: 24 * 7
      });
    },
  },
  mounted () {
    this.initBigChart(0);
  }
}
</script>
<style>
.done {
  text-decoration: line-through;
}
</style>
