<template>
  <div class="row">
    <div class="col-12">
      <card type="chart">
        <template slot="header">
          <base-button @click="loginClicked()">Login with Google</base-button>
          <base-button @click="m()">M</base-button>
          <base-input type="=id" label="hypothesis_id" placeholder="hypothesis_id" v-model="hypothesis_id"/>
          <div class="row">
            <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
              <h5 class="card-category">Total shipments</h5>
              <h2 class="card-title">Performance</h2>
            </div>
            <base-button type="button" native-type="Submit" v-on:click="change(0)">Test</base-button>
            <div class="col-sm-6 d-flex d-sm-block">
              <div
                class="btn-group btn-group-toggle"
                :class="isRTL ? 'float-left' : 'float-right'"
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
        <h4 slot="header" class="card-title">Striped table</h4>
        <el-table :data="tableData">
          <el-table-column
            min-width="150"
            sortable
            label="Name"
            property="name"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Capital"
            property="capital"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Gamma"
            property="gamma"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            align="right"
            header-align="right"
            label="Method"
            property="method"
          ></el-table-column>
        </el-table>
      </card>
    </div>

  <ul>
    <li v-for="todo in todos" :key="todo.text">
      <input :checked="todo.done" @change="toggle(todo)" type="checkbox">
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
    </li>
    <li><input @keyup.enter="addTodo" placeholder="What needs to be done?"></li>
  </ul>



  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';
import * as chartConfigs from '@/components/Charts/config';
import TaskList from '@/components/Dashboard/TaskList';
import config from '@/config';
import { Table, TableColumn } from 'element-ui';

import { mapMutations } from 'vuex'

export default {
  //middleware: ['auth'],
  async fetch() {
    const preferredHypothesisOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: this.hypothesis_id })
    };
    this.tableData = await fetch("http://localhost:8000/strategy/preferred_hypothesis", preferredHypothesisOptions).then(r => r.json());

    const hypothesisdataOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: this.user_id })
    };
    const hypothesisData = await fetch("http://localhost:8000/strategy/hypothesis_data", hypothesisdataOptions).then(r => r.json());

    this.bigChartLabels = hypothesisData["bigChartLabels"];
    var bigChartData = []
    for (const [key, value] of Object.entries(hypothesisData["bigChartData"])) {bigChartData.push(value);}
    this.bigChartData = bigChartData;
    this.$cookies.set("cookie-name", "cookie-value", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    const cookieRes = this.$cookies.get("cookie-name");
    console.log(cookieRes);

    //this.$auth.loginWith('google', { params: { another_post_key: "value" } })
    console.log("FINI LE JAVASCRIPT");
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
      hypothesis_id: 1,
      user_id: 1,
      bigLineChartCategories: [
        {name: 'mimimim', icon: 'tim-icons icon-single-02'}, 
        {name: 'Truc', icon: 'tim-icons icon-gift-2'},
        {name: 'Mich', icon: 'tim-icons icon-tap-02'}
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
    todos () {
      return this.$store.state.todos.list
    },
    bigLineChart () {
      return {
        activeIndex: 0,
        chartData: {
          datasets: [{
            ...this.bigChartDatasetOptions,
            data: this.bigChartData[0]
          }],
          labels: this.bigChartLabels
        },
        extraOptions: chartConfigs.purpleChartOptions,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: this.bigLineChartCategories
      };
    },
    enableRTL () {
      // Right-To-Left pour les langues qui se lisent à l'envers
      return this.$route.query.enableRTL;
    },
    isRTL () {
      return this.$rtl.isRTL;
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
     addTodo (e) {
      this.$store.commit('todos/add', e.target.value)
      e.target.value = ''
    },
    ...mapMutations({
      toggle: 'todos/toggle'
    }),
    consoleLog(text) {
            if (this.log !== null) {
                this.log += text + "\n";
            } else {
                this.log = text + "\n";
            }
        },
    async m() {
      console.log(this.$store.$auth.user)
    },
    async loginClicked() {
      try {
        //let res = await this.$auth.loginWith('google', { params: { another_post_key: "value" } });
        let res = await this.$auth.loginWith('google');
      } catch (err) {
        this.consoleLog("login error: " + err);
      }
    }
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
