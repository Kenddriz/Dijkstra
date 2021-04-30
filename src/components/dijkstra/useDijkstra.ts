import { Nodes, Edge, Graph } from './useGraph.type';
import { qTable } from './table';
import { useGraph, graph } from './useGraph';
import { ref } from '@vue/composition-api';

type DijkstraVertex = Nodes & {
  edges: Edge[];
  isSource: boolean;
  cost: number;
  previous: DijkstraVertex | null;
  marked: boolean;
  markedRound: number;
};

export const useDijkstra = () => {
  let nodes: Array<DijkstraVertex> = [];
  const INF = 500000;
  const nodesList = ref([]);

  const setDijkstraNodes = (graph: Graph) => {
    nodes = [];
    graph.nodes.forEach(vertex => {
      nodes.push({
        id: vertex.id,
        name: vertex.name,
        edges: graph.edges.filter(
          edge => edge.sid === vertex.id || edge.tid === vertex.id
        ),
        isSource: false,
        cost: INF,
        previous: null,
        marked: false,
        markedRound: INF
      });
    });
  };

  const dijkstra = (sId: number) => {
    const { getLastNode } = useGraph();
    //initialization
    const markednodes: DijkstraVertex[] = [];
    const source: DijkstraVertex | undefined = nodes.find(v => v.id === sId);
    let round = 1;
    qTable.columns = [];
    // qTable.columns.push({name: 'round', label: 'Round'})

    //setVertexNeighbors();

    for (let i = 0; i < nodes.length; i++) {
      //interface begin
      qTable.columns.push({ name: nodes[i].name, label: nodes[i].name });
    }

    if (source) source.cost = 0;

    //interface begin
    qTable.data = [];
    let dataRow = { round };
    for (let i = 0; i < nodes.length; i++) {
      let html = nodes[i].cost == INF ? '∞' : nodes[i].cost;
      html +=
        ', ' + (nodes[i].previous == null ? '-' : nodes[i].previous?.name);
      dataRow[nodes[i].name] = html;
    }

    qTable.data.push(dataRow);

    // //interface end

    do {
      //find vertex with minimum cost
      let min = INF,
        m = 0;
      for (let i = 0; i < nodes.length; i++)
        if (nodes[i].cost < min && !nodes[i].marked) {
          m = i;
          min = nodes[m].cost;
        }

      nodes[m].marked = true;
      nodes[m].markedRound = round;
      markednodes.push(nodes[m]);
      //relax edges
      for (let j = 0; j < nodes[m].edges.length; j++) {
        const neighborId =
          nodes[m].edges[j].sid == nodes[m].id
            ? nodes[m].edges[j].tid
            : nodes[m].edges[j].sid;
        const neighbor = nodes.find(v => v.id === neighborId);
        const edge = nodes[m].edges[j];
        if (neighbor)
          if (neighbor.cost > nodes[m].cost + edge.name) {
            const cost =
              parseInt(nodes[m].cost.toString()) +
              parseInt(edge.name.toString());
            neighbor.cost = cost;

            // neighbor.cost = nodes[m].cost +  edge.name;

            neighbor.previous = nodes[m];
          }
      }

      //interface begin
      round++;
      dataRow = { round };
      if (markednodes.length < nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].markedRound > round) {
            let html = nodes[i].cost == INF ? '∞' : nodes[i].cost;
            html +=
              ', ' +
              (nodes[i].previous == null ? '-' : nodes[i].previous?.name);

            dataRow[nodes[i].name] = html;
          }
        }
        qTable.data.push(dataRow);
      }

      //interface end
    } while (markednodes.length < nodes.length);

    let column = getLastNode.value.name;
    let dist = 0;

    qTable.data.forEach(e => {
      const lastColumn: Array<string> = qTable.data
        .filter(data => data[column.trim()])
        .map(data => data[column.trim()]);
      let colVal = 0;
      nodesList.value.push(column.trim() as never);

      lastColumn.forEach(row => {
        const left = row.split(',')[0],
          right = row.split(',')[1];

        if (
          left != '∞' &&
          right.trim() != '-' &&
          (parseInt(left) < colVal || colVal == 0)
        ) {
          colVal = Number(left);
          column = right;
        }
      });
      dist += colVal;
    });

    // for (let i = 0; i < nodesList.value.length - 1; i++) {
    //   console.log(nodesList.value.slice(i, i + 2));

    //   graph.nodes.filter(n => n.name == nodesList.value.slice(i, i + 2)[0])[0]
    //     .id;

    //   const id1 = graph.nodes.filter(
    //     n => n.name == nodesList.value.slice(i, i + 2)[0]
    //   )[0].id;
    //   const id2 = graph.nodes.filter(
    //     n => n.name == nodesList.value.slice(i, i + 2)[1]
    //   )[0].id;

    //   graph.edges = graph.edges.map(e => {
    //     if ((e.sid == id1 && e.tid == id2) || (e.sid == id2 && e.tid == id1)) {
    //       e._color = 'red';
    //     }
    //     return e;
    //   });
    // }
  };

  function responseColore() {
    for (let i = 0; i < nodesList.value.length - 1; i++) {
      console.log(nodesList.value.slice(i, i + 2));

      graph.nodes.filter(n => n.name == nodesList.value.slice(i, i + 2)[0])[0]
        .id;

      const id1 = graph.nodes.filter(
        n => n.name == nodesList.value.slice(i, i + 2)[0]
      )[0].id;

      const id2 = graph.nodes.filter(
        n => n.name == nodesList.value.slice(i, i + 2)[1]
      )[0].id;

      graph.edges = graph.edges.map(e => {
        if ((e.sid == id1 && e.tid == id2) || (e.sid == id2 && e.tid == id1)) {
          e._color = 'red';
        }
        return e;
      });
    }
  }

  function initEdgeColor() {
    graph.edges = graph.edges.map(e => {
      e._color = '';
      return e;
    });
  }

  return {
    nodes,
    setDijkstraNodes,
    dijkstra,
    responseColore,
    initEdgeColor
  };
};
