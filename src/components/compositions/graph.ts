import { computed, reactive, ref } from '@vue/composition-api';
import { Edge, Graph, Options, Vertex } from 'components/compositions/types';

export const graph = reactive<Graph>({
  vertices: [],
  edges: [],
  nodeSize: 20
});

export const useDijkstra = () => {
  const options = computed<Options>(() => {
    return {
      force: 3000,
      size: { w: 800, h: 700 },
      nodeSize: graph.nodeSize,
      nodeLabels: true,
      linkLabels: true,
      canvas: false,
      fontSize: 15,
      strLinks: true
    };
  });

  const links = ref<number[]>([]);

  const edgeParams = reactive<{ edge: Edge; showDialog: boolean }>({
    edge: { sid: -1, tid: -1, name: 0, id: '' },
    showDialog: false
  });

  const addVertex = () => {
    let id = 0;
    for (let i = 0; i < graph.vertices.length; i++) {
      ++id;
      const index = graph.vertices.findIndex(vertex => vertex.id === i);
      if (index < 0) break;
    }
    const name = String.fromCharCode(65 + id);
    graph.vertices.push({ id: id, name: name });
  };

  const removeVertex = (vertexId: number) => {
    return;
  };

  const getVertices = (e: Vertex) => {
    links.value.push(e.id);
    let index = -1;
    if (links.value.length > 0)
      index = graph.edges.findIndex(
        edge =>
          (edge.sid === links.value[0] && edge.tid === e.id) ||
          (edge.sid === e.id && edge.tid === links.value[0])
      );

    if (index === -1)
      graph.vertices.forEach(vertice =>
        links.value.forEach(link => {
          if (link === vertice.id) vertice._color = 'orange';
        })
      );
  };

  const removeVertices = () => {
    graph.vertices.forEach(vertice => {
      delete vertice._color;
    });

    for (let i = 0; i <= links.value.length; i++) {
      links.value.pop();
    }
  };

  const addEdge = (e: Vertex) => {
    switch (links.value.length) {
      case 0:
        removeVertices();
        getVertices(e);
        break;
      case 1:
        /**Check if edge doesn't exist*/
        const index = graph.edges.findIndex(
          edge =>
            (edge.sid === links.value[0] && edge.tid === e.id) ||
            (edge.sid === e.id && edge.tid === links.value[0])
        );
        /**Avoid to add edge to the same vertex **/
        if (index < 0 && links.value[0] != e.id) {
          getVertices(e);
          graph.edges.push({
            id: 'link-' + String(graph.edges.length),
            sid: links.value[0],
            tid: e.id,
            name: 1
          });
        }

        break;
      case 2:
        removeVertices();
        getVertices(e);
        break;
    }
  };

  const removeEdge = () => {
    const index = graph.edges.findIndex(
      e => e.sid === edgeParams.edge.sid && e.tid === edgeParams.edge.tid
    );
    graph.edges.splice(index, 1);
    /**Links' id must be uniq,so update each id*/
    graph.edges = graph.edges.map((edge, index) => {
      edge.id = 'link-' + String(index);
      return edge;
    });
    edgeParams.showDialog = false;
  };

  const updateEdge = (name: number) => {
    const index = graph.edges.findIndex(
      e => e.sid === edgeParams.edge.sid && e.tid === edgeParams.edge.tid
    );
    graph.edges[index].name = name;
    edgeParams.showDialog = false;
  };

  return {
    graph,
    options,
    edgeParams,
    addVertex,
    removeVertex,
    addEdge,
    removeEdge,
    updateEdge,
    links
  };
};
