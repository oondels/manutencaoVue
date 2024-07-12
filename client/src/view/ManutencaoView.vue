<template>
  <div>
    <h1>Máquinas</h1>
    <manual-maquinas :maquinas="maquinasObject" />
  </div>
</template>

<script>
import axios from "axios";
import ManualMaquinas from "../components/ManualMaquinas.vue";

export default {
  name: "manutencao-view",
  components: {
    ManualMaquinas,
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

<style>
.toggle-button {
  cursor: pointer;
  color: #333;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 15px;
}

.toggle-button:hover {
  color: #1f75fe;
}

.toggle-button.active {
  color: #1f75fe;
}

.hidden {
  display: none;
}
</style>
