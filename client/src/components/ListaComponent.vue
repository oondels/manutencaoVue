<template>
  <div>
    <div v-for="(setor, setorIndex) in maquinas" :key="setorIndex">
      <h2>{{ setor.nome }}</h2>
      <div
        v-for="(maquina, maquinaIndex) in setor.Maquinas"
        :key="maquinaIndex"
      >
        <h3>{{ maquina.nome }}</h3>
        <div v-if="maquina.Categoria">
          <div
            v-for="(categoria, categoriaIndex) in maquina.Categoria"
            :key="categoriaIndex"
          >
            <h4>{{ categoria.nome }}</h4>
            <div v-if="categoria.Problemas">
              <ul
                v-for="(problema, problemaIndex) in categoria.Problemas"
                :key="problemaIndex"
              >
                <li>{{ problema.descricao }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListaComponent",
  props: {
    maquinas: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style></style>
