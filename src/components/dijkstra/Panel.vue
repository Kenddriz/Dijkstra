<template>
  <div>
    <q-card style="max-height: 350px; width: 100%">
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
            graph.selectedEdge == null || arc == ''
              ? 'Coût du nouvel arc'
              : 'Ajuster coût de l\'arc'
          "
        />
      </q-card-section>

      <q-separator />

      <q-card-actions class="flex justify-center">
        <q-btn-group push class="full-width q-ma-sm">
          <q-btn
            dense
            :disable="graph.selectedEdge != null"
            push
            icon="add_box"
            text-color="black"
            label="Sommet"
            @click="handleAddNode"
            class="full-width"
          />
          <q-separator vertical />
          <q-btn
            dense
            :disable="graph.selectedNodes.length < 2 && !graph.selectedEdge"
            class=" full-width"
            push
            :icon="!graph.selectedEdge ? 'add_box' : 'border_color'"
            text-color="black"
            label="Arc"
            @click="
              () => (!graph.selectedEdge ? handleAddEdge() : handleUpdateEdge())
            "
          />
        </q-btn-group>

        <q-space />

        <q-btn-group push class="full-width  q-ma-sm">
          <q-btn
            dense
            :disable="graph.selectedEdge == null"
            class="full-width"
            push
            @click="handleRemoveEdge"
            label="Supprimer ARC"
          />
          <q-separator vertical />
          <q-btn
            v-if="getLastNode"
            dense
            :disable="!getLastNode"
            class="full-width"
            push
            @click="handleRemoveNode"
            :label="'Supprimer Sommet: ' + getLastNode.name"
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
import { computed, defineComponent } from '@vue/composition-api';
import { useGraph } from './useGraph';
import { param, arc } from './panel';
import { useDijkstra } from './useDijkstra';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'Panel',
  setup(_, { root: { $q } }) {
    const {
      graph,
      addNodes,
      addEdge,
      updateAdge,
      removeEdge,
      removeNode,
      getLastNode
    } = useGraph();
    const { setDijkstraNodes, dijkstra } = useDijkstra();

    function handleAddNode() {
      addNodes();
      arc.value = 1;
    }

    function handleAddEdge() {
      addEdge(arc.value as number);
      arc.value = 1;
    }

    function handleUpdateEdge() {
      updateAdge(arc.value as number);
      arc.value = 1;
    }

    function handleRemoveEdge() {
      removeEdge();
      graph.selectedEdge = null;
      graph.selectedNodes = [];
    }

    function handleRemoveNode() {
      const isRemoved = removeNode();
      if (isRemoved) {
        graph.selectedEdge = null;
        graph.selectedNodes = [];
      } else {
        $q.notify({
          message: "Ce sommet est lien à d'autre sommet.",
          type: 'warning',
          position: 'bottom'
        });
      }
    }

    return {
      arc,
      handleAddNode,
      handleAddEdge,
      handleUpdateEdge,
      param,
      graph,
      addNodes,
      addEdge,
      updateAdge,
      setDijkstraNodes,
      dijkstra,
      handleRemoveEdge,
      handleRemoveNode,
      getLastNode
    };
  }
});
</script>

<style lang="css" src="vue-d3-network/dist/vue-d3-network.css"></style>
