<template>
  <div>
    <d3-network
      ref="net"
      class="bg-grey-3"
      :net-nodes="graph.nodes"
      :net-links="graph.edges"
      :options="options"
      @node-click="handleClickNodes"
      @link-click="handleClickEdges"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useGraph } from './useGraph';
import { Nodes } from './useGraph.type';
import { arc } from './panel';
import { Edge } from './useGraph.type';

export default defineComponent({
  name: 'D3NetworkDijkstra',
  components: {
    D3Network: require('vue-d3-network')
  },
  setup() {
    const { options, graph, setSelectedEdge, setSelectedNode } = useGraph();

    function handleClickNodes(event, node_object) {
      const node: Nodes = { id: node_object.id, name: node_object.name };
      setSelectedNode(node);
    }

    function handleClickEdges(event, node_object) {
      const edge: Edge = {
        id: node_object.id,
        sid: node_object.sid,
        tid: node_object.tid,
        name: node_object.name
      };

      if (node_object._color) edge._color = node_object._color;

      setSelectedEdge(edge);
      arc.value = node_object.name;
    }

    return {
      options,
      graph,
      handleClickNodes,
      handleClickEdges
    };
  }
});
</script>

<style lang="css" src="vue-d3-network/dist/vue-d3-network.css"></style>
