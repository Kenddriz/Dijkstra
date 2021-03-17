import { Edge, Graph, Vertex } from 'components/compositions/types';

type DijkstraVertex = Vertex & {
  edges: Edge[];
  isSource: boolean;
  cost: number;
  previous: DijkstraVertex | null;
  marked: boolean;
  markedRound: number;
};

export const useShortestPath = () => {
  let vertices: Array<DijkstraVertex> = [];
  const INF = 500000;

  const setDijkstraVertices = (graph: Graph) => {
    vertices = [];
    graph.vertices.forEach(vertex => {
      vertices.push({
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
    //initialization
    const table: any = document.getElementById('dijkstraSteps');
    const markedVertices: DijkstraVertex[] = [];
    const source: DijkstraVertex | undefined = vertices.find(v => v.id === sId);
    let tr = 0,
      round = 1;
    table.innerHTML = '';
    table.setAttribute('border', 1);
    let row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = 'Round';


    //setVertexNeighbors();

    for (let i = 0; i < vertices.length; i++) {
      //interface begin
      cell = row.insertCell(i + 1);
      cell.innerHTML = vertices[i].name;
      /*if(vertices[i]==source)
        vertices[i].setAttribute("fill", startVertexColor);*/
    }

    if (source) source.cost = 0;

    //interface begin
    tr++;
    row = table.insertRow(tr);
    cell = row.insertCell(0);
    cell.innerHTML = round;
    for (let i = 0; i < vertices.length; i++) {
      cell = row.insertCell(i + 1);
      let html = vertices[i].cost == INF ? '∞' : vertices[i].cost;
      html += ', ' +
      (vertices[i].previous == null ? '-' : vertices[i].previous?.name);

      cell.innerHTML = html
    }
    // //interface end

    do {
      //find vertex with minimum cost
      let min = INF,
        m = 0;
      for (let i = 0; i < vertices.length; i++)
        if (vertices[i].cost < min && !vertices[i].marked) {
          m = i;
          min = vertices[m].cost;
        }

      vertices[m].marked = true;
      vertices[m].markedRound = round;
      markedVertices.push(vertices[m]);
      //relax edges
      for (let j = 0; j < vertices[m].edges.length; j++) {
        const neighborId =
          vertices[m].edges[j].sid == vertices[m].id
            ? vertices[m].edges[j].tid
            : vertices[m].edges[j].sid;
        const neighbor = vertices.find(v => v.id === neighborId);
        const edge = vertices[m].edges[j];
        if (neighbor)
          if (neighbor.cost > vertices[m].cost + edge.name) {
            neighbor.cost = vertices[m].cost + edge.name;
            neighbor.previous = vertices[m];
          }
      }

      //interface begin
      tr++;
      round++;
      if (markedVertices.length < vertices.length) {
        row = table.insertRow(tr);
        cell = row.insertCell(0);
        cell.innerHTML = round;

        for (let i = 0; i < vertices.length; i++) {
          cell = row.insertCell(i + 1);
          if (vertices[i].markedRound > round) {
            let html = vertices[i].cost == INF ? '∞' : vertices[i].cost;
            html +=
            ', ' +
            (vertices[i].previous == null ? '-' : vertices[i].previous?.name);

            cell.innerHTML = html;
          }
        }
      }

      //interface end
    } while (markedVertices.length < vertices.length);
  };

  const showShortestPath = (vertices: any) => {
    const table: any = document.getElementById('dijkstraSteps');
  };

  return {
    vertices,
    setDijkstraVertices,
    dijkstra,
    showShortestPath
  };
};
