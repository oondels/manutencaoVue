<template>
  <input type="text" placeholder="Pesquisar Setor" />
  <input type="text" placeholder="Pesquisar Máquina" />
  <div class="main">
    <div
      class="setores-list"
      v-for="(setor, setorIndex) in maquinas"
      :key="setorIndex"
    >
      <h2>{{ setor.nome }}</h2>
      <div
        class="maquinas-list"
        v-for="(maquina, maquinaIndex) in setor.Maquinas"
        :key="maquinaIndex"
      >
        <h3 class="toggle-button">
          {{ maquina.nome }}
        </h3>
        <div class="categorias-list" v-if="maquina.Categoria">
          <div
            class="categoria"
            v-for="(categoria, categoriaIndex) in maquina.Categoria"
            :key="categoriaIndex"
          >
            <h4 class="toggle-button">
              {{ categoria.nome }}
            </h4>
            <ul class="problemas-list" v-if="categoria.Problemas">
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
</template>

<script>
export default {
  name: "ManualMaquinas",
  props: {
    maquinas: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style></style>
