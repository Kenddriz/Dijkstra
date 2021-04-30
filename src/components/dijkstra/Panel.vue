<template>
  <div>
    <q-card style="max-height: 360px; width: 100%">
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
            no-caps
            @click="handleAddNode"
            class="full-width"
          />
          <q-separator vertical />
          <q-btn
            dense
            no-caps
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
            no-caps
            label="Supprimer ARC"
          />
          <q-separator vertical />
          <q-btn
            v-if="getLastNode"
            no
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
          @click="handleResoudre"
          no-caps
          label="Résoudre"
        />

        <q-btn-group push class="full-width  q-ma-sm">
          <q-btn
            dense
            :disable="qTable.dataShow.length === 0 || qTable.data.length === 0"
            class="full-width"
            push
            @click="handlePrecedant"
            no-caps
            label="Précédant"
          />
          <q-separator vertical />
          <q-btn
            no
            dense
            :disable="
              qTable.data.length === qTable.dataShow.length ||
                qTable.data.length === 0
            "
            class="full-width"
            push
            @click="handleSuivant"
            label="Suivant"
          />
          <q-separator vertical />
          <q-btn
            no
            dense
            :disable="
              qTable.data.length !== qTable.dataShow.length ||
                qTable.data.length === 0
            "
            class="full-width"
            push
            @click="handleDessiner"
            label="Dessiner chemain"
          />
        </q-btn-group>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { useGraph } from './useGraph';
import { param, arc } from './panel';
import { useDijkstra } from './useDijkstra';
import { qTable } from './table';
import { cloneDeep } from 'lodash';

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
    const {
      setDijkstraNodes,
      dijkstra,
      responseColore,
      initEdgeColor
    } = useDijkstra();

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
          message: "Ce sommet est liée à d'autre(s) sommet.",
          type: 'warning',
          position: 'bottom'
        });
      }
    }

    function handleResoudre() {
      setDijkstraNodes(JSON.parse(JSON.stringify(graph)));
      dijkstra(0);
      initEdgeColor();
      qTable.dataShow = [];
    }

    function handleSuivant() {
      qTable.dataShow.push(cloneDeep(qTable.data[qTable.dataShow.length]));
    }

    function handlePrecedant() {
      qTable.dataShow.pop();
      initEdgeColor();
    }

    function handleDessiner() {
      responseColore();
      let i = qTable.columns.length - 1;
      let col = new Array(i);

      for (i; i >= 0; i--) {
        qTable.dataShow.forEach(d => {
          // col[i] = d  String.fromCharCode(65)
          let colVal = d[String.fromCharCode(65 + i)];

          if (colVal) {
            if (colVal.split(',')[0].trim() !== '∞') {
              col[i] = col[i]
                ? parseInt(col[i]) <= parseInt(colVal.split(',')[0].trim())
                  ? colVal
                  : col[i]
                : colVal;
              // console.log(col[i]);
            }
          }

          // console.log({ d: d[String.fromCharCode(65 + i)] });
        });
      }
      console.log(col);
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
      getLastNode,
      qTable,
      responseColore,
      handleResoudre,
      handleSuivant,
      handlePrecedant,
      handleDessiner
    };
  }
});
</script>

<style lang="css" src="vue-d3-network/dist/vue-d3-network.css"></style>
