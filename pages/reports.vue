<template>
  <div>
    <form class="col-12 mt-4 center">
      <label class="col-form-label form-control-label">
        Selecione o período para o qual você deseja que os dados sejam recuperados:
      </label>
      <div class="col-10 center d-flex flex-row justify-content-center my-4">
        <label for="start-date" class="col-md-2 col-form-label form-control-label">Período Inicial</label>
        <div class="col-md-3">
          <base-input 
            type="date" 
            id="start-date"
            v-model="model.startDate"
          />
        </div>
        <label for="start-date" class="col-md-2 col-form-label form-control-label">Período Final</label>
        <div class="col-md-3">
          <base-input 
            type="date" 
            id="end-date" 
            v-model="model.endDate"
          />
        </div>
      </div>
      <div class="col-10 center d-flex flex-row justify-content-center">
        <base-button @click="generateReport()" type="primary" class="my-0">Gerar Relatório</base-button>
      </div>
    </form>
  </div>
</template>
<script>
  import BaseInput from '@/components/Inputs/BaseInput';
  import BaseButton from '@/components/Buttons/BaseButton.vue';

  export default {
    layout: 'DashboardLayout',
    methods: {
    },
    components:{
      BaseInput,
      BaseButton
    },
    data() {
      return {
        model: {
          startDate: (new Date).toISOString().substring(0, 10),
          endDate: (new Date).toISOString().substring(0, 10),
        },
        data: [],
        csv: ''
      }
    },
    methods: {
      async generateReport() {
        console.log(this.model.startDate);
        console.log(this.model.endDate);

        if(this.model.startDate.length == 10 && this.model.endDate.length == 10){
          await this.getOranges();
          await this.getOrangesBySize();

          this.data.forEach(row => {
            this.csv += row.join(',');
            this.csv += "\n";
          });

          const filename = 'Relatório Quantitativo ' + 
            new Date(this.model.startDate).toLocaleDateString('pt-BR') + 
            ' - ' + 
            new Date(this.model.endDate).toLocaleDateString('pt-BR') + 
            '.csv';
      
          console.log(this.csv);

          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(this.csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = filename;
          hiddenElement.click();
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
              }
              case "bad": {
                badOranges++;
              }
            }
          });
        }

        // Pushing general oranges classifications
        this.data.push(
          ['CLASSIFICAÇÕES GERAL DAS LARANJAS'],
          ['Total de Laranjas Processadas', 'Laranjas Boas', 'Laranjas Ruins'],
          [String(orangesAmount), String(goodOranges), String(badOranges)]
        );

        // Pushing good oranges classifications
        this.data.push(
          ['\nCLASSIFICAÇÕES DAS LARANJAS BOAS'],
          ['Laranjas Boas Com Mancha', 'Laranjas Boas Sem Manchas'],
          [String(goodOrangesWithSpots), String(goodOrangesSpotless)]
        );
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

        // Pushing spotless oranges classifications (mecanical)
        this.data.push(
          ['\nCLASSIFICAÇÕES DE TAMANHO DAS LARANJAS BOAS SEM MANCHAS'],
          ['Laranjas Pequenas', 'Laranjas Médias', 'Laranjas Grandes'],
          [String(smallOranges), String(mediumOranges), String(largeOranges)]
        );
      }
    }
  }
</script>