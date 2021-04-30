<template>
  <div class="q-pa-md">
    <q-table
      title="Traitement par l'algorithme de dijkstra"
      :data="qTable.dataShow"
      :columns="columns"
      row-key="name"
      no-data-label="Ajouter des sommets pour commencer"
      class=" full-width"
      style=" min-height: 200px"
      separator="cell"
      hide-bottom
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(c, key) in props.cols" :key="key">{{ c.value }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  watch
} from '@vue/composition-api';
import { useGraph } from './useGraph';
import { qTable } from './table';

export default defineComponent({
  name: 'Table',
  data: () => {
    return {};
  },
  setup: () => {
    const { graph } = useGraph();

    const columns = computed(() => {
      const col = graph.nodes.map(node => {
        const col = { name: node.name, label: node.name, field: node.name };
        return col;
      });

      if (graph.nodes.length > 0)
        col.unshift({ name: 'round', label: 'Round', field: 'round' });
      return col;
    });

    watch(
      () => qTable.data,
      val => console.log({ val })
    );

    return {
      qTable,
      graph,
      columns
    };
  }
});
</script>
