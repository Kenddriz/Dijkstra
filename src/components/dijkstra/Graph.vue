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
      :link-cb="lcb"
    />
    <svg>
      <defs>
        <marker
          id="m-end"
          markerWidth="10"
          markerHeight="10"
          refX="11"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L10,3 z"></path>
        </marker>
      </defs>
    </svg>
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
      node_object.fx = node_object.x;
      node_object.fy = node_object.y;
      setSelectedNode(node);
    }

    function handleClickEdges(event, edge_object) {
      const edge: Edge = {
        id: edge_object.id,
        sid: edge_object.sid,
        tid: edge_object.tid,
        name: edge_object.name
      };

      if (edge_object._color) edge._color = edge_object._color;

      setSelectedEdge(edge);
      arc.value = edge_object.name;
    }

    return {
      options,
      graph,
      handleClickNodes,
      handleClickEdges,
      lcb(link) {
        link._svgAttrs = {
          'marker-end': 'url(#m-end)'
        };
        return link;
      }
    };
  }
});
</script>

<style lang="css" src="vue-d3-network/dist/vue-d3-network.css"></style>
<style lang="css">
#m-end path,
#m-start {
  fill: blue;
}
</style>
