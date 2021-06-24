<template>
  <div class="row">
    <div class="col-12">
      <div>
        <div>{{ this.couille }}</div>
        <div>{{ this.meh }}</div>
        <button @click="refresh">Refresh</button>
      </div>
      <!--
      <div>
                  <input
                    type="radio"
                    @click="initBigChart(0)"
                    />
      </div>
      -->
      <card type="chart">
        <span slot="header">
          <div class="row">

            <div class="col-sm-6">
              <h5 class="card-category">Portefolio Value</h5>
              <h2 class="card-title">Performance</h2>
            </div>
          </div> 
        </span>


            <div class="col-sm-6 d-flex d-sm-block">
              <div
                class="btn-group btn-group-toggle"
                data-toggle="buttons"
              >
                  <!-- :key="option.name"  -->
                <label
                  v-for="(option, index) in this.bigLineChartCategories"
                  class="btn btn-sm btn-primary btn-simple"
                  :class="{ active: couille.activeIndex === index }"
                  :id="index"
                >
                  <input
                    type="radio"
                    @click="initBigChart(index)"
                    name="options"
                    autocomplete="off"
                    :checked="couille.activeIndex === index"
                  />
                  <span class="d-none d-sm-block">{{ option.name }}</span>
                  <span class="d-block d-sm-none">
                    <i :class="option.icon"></i>
                  </span>
                </label>
              </div>
            </div>
      </card>
        <div class="chart-area">
            <!-- :key="couille" -->
        <div v-if="dataReady">
          <line-chart
            style="lineChartStyle"
            :chart-data="couille"
            v-model="couille"
          >
          </line-chart>
        </div>
        </div>



    </div>
    <div class="col-lg-7" v-if="dataReady">
      <card card-body-classes="table-full-width">
        <h4 slot="header" class="card-title">Saved Hypothesis</h4>
        <el-table 
        :data="this.hypothesisList"
        ref="checkedHypothesis"
        @selection-change="handleSelectionChange"
        >
          <el-table-column
            min-width="150"
            sortable
            type="selection"
            label="Hypothesis name"
            property="name">
          </el-table-column>
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
                  <base-button type="success" size="sm" icon @click="set_preferred(row)">
                    <i class="tim-icons icon-settings"></i>
                  </base-button>
                </el-tooltip>
                <el-tooltip content="Delete" :open-delay="300" placement="top">
                  <base-button type="danger" size="sm" icon @click="ask_for_removal(row)">
                    <i class="tim-icons icon-simple-remove"></i>
                  </base-button>
                </el-tooltip>
              </div>
          </el-table-column>
          <!--<div style="margin-top: 20px">
            <el-button @click="toggleSelection([tableData[1], tableData[2]])">Toggle selection status of second and third rows</el-button>
            <el-button @click="toggleSelection()">Clear selection</el-button>
          </div> -->
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

import { BaseAlert } from '@/components';
import { GET, POST, DELETE, PATCH , PUT} from '@/util/request.js';

import { mapMutations } from 'vuex'
import BaseRadio from '../components/Inputs/BaseRadio.vue';

