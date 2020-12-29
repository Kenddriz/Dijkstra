<template>
  <div>
    <div>
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

      <div class="q-pa-md">
        <div class="text-h5">Mode de travail</div>
        <div class="q-gutter-sm">
          <q-radio
            v-model="vertexParams"
            keep-color
            val="connexion"
            label="Relier des sommets"
            color="primary"
          />
          <q-radio
            v-model="vertexParams"
            keep-color
            val="update"
            label="Paramétrage d'un sommet"
            color="primary"
          />
        </div>
        <q-separator />
      </div>

      <q-btn
        outline
        icon="add_box"
        color="black"
        class="full-width"
        label="Ajouter un sommet"
        @click="addVertex"
      />

      <!--<label>Render as  </label>
        <input type="radio" :value="false" v-model="canvas" />
        <label>SVG</label>
        <input type="radio" :value="true" v-model="canvas" />
        <label>Canvas</label>-->
      <dialog-params
        :edge="edgeParams.edge"
        :show-dialog="edgeParams.showDialog"
        :remove="
          () => {
            removeEdge();
          }
        "
        submit-function-name="update-selected-edge"
        @update-selected-edge="
          cost => {
            updateEdge(cost);
          }
        "
        :cancel="
          () => {
            edgeParams.showDialog = false;
          }
        "
      />
    </div>

    <d3-network
      ref="net"
      class="bg-grey-3"
      :net-nodes="graph.vertices"
      :net-links="graph.edges"
      :options="options"
      @node-click="handleClickNodes"
      @link-click="
        (event, link_object) => {
          edgeParams.edge = link_object;
          edgeParams.showDialog = true;
        }
      "
    />

    <q-btn
      @click="
        () => {
          setDijkstraVertices(JSON.parse(JSON.stringify(graph)));
          dijkstra(0);
        }
      "
      label="show_graph"
    />
    <table id="dijkstraSteps"></table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useDijkstra } from './compositions/graph';
import { useShortestPath } from 'components/compositions/dijkstra/shortest-path';
import DialogParams from 'components/DialogParams.vue';

export default defineComponent({
  name: 'D3NetworkDijkstra',
  components: {
    D3Network: require('vue-d3-network'),
    DialogParams
  },
  setup() {
    const vertexParams = ref<string>('connexion');
    const {
      graph,
      options,
      edgeParams,
      addVertex,
      removeVertex,
      addEdge,
      removeEdge,
      updateEdge,
      links
    } = useDijkstra();

    function handleClickNodes(event, node_object) {
      console.log(links.value);
      if (vertexParams.value === 'connexion') addEdge(node_object);
    }

    return {
      handleClickNodes,
      //useDijkstra
      vertexParams,
      graph,
      options,
      edgeParams,
      addVertex,
      removeVertex,
      addEdge,
      removeEdge,
      updateEdge,
      ...useShortestPath()
    };
  },
  data() {
    return {
      edgeParams: {
        edge: { sid: -1, tid: -1, name: 1 },
        showDialog: false
      }
    };
  }
});
</script>

<style lang="css" src="vue-d3-network/dist/vue-d3-network.css"></style>
