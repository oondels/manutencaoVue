<template>
  <div class="container">
    <div class="wrapper">
      <h1>Manual de Máquinas</h1>
      <input type="text" placeholder="Pesquisar Setor" v-model="setor" />
      <input type="text" placeholder="Pesquisar Máquina" v-model="maquina" />
      <button>Pesquisar</button>
      <div class="main">
        <div
          class="setores-list"
          v-for="(setor, setorIndex) in maquinasObject"
          :key="setorIndex"
        >
          <h1>{{ setor.nome }}</h1>
          <div
            class="maquinas-list"
            v-for="(maquina, maquinaIndex) in setor.Maquinas"
            :key="maquinaIndex"
          >
            <h3
              class="toggle-button"
              @click="toggleMaquina(setorIndex, maquinaIndex)"
            >
              {{ maquina.nome }}
            </h3>
            <div class="categorias-list" v-if="maquina.expandido">
              <div
                class="categoria"
                v-for="(categoria, categoriaIndex) in maquina.Categoria"
                :key="categoriaIndex"
              >
                <h4
                  class="toggle-button"
                  @click="
                    toggleCategoria(setorIndex, maquinaIndex, categoriaIndex)
                  "
                >
                  {{ categoria.nome }}
                </h4>
                <ul class="problemas-list" v-if="categoria.expandido">
                  <div
                    class="container-problema"
                    v-for="(problema, problemaIndex) in categoria.Problemas"
                    :key="problemaIndex"
                  >
                    <li class="problema-item">{{ problema.descricao }}</li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ManutencaoView",
  data() {
    return {
      setor: "",
      maquina: "",
      maquinasObject: {},
    };
  },
  mounted() {
    this.getMaquinas();
  },
  methods: {
    getMaquinas() {
      axios
        .get("http://localhost:3000/api/manual_maqs", {})
        .then((response) => {
          console.log(response.data);
          this.maquinasObject = response.data;

          this.maquinasObject.forEach((setor) => {
            setor.Maquinas.forEach((maquina) => {
              this.$set(maquina, "expandido", false);
              maquina.Categoria.forEach((categoria) => {
                this.$set(categoria, "expandido", false);
              });
            });
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    toggleMaquina(setorIndex, maquinaIndex) {
      const maquina = this.maquinasObject[setorIndex].Maquinas[maquinaIndex];
      maquina.expandido = !maquina.expandido;
    },
    toggleCategoria(setorIndex, maquinaIndex, categoriaIndex) {
      const categoria =
        this.maquinasObject[setorIndex].Maquinas[maquinaIndex].Categoria[
          categoriaIndex
        ];
      categoria.expandido = !categoria.expandido;
    },
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  text-decoration: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

body,
html {
  justify-content: center;
  display: flex;
  align-items: center;
  font-family: "Poppins", sans-serif;
  background-color: #e6f0fa; /* Fundo azul claro */
  padding: 20px;
  color: #333; /* Cor do texto */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 1200px;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

main {
  width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
}

.maquinas-list {
  cursor: pointer;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 18px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
}

.maquinas-list:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.categorias-list {
  padding: 18px;
  overflow: hidden;
  background-color: #f1f1f1;
  transition: max-height 0.7s ease, opacity 0.5s ease;
}

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

.categoria ul {
  padding: 10px;
  list-style-type: none;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.categoria ul li {
  padding: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.container-problema {
  position: relative;
  padding-right: 50px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.container-problema:hover {
  transform: translateY(-5px);
}

.container-problema li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #333;
}

.container-problema li::before {
  content: "🔧";
  margin-right: 10px;
  font-size: 18px;
}
</style>
