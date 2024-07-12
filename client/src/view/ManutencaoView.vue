<template>
  <div>
    <h1>Máquinas</h1>
    <lista-component :maquinas="maquinasObject" />
  </div>
</template>

<script>
import ListaComponent from "../components/ListaComponent.vue";
import axios from "axios";

export default {
  name: "manutencao-view",
  components: {
    ListaComponent,
  },
  data() {
    return {
      maquinasObject: {},
    };
  },
  mounted() {
    this.getMaquinas();
  },
  methods: {
    testeFunc() {
      axios
        .get("http://localhost:3000/tables")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    getMaquinas() {
      axios
        .get("http://localhost:3000/api/manual_maqs")
        .then((response) => {
          console.log(response.data);
          this.maquinasObject = response.data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>

<style></style>
