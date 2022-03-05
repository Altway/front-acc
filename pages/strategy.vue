<template>
  <div class="row">
    <base-button @click="test()">Test</base-button>
    <div>
      <multiselect placeholder="Select coins" :taggable="true" :options="options" :multiple="true" :close-on-select="false" v-model="tickers_selected"></multiselect>
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

  export default {
    //middleware: 'auth',
    async fetch() {
      this.strategy_dict = await fetch('http://localhost:8000/strategy/risk').then(res => res.json())
      this.returns_dict = await fetch('http://localhost:8000/strategy/returns').then(res => res.json())
      this.goals_list = await fetch('http://localhost:8000/strategy/goals').then(res => res.json())
      let r = await fetch('http://localhost:8000/strategy/coins_list').then(res => res.json())
      this.options = r.map(el=>el.symbol)
      //let t = await fetch('http://localhost:8000/strategy/snippets').then(res => res.json())
      //this.tmp = await this.$store.$auth.fetchUser()
    },
    fetchOnServer: false,
    data() {
      return {
        strategy_dict: {},
        method_list: ["HRPOpt", "Historical"],
        returns_dict: {},
        risk_choice: "",
        method_choice: "",
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
        tickers_selected: null,
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
          this.tickers_selected = JSON.parse(localStorage.getItem("stored_coins"))
        } catch(e) {
          localStorage.removeItem("stored_coins")
        }
      }
    },
    methods: {
      async test() {
        //let res = await this.$auth.loginWith('google');
        //console.log(this.$store.$auth.user);
        console.log(this.$store.$auth)
        //console.log(this.$store.$auth.strategy.token.get())
        //console.log(this.$store.$auth.refreshToken)
        this.$store.$auth.setUser(this.$store.$auth.user);
        console.log(this.$store.$auth.user.pk)
        //console.log(this.$store.$auth.user);
        const bopi = {
          method: "GET",
          headers: { "Content-Type": "application/json", "Authorization": this.$store.$auth.strategy.token.get()},
        };
        //let a = await fetch('http://localhost:8000/strategy/snippets/', bopi).then(r => r.json());
        //console.log(a)
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
          "user": this.$store.$auth.user.pk,
          "broker_fees": this.broker_fees,
          "capital": this.capital,
          "expected_returns_id": 1,
          "expected_return": this.expected_return,
          "risk_free_rate": this.risk_free_rate,
          "tickers_selected": this.tickers_selected.toString(),
          "short_selling": this.short_selling,
          "method_choice": this.method_choice,
          "returns_choice": this.returns_choice,
          "risk_percentage": this.risk_percentage,
          "gamma": this.gamma,
        }
        if(!this.method_choice)
          this.method_choice = "HRPOpt"
        if (this.method_choice == "HRPOpt")
          //this.final_allocation = await this.$http.$post('http://localhost:8000/strategy/hrpopt', payload);
          this.final_allocation = await this.$http.$post(`http://localhost:8000/strategy/users/${this.$store.$auth.user.pk}/hropt/`, payload);
          //this.final_allocation = await this.$http.$post('http://localhost:8000/strategy/snippets/', payload);
        else if (this.method_choice == "Historical")
          console.log(`http://localhost:8000/strategy/users/${this.$store.$auth.user.pk}/historical`)
          console.log(payload)
          this.final_allocation = await this.$http.$post(`http://localhost:8000/strategy/users/${this.$store.$auth.user.pk}/historical/`, payload);
          //this.userData = await fetch(`http://localhost:8000/personnal/user/${id}`).then(res => res.json())

        const hypothesis = await this.$http.$get(`http://localhost:8000/strategy/users/${this.$store.$auth.user.pk}/hypothesis/${this.final_allocation['hypothesis_id']}/`, payload);
        console.log(hypothesis)
        //this.final_allocation = this.final_allocatio.map(el=>el.symbol)
        let b = JSON.parse(hypothesis['allocation'])
        console.log(b)
        let calculated_chartdata = {
          labels: Object.keys(b),
          datasets: [{
            label: 'Allocation',
            backgroundColor: ['#00c09d', '#e2e2e2'],
            data: Object.values(b)
          }]
        }
        this.chart_data = calculated_chartdata;
        //const truc = await this.$http.$post('http://localhost:8000/strategy/input', payload);
        //const r = await truc.text()

        //this.final_allocation = tru.map(el=>el.symbol)
      
        //this.final_allocation  = await this.$http.$post('http://localhost:8000/strategy/input', payload).then(res => json());
        //const truc = await res.json()
        //console.log(truc)
        //return truc
        //this.final_allocation = data.json()
      },
    }
  };
</script>

<style scoped lang="scss"></style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
