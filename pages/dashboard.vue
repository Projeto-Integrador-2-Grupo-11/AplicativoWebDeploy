<template>
  <div>
    <label class="col-md-12 center mt-3 col-form-label form-control-label">Selecione o período que deseja visualizar</label>
    <form class="col-12 mt-4 center">
      <div class="form-group row">
        <label for="start-date" class="col-md-1 col-form-label form-control-label">Período Inicial</label>
        <div class="col-md-3">
          <base-input 
            type="date" 
            v-model="model.startDate" 
            id="start-date" 
          />
        </div>
        <label for="end-date" class="col-md-1 col-form-label form-control-label">Período Final</label>
        <div class="col-md-3">
          <base-input 
            type="date" 
            v-model="model.endDate" 
            id="end-date"
          />
        </div>
        <div class="col-md-3">
          <base-button @click="changeDateRange()" type="primary" class="my-0">Aplicar</base-button>
        </div>
      </div>
    </form>
    <div class="col-12 mt-6 row">
      <div class="col-md-4 col-sm-12">
        <StatsCard class="bg-orange">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0 text-white">Total de Laranjas Processadas</h5>
              <span class="h2 font-weight-bold mb-0 text-white">{{ new Intl.NumberFormat('pt-BR').format(orangesAmount) }}</span>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm">
            <span class="text-nowrap text-white">Equivalência em Kg</span>
          </p>
        </StatsCard>
      </div>
      <div class="col-md-4 col-sm-12">
        <StatsCard class="bg-purple-card">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0 text-white">Total de Laranjas Boas</h5>
              <span class="h2 font-weight-bold mb-0 text-white">{{ new Intl.NumberFormat('pt-BR').format(goodOranges) }}</span>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm">
            <span class="text-nowrap text-white">Equivalência em Kg</span>
          </p>
        </StatsCard>
      </div>
      <div class="col-md-4 col-sm-12">
        <StatsCard class="bg-pink">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0 text-white">Total de Laranjas Descartadas</h5>
              <span class="h2 font-weight-bold mb-0 text-white">{{ new Intl.NumberFormat('pt-BR').format(badOranges) }}</span>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm">
            <span class="text-nowrap text-white">Equivalência em Kg</span>
          </p>
        </StatsCard>
      </div>
    </div>
    <!-- <hr class="v-line"> -->
    <Card class="bg-white col-11 center">
      <h5 class="card-title text-uppercase text-muted mb-0 ">Subclassificações das Laranjas Boas</h5>
      <div class="row mt-3 col-12">
        <div class="col-md-8 col-sm-12">
          <StatsCard class="bg-green">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Total de Laranjas SEM Manchas </h5>
                <span class="h2 font-weight-bold mb-0 text-white">{{ new Intl.NumberFormat('pt-BR').format(goodOrangesSpotless) }}</span>
              </div>
            </div>
            <div class="row row-example">
               <div class="col-sm">
                <span>Grandes - {{ largeOranges }}</span>
              </div>
              <div class="col-sm">
                <span>Médias - {{ mediumOranges }}</span>
              </div>
              <div class="col-sm">
                <span>Pequenas - {{ smallOranges }}</span>
              </div>
            </div>
          </StatsCard>
        </div>
        <div class="col-md-4 col-sm-12"> 
          <StatsCard class="bg-yellow">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Total de Laranjas COM Mancha</h5>
                <span class="h2 font-weight-bold mb-0 text-white">{{ new Intl.NumberFormat('pt-BR').format(goodOrangesWithSpots) }}</span>
              </div>
            </div>
          </StatsCard>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard';
  import Card from '@/components/Cards/Card';
  import BaseInput from '@/components/Inputs/BaseInput';
  import BaseButton from '@/components/Buttons/BaseButton.vue';

  export default {
    layout: 'DashboardLayout',
    methods: {
      changeDateRange() {
        if(this.model.startDate.length == 10 && this.model.endDate.length == 10){
          this.getOranges();
          this.getOrangesBySize();
        }
      },
      getOranges: async function() {
        const machineId = parseInt(this.$cookiz.get('machineId'));
        const startDate = new Date(this.model.startDate + ":00:00:00");
        const endDate = new Date(this.model.endDate + ":23:59:59");

        let orangesRef = this.$store.$firestore.collection('oranges');
        let query = orangesRef
            .where('machine_id', '==', machineId)
            .where('date', '>=', startDate)
            .where('date', '<=', endDate);

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
                console.log(goodOrangesSpotless);
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
      },
      getOrangesBySize: async function() {
        const machineId = parseInt(this.$cookiz.get('machineId'));
        const startDate = new Date(this.model.startDate + ":00:00:00");
        const endDate = new Date(this.model.endDate + ":23:59:59");

        let qtOrangesRef = this.$store.$firestore.collection('quantity_oranges');
        let query = qtOrangesRef
            .where('machine_id', '==', machineId)
            .where('date', '>=', startDate)
            .where('date', '<=', endDate);

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
        this.goodOrangesSpotless = smallOranges + mediumOranges + largeOranges;
      }
    },
    components:{
      StatsCard,
      Card,
      BaseInput,
      BaseButton
    },
    data() {
      return {
        model: {
          startDate: (new Date).toISOString().substring(0, 10),
          endDate: (new Date).toISOString().substring(0, 10),
        },
        orangesAmount: 0,
        goodOranges: 0,
        badOranges: 0,
        goodOrangesWithSpots: 0,
        goodOrangesSpotless: 0,
        smallOranges: 0,
        mediumOranges: 0,
        largeOranges: 0
      }
    },
    created() {
      this.getOranges();
      this.getOrangesBySize();
    }
  }
</script>
<style scoped>
/* .v-line{
  transform: rotate(90deg); 
  width: 116px; 
}  */
</style>