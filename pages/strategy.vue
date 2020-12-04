<template>
  <div class="row">
    <div>
      <multiselect placeholder="Select coins" :taggable="true" :options="options" :multiple="true" :close-on-select="false" v-model="coins_selected"></multiselect>
    </div>
    <div class="col-md-12">
      <base-dropdown title-classes="btn btn-secondary" title="Strategy">
          <a class="dropdown-item" v-bind:key="value" v-for="value in strategy_dict" @click="update_strategy(value)">
            {{ value }}
          </a>
      </base-dropdown>
    </div>
    <div class="col-md-12">
      {{ this.risk_choice }}
    </div>

    <div class="col-md-12">
      <card>
        <form>
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
        
        <base-button type="primary" native-type="Submit" v-on:click="start_simulation()">Start Simulation</base-button>
        </form>

      </card>
    </div>
  </div>
</template>
<script>
  import {BaseDropdown} from '@/components'
  import Multiselect from 'vue-multiselect'

  export default {
    async fetch() {
      this.strategy_dict = await fetch('http://localhost:8000/strategy/risk').then(res => res.json())
      this.returns_dict = await fetch('http://localhost:8000/strategy/returns').then(res => res.json())
      let r = await fetch('http://localhost:8000/strategy/coins_list').then(res => res.json())
      this.options = r.map(el=>el.symbol)
    },
    fetchOnServer: false,
    data() {
      return {
        strategy_dict: {},
        returns_dict: {},
        risk_choice: "",
        short_selling: false,
        returns_choice: "",
        risk_percentage: 0,
        expected_return: 0,
        value: null,
        coins_selected: null,
        options: [],
        gamma: 1,
        slider: {
          lineHeight: 10,
          processStyle: {
            backgroundColor: 'blue'
          }
        }
      }
    },
    components: {
      BaseDropdown,
      Multiselect,
    },
    methods: {
      update_strategy(choice) {
        this.risk_choice = choice;
      },
      update_return(choice) {
        this.returns_choice = choice;
      },
      async start_simulation() {
        let payload = {
          "risk_choice": this.risk_choice,
          "returns_choice": this.returns_choice,
          "risk_percentage": this.risk_percentage,
          "expected_return": this.expected_return,
          "coins_selected": this.coins_selected,
          "short_selling": this.short_selling,
          "gamma": this.gamma,
        }
        const data = await this.$http.$post('http://localhost:8000/strategy/input', payload);
      },
    }
  };
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss"></style>