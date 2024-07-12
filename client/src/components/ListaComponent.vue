<template>
    <h2>{{ meuNome }}</h2>
</template>

<script>
    export default {
        name: "ListaComponent",
        props: {
            meuNome: String,
        },
    }
</script>