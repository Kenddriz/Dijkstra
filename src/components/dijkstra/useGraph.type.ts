export type Nodes = {
  id: number;
  name: string;
  _color?: string;
};

export type Edge = {
  id: string;
  sid: number /**fromVertex=source id*/;
  tid: number /**toVertex = target id*/;
  name: number /**Valeur de l'arc*/;
  _color?: string;
};
export type Options = {
  force: number;
  size: { w: number; h: number };
  nodeSize: number;
  nodeLabels: boolean;
  linkLabels: boolean;
  canvas: boolean;
  fontSize: number;
  strLinks: boolean;
};
export type Graph = {
  nodes: Nodes[];
  edges: Edge[];
  selectedNodes: Nodes[];
  selectedEdge: Edge | null;
  edgeIsAddable: boolean;
  nodeSize: number;
  edgeSize?: number;
};
