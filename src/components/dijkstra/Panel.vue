<template>
  <div>
    <q-card style="max-height: 300px; width: 100%">
      <q-card-section>
        <label> Node size </label>
        <q-slider
          v-model="graph.nodeSize"
          :min="1"
          :max="25"
          :step="1"
          label
          label-always
          color="light-green"
        />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <label v-if="graph.selectedEdge != null"> Mise à jour arc </label>
        <label v-else> Ajout arc </label>

        <q-input
          :disable="graph.selectedNodes.length < 2 && !graph.selectedEdge"
          dense
          type="number"
          outlined
          v-model="arc"
          :label="
            graph.selectedEdge == null
              ? 'Coût du nouvel arc'
              : 'Ajuster coût de l\'arc'
          "
        />
      </q-card-section>

      <q-separator />

      <q-card-actions class="flex justify-center">
        <q-btn-group push class=" full-width">
          <q-btn
            dense
            :disable="graph.selectedEdge != null"
            push
            icon="add_box"
            text-color="black"
            label="Sommet"
            @click="addNodes"
            class=" full-width"
          />
          <q-separator vertical />
          <q-btn
            dense
            :disable="graph.selectedNodes.length < 2"
            class=" full-width"
            push
            :icon="!graph.selectedEdge ? 'add_box' : 'border_color'"
            text-color="black"
            label="Arc"
            @click="
              () => (!graph.selectedEdge ? addEdge(arc) : updateAdge(arc))
            "
          />
        </q-btn-group>
        <q-btn
          :disable="graph.edges.length <= 0"
          @click="
            () => {
              setDijkstraNodes(JSON.parse(JSON.stringify(graph)));
              dijkstra(0);
            }
          "
          label="show_graph"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useGraph } from './useGraph';
import { param, arc } from './pabel';
import { useDijkstra } from './useDijkstra';

export default defineComponent({
  name: 'Panel',
  setup() {
    const { graph, addNodes, addEdge, updateAdge } = useGraph();
    const { setDijkstraNodes, dijkstra } = useDijkstra();

    return {
      arc,
      param,
      graph,
      addNodes,
      addEdge,
      updateAdge,
      setDijkstraNodes,
      dijkstra
    };
  }
});
</script>

<style lang="css" src="vue-d3-network/dist/vue-d3-network.css"></style>
