<template>
  <div>
    <form class="col-12 mt-4 center">
      <div class="form-group row">
        <label for="example-date-input" class="col-md-2 col-form-label form-control-label">Intervalo de Exibição</label>
        <div class="col-md-2">
          <base-input>
            <select  v-model="period" class="form-control" id="period-label">
              <option
                v-for="option in optionsPeriod" 
                :key="option.value"
                :label="option.text"
                :value="option.value"></option>
            </select>
          </base-input>
        </div>
        <label for="example-date-input" class="col-md-2 col-form-label form-control-label">Informação do Gráfico</label>
        <base-input>
          <select v-model="quantity" class="form-control" id="info-chart">
            <option
              v-for="option in optionsQuantity" 
              :key="option.value"
              :label="option.text"
              :value="option.value"></option>
          </select>
        </base-input> 
         <div v-if="period == 1" class="col-md-2">
          <base-button :loading="loading" @click="changePeriod()" type="primary" class="my-0">Aplicar</base-button>
        </div>   
      </div>
      <div class=" row">
        <label  v-if="period == 2" for="example-date-input" class="col-md-2 col-form-label form-control-label">Ano Inicial</label>
        <div  v-if="period == 2" class="col-md-2">
          <base-input>
            <select  v-model="initialYear" class="form-control" id="period-label">
              <option
                v-for="year in years" 
                :key="year"
                :label="year"
                :value="year"></option>
            </select>
          </base-input>
        </div>
        <label  v-if="period == 2" for="example-date-input" class="col-md-2 col-form-label form-control-label">Ano Final</label>
          <div  v-if="period == 2" class="col-md-2">
            <base-input>
              <select  v-model="finalYear" class="form-control" id="period-label">
                <option
                  v-for="year in years" 
                  :key="year"
                  :label="year"
                  :value="year"></option>
              </select>
            </base-input>
          </div>
          <label  v-if="period == 3" for="example-date-input" class="col-md-2 col-form-label form-control-label">Mês</label>
          <div  v-if="period == 3" class="col-md-2">
            <base-input>
              <select  v-model="selectedMonth" class="form-control" id="period-label">
                <option
                  v-for="month in months" 
                  :key="month.text"
                  :label="month.text"
                  :value="month.value"></option>
              </select>
            </base-input>
          </div>
          <label  v-if="period == 3" for="example-date-input" class="col-md-2 col-form-label form-control-label">Ano</label>
          <div  v-if="period == 3" class="col-md-2">
            <base-input>
              <select  v-model="yearMonth" class="form-control" id="period-label">
                <option
                  v-for="y in years" 
                  :key="y"
                  :label="y"
                  :value="y"></option>
              </select>
            </base-input>
          </div>
       <div v-if="period != 1" class="col-md-3">
          <base-button :loading="loading" @click="changePeriod()" type="primary" class="my-0">Aplicar</base-button>
        </div>
      </div>
    </form>
    <div class="col-12 mt-6 center">
      <card>
        <template slot="header">
          <h5 class="h3 mb-0">Informações das laranjas</h5>
        </template>
        <div class="chart-area">
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <bar-chart
            v-if="!loading"
            :height="350"
            :chart-data="barChartStacked.chartData"
            :extra-options="barChartStacked.extraOptions"
          >
          </bar-chart>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard';
  import Card from '@/components/Cards/Card';
  import BaseInput from '@/components/Inputs/BaseInput';
  import BaseButton from '@/components/Buttons/BaseButton.vue';
  import BarChart from '@/components/Charts/BarChart';
  import { Charts } from "~/components/Charts/config";

  export default {
    layout: 'DashboardLayout',
    methods: {
    },
    components:{
      StatsCard,
      Card,
      BaseInput,
      BaseButton,
      BarChart
    },
    computed : {
      years () {
        const year = new Date().getFullYear()
        return Array.from({length: year - 1999}, (value, index) => 2000 + index)
      },
      currentYear(){
        var date = new Date();
        return date.getFullYear();
      }
    },
    watch: {
      'barChartStacked.chartData': function (){
        return this.barChartStacked.chartData;
      }
    },
    async mounted() {
      this.loading = true;
      for(let i = 0; i < 12; i++){
        var firstDay = new Date(this.currentYear, i, 1);
        var lastDay = new Date(this.currentYear, i + 1, 0);
        await this.getOranges(firstDay, lastDay);
      }
      var obj = {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [{
              label: 'Laranjas Ruins',
              backgroundColor: Charts.colors.theme['danger'],
              data: this.arrayBadOranges
            }, {
              label: 'Laranjas Boas',
              backgroundColor: Charts.colors.theme['primary'],
              data: this.arrayGoodOranges
            }]
          }
        this.barChartStacked.chartData = Object.assign({}, this.barChartStacked.chartData, obj);
      this.loading = false;
    },
    methods:{
      async changePeriod(){
        this.arrayGoodOranges.length = 0;
        this.arrayBadOranges.length = 0;
        this.arrayLargeOranges.length = 0;
        this.arrayMediumOranges.length = 0;
        this.arraySmallOranges.length = 0;
        this.arrayOrangesWithSpots.length = 0;
        var period = [];
        this.loading = true;
        
        if(this.period == 1){
          for(let i = 0; i < 12; i++){
            var firstDay = new Date(this.currentYear, i, 1);
            var lastDay = new Date(this.currentYear, i + 1, 0);
            await this.getOrangesBySize(firstDay, lastDay);
            await this.getOranges(firstDay, lastDay);
          }
          period = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        } else if(this.period == 2){
          period = [];
          for(let i = this.initialYear; i < this.finalYear + 1; i++){
            period.push(i);
            var firstDay = new Date(i, 0, 1);
            var lastDay = new Date(i, 12, 0);
            await this.getOranges(firstDay, lastDay);
            await this.getOrangesBySize(firstDay, lastDay);
          }
        } else if(this.period == 3){
          period = [];
          var lastOfMonth = new Date(this.yearMonth, this.selectedMonth, 0);
          for(let i = 1; i < lastOfMonth.getDate(); i++){
            period.push(i);
            var firstDay = new Date(this.yearMonth, this.selectedMonth, i);
            var lastDay = '';
            await this.getOranges(firstDay, lastDay);
            await this.getOrangesBySize(firstDay, lastDay);
          }
        }
        
        var obj = {
            labels: period,
            datasets: [{
              label: this.quantity == 1 ? 'Laranjas Ruins' : this.quantity == 2 ? 'Laranjas Grandes' : 'Laranjas Com Imperfeições',
              backgroundColor: this.quantity == 1 ? Charts.colors.theme['danger'] : this.quantity == 2 ? Charts.colors.theme['green'] : Charts.colors.theme['pink'],
              data: this.quantity == 1 ? this.arrayBadOranges : this.quantity == 2 ? this.arrayLargeOranges : this.arrayOrangesWithSpots
            }, {
              label: this.quantity == 1 ? 'Laranjas Boas' : this.quantity == 2 ? 'Laranjas Médias' : '',
              backgroundColor: this.quantity == 1 ? Charts.colors.theme['primary'] : this.quantity == 2 ? Charts.colors.theme['orange'] : '',
              data: this.quantity == 1 ? this.arrayGoodOranges : this.quantity == 2 ? this.arrayMediumOranges : ''
            },
            {
              label: this.quantity == 2 ? 'Laranjas Pequenas' : '',
              backgroundColor: this.quantity == 2 ? Charts.colors.theme['yellow'] : '',
              data: this.quantity == 2 ? this.arraySmallOranges : ''
            }]
          }
        this.barChartStacked.chartData = Object.assign({}, this.barChartStacked.chartData, obj);
        this.loading = false;
      },
      getOranges: async function(firstDate, lastDate) {
        const machineId = parseInt(this.$cookiz.get('machineId'));

        let orangesRef = this.$firestore.collection('oranges');
        let query = ''; 
        if(lastDate != ''){
          query = orangesRef
              .where('machine_id', '==', machineId)
              .where('date', '>=', firstDate)
              .where('date', '<=', lastDate);
        } else{
          query = orangesRef
              .where('machine_id', '==', machineId)
              .where('date', '==', firstDate);
        }

        let snapshot = await query.get();

        let orangesAmount = 0;
        let goodOranges = 0;
        let goodOrangesWithSpots = 0;
        let goodOrangesSpotless = 0;
        let badOranges = 0;

        if(snapshot && !snapshot.empty) {
          snapshot.forEach(el => {
            orangesAmount++;
            switch(el.data().classification){
              case "good_with_spots": {
                goodOranges++;
                goodOrangesWithSpots++;
                break;
              }
              case "good_spotless": {
                goodOranges++;
                goodOrangesSpotless++;
              }
              case "bad": {
                badOranges++;
              }
            }
          });
        }

        this.orangesAmount = orangesAmount;
        this.goodOranges = goodOranges;
        this.goodOrangesWithSpots = goodOrangesWithSpots;
        this.goodOrangesSpotless = goodOrangesSpotless;
        this.badOranges = badOranges;

        this.arrayGoodOranges.push(this.goodOranges);
        this.arrayBadOranges.push(this.badOranges);
        this.arrayOrangesWithSpots.push(this.goodOrangesWithSpots);

      },
      getOrangesBySize: async function(startDate, endDate) {
        const machineId = parseInt(this.$cookiz.get('machineId'));

        let qtOrangesRef = this.$firestore.collection('quantity_oranges');
        let query = '';

        if(endDate != ''){
          query = qtOrangesRef
              .where('machine_id', '==', machineId)
              .where('date', '>=', startDate)
              .where('date', '<=', endDate);
        } else {
          query = qtOrangesRef
              .where('machine_id', '==', machineId)
              .where('date', '==', startDate);
        }

        let snapshot = await query.get();

        let smallOranges = 0;
        let mediumOranges = 0;
        let largeOranges = 0;

        if(snapshot && !snapshot.empty) {
          snapshot.forEach(el => {
            smallOranges += el.data().small_oranges;
            mediumOranges += el.data().medium_oranges;
            largeOranges += el.data().large_oranges;
          });
        }

        this.smallOranges = smallOranges;
        this.mediumOranges = mediumOranges;
        this.largeOranges = largeOranges;

        this.arrayLargeOranges.push(this.largeOranges);
        this.arrayMediumOranges.push(this.mediumOranges);
        this.arraySmallOranges.push(this.smallOranges);

      }
    },
    data() {
      return {
        period: 1,
        startDate: '',
        endDate: '',
        loading: false,
        months: [
          {
            text: 'Janeiro',
            value: 0
          },
          {
            text: 'Fevereiro',
            value: 1
          },
          {
            text: 'Março',
            value: 2
          },
          {
            text: 'Abril',
            value: 3
          },
          {
            text: 'Maio',
            value: 4
          },
          {
            text: 'Junho',
            value: 5
          },
          {
            text: 'Julho',
            value: 6
          },
          {
            text: 'Agosto',
            value: 7
          },
          {
            text: 'Setembro',
            value: 8
          },
          {
            text: 'Outubro',
            value: 9
          },
          {
            text: 'Novembro',
            value: 10
          },
          {
            text: 'Dezembro',
            value: 11
          }
        ],
        selectedMonth: 0,
        yearMonth: 2020,
        initialYear: 2000,
        finalYear: 2020,
        arrayGoodOranges: [],
        arrayBadOranges: [],
        arrayOrangesWithSpots: [],
        arrayOrangesSpotless: [],
        arrayLargeOranges: [],
        arrayMediumOranges: [],
        arraySmallOranges: [],
        orangesAmount: 0,
        goodOranges: 0,
        badOranges: 0,
        goodOrangesWithSpots: 0,
        goodOrangesSpotless: 0,
        smallOranges: 0,
        mediumOranges: 0,
        largeOranges: 0,
        quantity: 1,
        optionsQuantity: [
          {
            text: 'Quantidade total de laranjas processadas',
            value: 1
          },
          {
            text: 'Quantidade total de laranjas boas SEM manchas',
            value: 2
          },
          {
            text: 'Quantidade total de laranjas boas COM manchas',
            value: 3
          },
        ],
        optionsPeriod: [
          {
            text: 'Mensal',
            value: 1
          },
          {
            text: 'Anual',
            value: 2
          },
          {
            text: 'Diário',
            value: 3
          },
        ],
        date: '2018-11-23',
        barChartStacked: {
          chartData: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [{
              label: 'Laranjas Ruins',
              backgroundColor: Charts.colors.theme['danger'],
              data: []
            }, {
              label: 'Laranjas Boas',
              backgroundColor: Charts.colors.theme['primary'],
              data: []
            },
            {
              label: '',
              backgroundColor: Charts.colors.theme['primary'],
              data: []
            }]
          },
          extraOptions: {
            tooltips: {
              mode: 'index',
              intersect: false
            },
            responsive: true,
            scales: {
              xAxes: [{
                stacked: true,
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }
        }
      }
    },
  }
</script>
<style scoped>
.fa-spinner{
  font-size: 60px;
  margin-left: 50%;
}
/* .v-line{
  transform: rotate(90deg); 
  width: 116px; 
}  */
</style>