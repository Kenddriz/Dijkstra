import { Nodes, Edge, Graph } from './useGraph.type';
import { qTable } from './table';
import { useGraph, graph } from './useGraph';
import { ref, reactive } from '@vue/composition-api';
import { cloneDeep } from 'lodash';

type DijkstraVertex = Nodes & {
  edges: Edge[];
  isSource: boolean;
  previous: DijkstraVertex | null;
  marked: boolean;
  markedRound: number;
};

export const useDijkstra = () => {
  let nodes: Array<DijkstraVertex> = [];
  const INF = Infinity;
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

  let markednodes: { [a: string]: string | null }[] = [{}];
  let checkedName: any = [];
  const round = ref(1);
  // let dataRow = reactive({ round });

  function findMinCostNodes(nodes: DijkstraVertex[]) {
    let cost = INF;
    let minNode_index = 0;

    nodes.forEach((n, index) => {
      if (!n.marked) {
        const newCost = n.cost < cost ? n.cost : cost;
        // console.log({ round: round.value, cost: n.cost, name: n.name });

        minNode_index =
          newCost !== INF && newCost !== cost ? index : minNode_index;

        cost = newCost;

        markednodes.filter(mn => {
          const markedCost = mn[n.name]?.split(', ')[0];

          if (markedCost != '∞' && Number(markedCost) < newCost) {
            minNode_index = index;
            cost = Number(markedCost);
            n.cost = cost;
          }
        });
      }
    });

    return nodes[minNode_index];
  }

  function doDijkstra(startVertex: DijkstraVertex) {
    for (const node of nodes) {
      const from = startVertex.name;

      markednodes[round.value - 1] = {};
      markednodes[round.value - 1]['round'] = round.value.toString();

      nodes.forEach(n => {
        markednodes[round.value - 1][n.name] = '∞, -';
        if (round.value <= 1 && startVertex.name === n.name)
          markednodes[round.value - 1][startVertex.name] = '0';

        if (round.value > 0 && checkedName.find(c => c === n.name))
          markednodes[round.value - 1][n.name] = 'X';
      });

      if (round.value > 1) {
        nodes.forEach(n => {
          if (n.name === from && !checkedName.find(c => c === n.name)) {
            const from_keyValue = markednodes.filter(mn => {
              return Object.keys(mn).find(k => k === n.name) === n.name;
            });

            let min: number | string = INF;
            let prev_from = '$';

            // console.log({ from_keyValue, round: round.value });

            from_keyValue.forEach(f => {
              let path: number | string = (f[n.name] as string).split(',')[0];
              // console.log('++++', { name: n, round: round.value });
              if (path != '∞') {
                path = Number((f[from] as string).split(',')[0]);

                // min = min === INF ? path : min > path ? path : min;

                if (min === INF || min > path) {
                  min = path;
                  prev_from = (f[from] as string).split(',')[1];
                }

                // prev_from = (f[from] as string).split(',')[1];
              }
            });

            markednodes[round.value - 1][from] = min + ', ' + prev_from;
          }
        });
      } else {
        nodes.forEach(n => {
          startVertex.edges.forEach(e => {
            if (Number(e.tid) === Number(n.id)) {
              markednodes[round.value - 1][n.name] = e.name + ', ' + from;
            }
          });
        });
      }
      // console.log({ edges, round: round.value });

      startVertex.edges.forEach(e => {
        if (!e.marked && Number(e.tid) !== Number(startVertex.id)) {
          const cost = Number(e.name) + Number(startVertex.cost);

          const nextNode = nodes.find(
            n => Number(n.id) === Number(e.tid)
          ) as DijkstraVertex;

          nextNode.cost = cost;

          if (!nextNode.marked)
            markednodes[round.value - 1][nextNode.name] = cost + ', ' + from;
        }
      });

      const minN = findMinCostNodes(nodes);

      minN.marked = true;

      if (!checkedName.find(c => c === from)) checkedName.push(from);
      startVertex = minN;
      round.value++;
    }
  }

  const dijkstra = (sId: number) => {
    const { getLastNode } = useGraph();
    //initialization

    const source: DijkstraVertex | undefined = nodes.find(v => v.id === sId);

    qTable.columns = [];

    graph.edges = graph.edges.map(e => {
      e.marked = false;
      return e;
    });

    for (let i = 0; i < nodes.length; i++) {
      //interface begin
      qTable.columns.push({ name: nodes[i].name, label: nodes[i].name });
    }

    if (source) {
      source.cost = 0;
      source.marked = true;
    }

    //interface begin
    qTable.data = [];
    markednodes = [{}];
    checkedName = [];
    round.value = 1;

    doDijkstra(source as DijkstraVertex);

    qTable.data = markednodes.map(mn => {
      const newData: any = {};

      for (const d in mn) {
        newData[d] = {
          val: mn[d],
          color: false
        };
      }
      return newData;
    });
  };

  function findPathinTable(
    nodeName: string,
    color = 'red',
    key: number,
    pervname: any = null
  ) {
    let min = INF;
    const data = qTable.dataShow;
    const name = [nodeName];
    let i_name = -1;
    let coloredRow = 0;

    // if (key > 0) {
    //   data.forEach((d, key) => {
    //     const nm = d[pervname].val.split(', ')[1];
    //     console.log({ nm });
    //     //   if (nm === nodeName) {
    //     //     data[key][pervname].color = color;
    //     //   }
    //   });
    // }

    for (let i = 0; i < data.length; i++) {
      if (data[i][nodeName].val !== 'X' && data[i][nodeName].val !== '0') {
        const newMin = data[i][nodeName].val.split(', ')[0];
        if (newMin !== '∞') {
          const saveMin = min;
          min = Number(newMin) < min ? Number(newMin) : min;
          if (min === Number(newMin) && saveMin === Number(newMin)) {
            const nexName = data[i][nodeName].val.split(', ')[1].trim();
            coloredRow = i;
            if (!name.find(n => n === nexName)) {
              i_name++;
              name[i_name] = nexName;

              if (nodeName.length > 1) {
                data[coloredRow][nodeName].color = 'green';
              } else data[coloredRow][nodeName].color = color;
            }
          }
        }
      }
    }

    // console.log({ name });

    return name;
  }

  function responseColore() {
    let min = INF;
    const nodesName = nodes.map(n => n.name).reverse();
    const nodeName_coloreds = ref([nodesName[0]]);

    for (let key = 0; key < nodeName_coloreds.value.length; key++) {
      let color = 'red';
      switch (key) {
        case 1:
          color = 'green';
          break;
        case 2:
          color = 'blue';
          break;
      }
      console.log({
        key,
        nodeName_coloreds: cloneDeep(nodeName_coloreds.value)
      });

      for (let i = qTable.data.length; i > 0; i--) {
        const save_nodeName_colored = nodeName_coloreds.value[key];
        const newNames = findPathinTable(
          nodeName_coloreds.value[key],
          color,
          key,
          key > 0 ? nodeName_coloreds[key - 1] : null
        );
        newNames.forEach((nName, keyName) => {
          if (keyName === 0) {
            nodeName_coloreds.value[key] = nName;
            const tid = nodes.find(n => n.name === save_nodeName_colored)?.id;
            const sid = nodes.find(n => n.name === nodeName_coloreds.value[key])
              ?.id;
            const edge = graph.edges.find(
              e =>
                Number(e.sid) === Number(sid) && Number(e.tid) === Number(tid)
            );
            if (edge) {
              edge._color = color;
            }
          } else {
            nodeName_coloreds.value.push(nName);

            const tid = nodes.find(n => n.name === save_nodeName_colored)?.id;
            const sid = nodes.find(n => n.name === nName)?.id;
            const edge = graph.edges.find(
              e =>
                Number(e.sid) === Number(sid) && Number(e.tid) === Number(tid)
            );
            if (edge) {
              const color = key === 0 ? 'green' : 'blue';
              edge._color = color;
            }
          }
        });
      }
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
