<template>
  <q-page class=" flex row ">
    <Panel class="row" style="width: 20%; padding: 10px; " />
    <D3NetworkDijkstra style="width: 50%" />
    <Table style="width: 30%" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Panel from '../components/dijkstra/Panel.vue';
import D3NetworkDijkstra from '../components/dijkstra/Graph.vue';
import Table from '../components/dijkstra/Table.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { Panel, D3NetworkDijkstra, Table }
});
</script>
