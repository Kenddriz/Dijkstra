<template>
  <div>
    <q-card style="max-height: 600px; width: 100%">
      <q-card-section>
        <label class=" full-width text-center">
          Sauvegarde: {{ saveLabel }}
        </label>
        <q-btn-group push class="full-width  q-ma-sm">
          <q-btn
            no
            dense
            class="full-width"
            no-caps
            push
            @click="() => btnSave('save1')"
            label="Enregistrement 1"
          />
          <q-separator vertical />
          <q-btn
            dense
            class="full-width"
            push
            @click="() => btnLoad('save1')"
            no-caps
            label="Charger 1"
          />
        </q-btn-group>

        <q-btn-group push class="full-width  q-ma-sm">
          <q-btn
            no
            dense
            class="full-width"
            no-caps
            push
            @click="() => btnSave('save2')"
            label="Enregistrement 2"
          />
          <q-separator vertical />
          <q-btn
            dense
            class="full-width"
            push
            @click="() => btnLoad('save2')"
            no-caps
            label="Charger 2"
          />
        </q-btn-group>

        <q-btn-group push class="full-width  q-ma-sm">
          <q-btn
            no
            dense
            class="full-width"
            no-caps
            push
            @click="() => btnSave('save3')"
            label="Enregistrement 3"
          />
          <q-separator vertical />
          <q-btn
            dense
            class="full-width"
            push
            @click="() => btnLoad('save3')"
            no-caps
            label="Charger 3"
          />
        </q-btn-group>

        <q-separator class=" full-width" spaced color="grey" />
        <label> Taille des noeuds </label>
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
            no-caps
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
        <!-- btn etape -->
        <q-separator class=" full-width" spaced color="grey" />
        <label class=" full-width text-center"> Etapes de résolution </label>

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
            no-caps
            push
            @click="handleSuivant"
            label="Suivant"
          />
          <q-separator vertical />
          <q-btn
            dense
            :disable="
              qTable.data.length !== qTable.dataShow.length ||
                qTable.data.length === 0
            "
            class="full-width"
            push
            @click="handleDessiner"
            no-caps
            label="Chemin"
          />
        </q-btn-group>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useGraph } from './useGraph';
import { param, arc } from './panel';
import { useDijkstra } from './useDijkstra';
import { qTable } from './table';
import { cloneDeep } from 'lodash';
import { Graph } from './useGraph.type';

export default defineComponent({
  name: 'Panel',
  setup(_, { root: { $q } }) {
    const saveLabel = ref('');
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
      let data = cloneDeep(qTable.data[qTable.dataShow.length]);

      qTable.dataShow.push(data);
    }

    function handlePrecedant() {
      qTable.dataShow.pop();
      initEdgeColor();
    }

    function handleDessiner() {
      responseColore();
    }

    function btnSave(label: string) {
      localStorage.setItem(label, JSON.stringify(graph));
      saveLabel.value = label;
    }

    function btnLoad(label: string) {
      if (localStorage.getItem(label)) {
        Object.assign(graph, JSON.parse(localStorage.getItem(label) as string));
        saveLabel.value = label;
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
      getLastNode,
      qTable,
      responseColore,
      handleResoudre,
      handleSuivant,
      handlePrecedant,
      handleDessiner,
      btnSave,
      btnLoad,
      saveLabel
    };
  }
});
</script>

<style lang="css" src="vue-d3-network/dist/vue-d3-network.css"></style>
