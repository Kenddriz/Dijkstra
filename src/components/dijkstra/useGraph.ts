import { computed, reactive } from '@vue/composition-api';
import { cloneDeep } from 'lodash';
import { Edge, Graph, Nodes, Options } from './useGraph.type';

export const graph = reactive<Graph>({
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdge: null,
  edgeIsAddable: false,
  nodeSize: 20,
  edgeSize: 4
});

export const useGraph = () => {
  const options = computed<Options>(() => {
    return {
      force: 3000,
      size: { w: 1000, h: 500 },
      nodeSize: graph.nodeSize,
      nodeLabels: true,
      linkLabels: true,
      canvas: false,
      fontSize: 15,
      strLinks: true,
      linkWidth: 5
    };
  });

  function initSelections(node = false, edge = false) {
    if (node) {
      graph.selectedNodes = [];

      graph.nodes = graph.nodes.map(node => {
        node._color = '';
        return node;
      });
    }

    if (edge) {
      graph.selectedEdge = null;

      graph.edges = graph.edges.map(edge => {
        edge._color = '';
        return edge;
      });
    }
  }

  function addNodes() {
    let id = 0;
    for (let i = 0; i < graph.nodes.length; i++) {
      ++id;
      const index = graph.nodes.findIndex(vertex => vertex.id === i);
      if (index < 0) break;
    }
    const name = String.fromCharCode(65 + id);
    graph.nodes.push({ id: id, name: name });
  }

  function setSelectedNode(e: Nodes) {
    const length = graph.selectedNodes.length;
    const find = graph.selectedNodes.find(node => node.id == e.id) || null;

    switch (true) {
      case length == 0:
        graph.selectedNodes.push(e);
        break;
      case length == 1 && find == null:
        const edgeIsExist =
          graph.edges.find(
            edge =>
              (edge.sid == graph.selectedNodes[0].id && edge.tid == e.id) ||
              (edge.tid == graph.selectedNodes[0].id && edge.sid == e.id)
          ) || null;

        if (!edgeIsExist) graph.selectedNodes.push(e);
        break;
      case length <= 2 && find != null:
        graph.selectedNodes = graph.selectedNodes.filter(
          node => node.id != find?.id
        );
        break;
      case length == 2 && find == null:
        graph.selectedNodes.pop();
        graph.selectedNodes.push(e);
        break;
    }

    graph.nodes = graph.nodes.map(node => {
      node._color = '';
      return node;
    });

    graph.selectedNodes.forEach(selectedNode => {
      graph.nodes = graph.nodes.map(node => {
        if (node.id == selectedNode.id) {
          node._color = 'orange';
        }
        return node;
      });
    });

    // graph.selectedEdge = null;

    // graph.edges = graph.edges.map(edge => {
    //   edge._color = ''
    //   return edge
    // })

    initSelections(false, true);
  }

  function setSelectedEdge(e: Edge) {
    graph.selectedEdge = e;

    graph.edges = graph.edges.map(edge => {
      edge._color = '';
      return edge;
    });

    graph.edges = graph.edges.map(edge => {
      if (edge.id == e.id) edge._color = 'orange';
      return edge;
    });

    // graph.selectedNodes = []

    // graph.nodes = graph.nodes.map(node => {
    //   node._color = ''
    //   return node
    // })

    initSelections(true, false);
  }

  function addEdge(arcValue = 1) {
    const edgeLength = graph.edges.length;

    if (graph.selectedNodes.length == 2) {
      graph.edges.push({
        id: edgeLength.toString(),
        sid: graph.selectedNodes[0].id,
        tid: graph.selectedNodes[1].id,
        name: arcValue,
        _color: ''
      });

      //   graph.selectedNodes = []

      // graph.nodes = graph.nodes.map(node => {
      //   node._color = ''
      //   return node
      // })
      initSelections(true, true);
    }
  }

  function updateAdge(name: number) {
    if (graph.selectedEdge != null) {
      graph.edges.map(edge => {
        if (edge.id == graph.selectedEdge?.id) {
          edge.name = name;
        }

        return edge;
      });

      initSelections(true, true);
    }
  }

  function removeEdge() {
    if (graph.selectedEdge) {
      const index = graph.edges.findIndex(
        i =>
          i.sid == graph.selectedEdge?.sid && i.tid == graph.selectedEdge?.tid
      );

      graph.edges.splice(index, 1);

      graph.edges = graph.edges.map((edge, index) => {
        edge.id = index.toString();
        return edge;
      });
    }
    console.log({ graph });
  }

  const getLastNode = computed(
    () =>
      graph.nodes[
        graph.nodes.length > 0 ? graph.nodes.length - 1 : graph.nodes.length
      ]
  );

  function removeNode(): boolean {
    let isLinked = true;

    if (getLastNode.value) {
      isLinked =
        graph.edges.filter(
          i => i.sid == getLastNode.value.id || i.tid == getLastNode.value.id
        ).length > 0;
      console.log({ isLinked });
      if (!isLinked) {
        // bola ts vita ##################
        graph.nodes = graph.nodes.filter(n => n.id != getLastNode.value.id);
      }
    }

    return !isLinked;
  }

  return {
    options,
    graph,
    addNodes,
    setSelectedNode,
    addEdge,
    updateAdge,
    setSelectedEdge,
    removeEdge,
    removeNode,
    getLastNode
  };
};