export default {
  async asyncData (context) {
    // console.log(context)
  // Only available on the Server-side
  if (process.server) {
    const { req, res, beforeNuxtRender } = context
    console.log("SERVER")
  }

  // Only available on the Client-side
  if (process.client) {
    const { from, nuxtState } = context
    console.log("CLIENT")
  }
  return {
    meh: 123
  }
    /*
    try {
      await store.dispatch('getStore', params.category)
    } catch (e) {
      return error({
        message: e.message,
        statusCode: e.Response.status
      })
    }
    */
  },
  fetchOnServer: false,
  name: 'dashboard',
  components: {
    LineChart,
    BarChart,
    TaskList,
    BaseAlert,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data () {
    return {
      dataReady: false,
      type: ['', 'info', 'success', 'warning', 'danger'],
      notifications: {
        topCenter: false
      },
      checkedHypothesis: [],
      tableData: [],
      bigChartData: {},
      bigChartLabels: [],
      hypothesisList: [],
      couille: {},
      a: {},
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
    lineChartStyle () {
      return  {
        position: 'relative'
      }
    }
  },
  methods: {
    refresh() {
      window.onNuxtReady(() => {
        console.log('Nuxt.js is ready and mounted')
      })
      this.$nuxt.refresh()
    },
    initBigChart (index) {
      /* TODO: une varialbe de data n'est pas update dans une methode faut passer par le store ou je sais pas quoi tellement ça pue la merde
      */
      let indexTranslate = {'0': 'simple', '1': 'cumsum', '2': 'pct'}
      let tmp = []
      for (let [key, value] of Object.entries(this.a)) {
          tmp.push({
            ...this.bigChartDatasetOptions,
            data: value[indexTranslate[index]]
          })
      }
      console.log(tmp)
      let chartData = {
        datasets: tmp,
        labels: this.bigChartLabels
      }
      /*
     let chartData = {
        datasets: [{
          ...this.bigChartDatasetOptions,
          data: this.bigChartData[index]
        }],
        labels: this.bigChartLabels
      };
      */
      this.couille = chartData
      this.couille.activeIndex = index

      this.$forceUpdate();
    },
    async set_preferred(row) {
      const hypothesisData = await PATCH(
        "http://localhost:8000/personnal/users/"+this.$store.$auth.user.pk+"/usermeta/",
        {"Content-type": "application/json"},
        {"preferred_hypothesis": row.id, "user": this.$store.$auth.user.pk},
      );
      if (row != null) {
        this.$cookies.set("preferred-hypothesis", row.id, {
          path: "/",
          maxAge: 24 * 7
        });
      }
      // THIS HYP IS NOW YOUR FAVOURITE
      this.notifyVue({message: "Hypothesis "+row.name+" is now your favourite"})
    },
    ask_for_removal(row) {
      this.$swal({  
        title: "Do you want to delete this record",  
        text: "This will be removed from Database",  
        type: "warning",  
        showCancelButton: true,  
        confirmButtonColor: "#4026e3",  
        confirmButtonText: "Yes, remove it it!"  
      }).then((result) => { if (result.value) {
        this.remove_chart(row)
        this.notifyVue({message: "Hypothesis "+row.name+" Has been deleted", timeout: 3000})
      ;}});  
    },
    async remove_chart(row) {
      const hypothesisData = await DELETE(
        "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis/"+row.id,
      );
      this.$cookies.remove("preferred-hypothesis", {
        path: "/",
        maxAge: 24 * 7
      });
    },
    async update_chart(row) {
      console.log("RIW")
      console.log(row)
      const hypothesisData = await GET(
        "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis/"+row.id+"/hypothesis_data",
      );
      this.bigChartLabels = hypothesisData["bigChartLabels"];

      var bigChartData = []
      for (const [key, value] of Object.entries(hypothesisData["bigChartData"])) {bigChartData.push(value);}
      this.bigChartData = bigChartData;
      let chartData = {
        datasets: bigChartData,
        labels: this.bigChartLabels
      }
      this.couille = chartData
      console.log(bigChartData)
      this.notifyVue({message: "I'm displaying Hypothesis "+row.name, timeout: 3000})
    },
    notifyVue({message, verticalAlign='top', horizontalAlign='right', timeout=30000} = {}) {
      let color = Math.floor(Math.random() * 4 + 1);
      this.$notify({
        message: message,
        timeout: timeout,
        icon: 'tim-icons icon-bell-55',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: this.type[color]
      });
    },
    async handleSelectionChange(content) {
      let index_list = [0]
      for (const [key, value] of Object.entries(content)) {index_list.push(parseInt(key));}
      this.checkedHypothesis = index_list
      let dataMatrix = {}

      for (const [key, value] of Object.entries(content)) {
        let hypothesis_data = await GET(
          "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis/"+value['id']+"/hypothesis_data",
        )
          dataMatrix[value['id']] = {'simple': [], 'cumsum': [], 'pct': []}
          dataMatrix[value['id']]['simple'] = hypothesis_data['bigChartData']['simple']
          dataMatrix[value['id']]['cumsum'] = hypothesis_data['bigChartData']['simple']
          dataMatrix[value['id']]['pct'] = hypothesis_data['bigChartData']['simple']
      }
      this.a = dataMatrix
    }
  },
  async mounted () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
    // Query the user's preferred hypothesis
    let user_preferred_hypothesis_id = this.$cookies.get("preferred-hypothesis")

    // console.log(user_preferred_hypothesis_id)
    // console.log(this.$store.$auth.user)

    if ((user_preferred_hypothesis_id === undefined || user_preferred_hypothesis_id === "") && this.$store.$auth.user.usermeta !== null) {
      user_preferred_hypothesis_id = this.$store.$auth.user.usermeta.preferred_hypothesis
      this.$cookies.set("preferred-hypothesis", user_preferred_hypothesis_id, {
        path: "/",
        maxAge: 7 * 24
      });
    }

    // Query the hypothesis data
    const hypothesisData = await GET(
      "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis/"+user_preferred_hypothesis_id+"/hypothesis_data",
    );
    this.bigChartLabels = hypothesisData["bigChartLabels"];

    // For each different mathematical calculation we populate the graph
    let bigChartData = []
    for (const [key, value] of Object.entries(hypothesisData["bigChartData"])) {bigChartData.push(value);}
    this.bigChartData = bigChartData;
    
    // We query a specific hypothesis to display in the graph
    // {"Content-Type": "application/json", "Authorization": this.$store.$auth.strategy.token.get()},
    const hypothesisList = await GET(
      "http://localhost:8000/strategy/users/"+this.$store.$auth.user.pk+"/hypothesis",
    );
    this.hypothesisList = hypothesisList

    await this.handleSelectionChange([hypothesisList[0]])
    this.initBigChart(0);

    this.dataReady = true;
  }
}
</script>
<style>
.done {
  text-decoration: line-through;
}
</style>