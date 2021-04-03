import { Nodes, Edge, Graph } from './useGraph.type';
import {qTable} from './table'
import { useGraph } from './useGraph';

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
    const {
      getLastNode
    } = useGraph();
    //initialization
    const markednodes: DijkstraVertex[] = [];
    const source: DijkstraVertex | undefined = nodes.find(v => v.id === sId);
    let round = 1;
    qTable.columns = [];
    // qTable.columns.push({name: 'round', label: 'Round'})


    //setVertexNeighbors();

    for (let i = 0; i < nodes.length; i++) {
      //interface begin
      qTable.columns.push({name: nodes[i].name, label: nodes[i].name})
    }

    if (source) source.cost = 0;

    //interface begin
    qTable.data = [];
    let dataRow = { round }
    for (let i = 0; i < nodes.length; i++) {
      let html = nodes[i].cost == INF ? '∞' : nodes[i].cost;
      html += ', ' +
      (nodes[i].previous == null ? '-' : nodes[i].previous?.name);
      dataRow[nodes[i].name] = html
    }

    qTable.data.push(dataRow)

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
            // neighbor.cost = parseInt(nodes[m].cost.toString()) + parseInt(edge.name.toString());
            neighbor.cost = Number(nodes[m].cost) + Number(edge.name);
            // const x =  Number(edge.name);
            // neighbor.cost = nodes[m].cost + x;
            console.log(nodes[m].cost, edge.name)

            neighbor.previous = nodes[m];
          }
      }

      //interface begin
      round++;
      dataRow = { round }
      if (markednodes.length < nodes.length) {

        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].markedRound > round) {
            let html = nodes[i].cost == INF ? '∞' : nodes[i].cost;
            html +=
            ', ' +
            (nodes[i].previous == null ? '-' : nodes[i].previous?.name);

            dataRow[nodes[i].name] = html
          }
        }
        qTable.data.push(dataRow)
      }

      //interface end
    } while (markednodes.length < nodes.length);

    let qTableResult = ['']

    // console.log({dataRow: qTable.data.reverse()})

    // qTable.data[getLastNode.value.name]
    const lastNameAsii = getLastNode.value.name.charCodeAt(0)
    const firstNameAscii = "A".charCodeAt(0)

    // qTable.data = qTable.data.filter(nodes => {
    //   const nodesKeys = Object.keys(nodes).filter(i => i != 'round')

    //   const find = nodesKeys.find(i => i == getLastNode.value.name)
    //   return find ? true : false

    // });



    const dataTable = [...qTable.data.reverse()]
    qTable.data.reverse()
    const dataTablelength = dataTable.length
    dataTable.forEach(nodes => {
        const nodesKeys = Object.keys(nodes).filter(i => i != 'round').reverse()
        console.log(nodesKeys)
      });


  };

  return {
    nodes,
    setDijkstraNodes,
    dijkstra
  };
};
