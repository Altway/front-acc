<template>
  <div class="row">
    <base-button @click="test()">Test</base-button>
    <div>
      <multiselect placeholder="Select coins" :taggable="true" :options="options" :multiple="true" :close-on-select="false" v-model="coins_selected"></multiselect>
    </div>
    <base-input type="=capital" label="Capital" placeholder="Capital" v-model="capital"/>
    <base-input type="risk_free_rate" label="Risk free rate" placeholder="Risk free rate" v-model="risk_free_rate"/>
    <base-input type="broker_fees" label="Broker fees" placeholder="Broker fees" v-model="broker_fees"/>
    <base-input type="name" label="name" placeholder="name" v-model="name"/>
    <div class="col-md-12">
      <base-dropdown title-classes="btn btn-secondary" title="Strategy">
          <a class="dropdown-item" v-bind:key="value" v-for="value in strategy_dict" @click="update_strategy(value)">
            {{ value }}
          </a>
      </base-dropdown>
      <base-dropdown title-classes="btn btn-secondary" title="Method">
          <a class="dropdown-item" v-bind:key="item" v-for="item in method_list" @click="update_method(item)">
            {{ item }}
          </a>
      </base-dropdown>
    </div>
    <div class="col-md-12">
      {{ this.risk_choice }}
    </div>

    <div class="col-md-12">
      <card>
        <form @submit.prevent>
          <div class="form-row">
            <div v-if="risk_choice == 'Sample covariance'">
              <base-input type="risk" label="Risk percentage" placeholder="Risk" v-model="risk_percentage"/>
              <base-input type="return" label="Expected return" placeholder="Returns" v-model="expected_return"/>
              <base-input type="meh" label="Returns" placeholder="Meh">
                <select id="inputState" class="form-control" v-model="returns_choice">
                  <option class="dropdown-item" v-bind:key="value" v-for="value in returns_dict">
                    {{ value }}
                  </option>
                </select>
              </base-input>
            </div>
            <div v-else-if="risk_choice == 'Exponential covariance'">
              <base-input type="risk" label="Risk percentage" placeholder="Risk" v-model="risk_percentage"/>
              <base-input type="return" label="Expected return" placeholder="Returns" v-model="expected_return"/>
              <base-input type="meh" label="Returns" placeholder="Meh">
                <select id="inputState" class="form-control" v-model="returns_choice">
                  <option class="dropdown-item" v-bind:key="value" v-for="value in returns_dict">
                    {{ value }}
                  </option>
                </select>
              </base-input>
            </div>
            <div v-else>
              <h1> Select a Strategy </h1>
            </div>
          </div>

          <div>
            <client-only>
              <!-- ce composant sera render seulement du côté client -->
              <!-- <full-calendar :events="events" :header="header" :config="config" ref="calendar"></full-calendar> -->
              <VueSlideBar label="Gamma" v-model="gamma" :min="0.01" :max="10" :processStyle="slider.processStyle" :lineHeight="slider.lineHeight"/>
              <!-- indicateur de chargement, render du côté serveur -->
            </client-only>
          </div>

        <base-input>
          <base-checkbox v-model="short_selling">Enable Short Selling</base-checkbox>
        </base-input>
        
        <base-button type="button" native-type="Submit" v-on:click="start_simulation()">Start Simulation</base-button>
        </form>
    <div class="col-md-12">
      <card>
        <div>{{ final_allocation }}</div>
        <!--<div><client-only><RandomChart/></client-only></div>-->
        <div>
          <!-- <LineChart :chartData="chart_data"/> -->
          <PieChart :chartData="chart_data"/>
        </div>
      </card>
    </div>
      </card>
    </div>
  </div>
</template>
<script>
  import {BaseDropdown, LineChart, PieChart} from '@/components'
  import Multiselect from 'vue-multiselect'

  import { GET, POST } from '@/util/request.js';

  export default {
    middleware: 'auth',
    fetchOnServer: false,
    async fetch() {
      this.strategy_dict = await GET('http://localhost:8000/strategy/risk')
      this.returns_dict = await GET('http://localhost:8000/strategy/returns')
      this.goals_list = await GET('http://localhost:8000/strategy/goals')
      let r = await GET('http://localhost:8000/strategy/coins_list')
      this.options = r.map(el=>el.symbol)
      this.tmp = await this.$store.$auth.fetchUser()
    },
    data() {
      return {
        strategy_dict: {},
        method_list: ["HRPOpt", "Historical"],
        returns_dict: {},
        risk_choice: "",
        method_choice: "Historical",
        short_selling: false,
        returns_choice: "",
        name: "",
        risk_percentage: 3,
        risk_free_rate: 0.01,
        broker_fees: 0.01,
        final_allocation: null,
        chart_options: {
          responsive: true,
          maintainAspectRatio: true
        },
        chart_data: {},
        tmp:{},
        capital: 0,
        value: null,
        expected_return: 0,
        coins_selected: null,
        stored_coins: null,
        options: [],
        goals_list: [],
        gamma: 1,
        slider: {
          lineHeight: 10,
          processStyle: {
            backgroundColor: 'blue'
          }
        },
     }
    },
    components: {
      BaseDropdown,
      Multiselect,
      LineChart,
      PieChart,
    },
    mounted() {
      if (localStorage.getItem("stored_coins")) {
        try {
          this.coins_selected = JSON.parse(localStorage.getItem("stored_coins"))
        } catch(e) {
          localStorage.removeItem("stored_coins")
        }
      }
    },
    methods: {
      async test() {
        this.$store.$auth.setUser(this.$store.$auth.user);
        console.log(this.$store.$auth)
        console.log(this.$store.$auth.user.pk)
        let resp = await GET(
          'http://localhost:8000/strategy/hropt/', 
          { "Content-Type": "application/json", "Authorization": this.$store.$auth.strategy.token.get()},
        );
        console.log(resp)
      },
      update_strategy(choice) {
        this.risk_choice = choice;
      },
      update_return(choice) {
        this.returns_choice = choice;
      },
      update_method(choice) {
        this.method_choice = choice;
      },
      async start_simulation() {
        let payload = {
          "name": this.name,
          "risk_choice": this.risk_choice,
          "risk_model_id": 1,
          "user_id": this.$store.$auth.user.pk,
          "broker_fees": this.broker_fees,
          "capital": this.capital,
          "expected_returns_id": 1,
          "expected_return": this.expected_return,
          "risk_free_rate": this.risk_free_rate,
          "coins_selected": this.coins_selected,
          "short_selling": this.short_selling,
          "method_choice": this.method_choice,
          "returns_choice": this.returns_choice,
          "risk_percentage": this.risk_percentage,
          "gamma": this.gamma,
        }
        switch(this.method_choice) {
          case "HRPOpt":
            this.final_allocation = await POST('http://localhost:8000/strategy/hropt/', {}, payload);
            break;
          case "Historical":
            this.final_allocation = await POST('http://localhost:8000/strategy/historical/', {}, payload);
            break;
          default:
            console.log("Default case");
        }

        this.chart_data = {
          labels: Object.keys(this.final_allocation),
          datasets: [{
            label: 'Allocation',
            backgroundColor: ['#00c09d', '#e2e2e2'],
            data: Object.values(this.final_allocation)
          }]
        }
      },
    }
  };
</script>

<style scoped lang="scss"></style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>