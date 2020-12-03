<template>
  <div class="row">
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
        <!-- <full-calendar :events="events" :header="header" :config="config" ref="calendar"></full-calendar> -->
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
              <base-input type="text" label="Address" placeholder="1234 Main St"/>
            </div>
            <base-input type="password" label="Password" placeholder="Password"/>
            </div>

          <base-input type="text" label="Address 2" placeholder="Apartment, studio, or floor"/>
          
          <div class="form-row">
            <base-input class="col-md-4" label="State">
              <select id="inputState" class="form-control">
                <option selected>Choose...</option>
                <option>...</option>
              </select>
            </base-input>
            <base-input class="col-md-2" label="Zip" placeholder="Zip"/>
          </div>

        <base-input>
          <base-checkbox>Check me out</base-checkbox>
        </base-input>
        
        <base-button type="primary" native-type="Submit" v-on:click="start_simulation()">Start Simulation</base-button>
        </form>

      </card>
    </div>
  </div>
</template>
<script>
  import {BaseDropdown} from '@/components'


  export default {
    async fetch() {
      this.strategy_dict = await fetch('http://localhost:8000/strategy/risk').then(res => res.json())
      this.returns_dict = await fetch('http://localhost:8000/strategy/returns').then(res => res.json())
    },
    fetchOnServer: false,
    data() {
      return {
        strategy_dict: {},
        returns_dict: {},
        risk_choice: "",
        returns_choice: "",
        risk_percentage: 0,
        expected_return: 0,
      }
    },
    components: {
      BaseDropdown,
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
          "expected_return": this.expected_return
        }
        const data = await this.$http.$post('http://localhost:8000/strategy/input', payload);
      },
    }
  };
</script>
<style scoped lang="scss">
</style>