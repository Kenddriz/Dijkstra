import {Edge, Vertex} from "../graph";
import {UnwrapRef} from "@vue/composition-api";


type DijkstraVertex = Vertex & {
  edges: Edge[];
}

export const useShortestPath = () => {
  const showShortestPath = (vertices: any) => {
    const  table: any = document.getElementById("dijkstraSteps");
    //initialization
    var tr=0, round=1;
    if(!table)
      return;
    table.innerHTML = "";
    table.setAttribute("border",1);
    const row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = "Round";

    for(let i=0; i< vertices.length; i++){
      vertices[i].cost = 10000;
      vertices[i].previous = null;
      vertices[i].marked = false;
      vertices[i].markedRound = 10000;

      //interface begin
      cell = row.insertCell(i+1);
      cell.innerHTML=vertices[i].name;
      //interface end
    }
  }
  return {
    showShortestPath
  }
}

