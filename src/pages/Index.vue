<template>
  <q-page class="row items-center justify-evenly">
    <d3-network-dijkstra />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import D3NetworkDijkstra from "components/D3NetworkDijkstra.vue";

export default defineComponent({
  name: 'PageIndex',
  components: { D3NetworkDijkstra }
});
</script>
