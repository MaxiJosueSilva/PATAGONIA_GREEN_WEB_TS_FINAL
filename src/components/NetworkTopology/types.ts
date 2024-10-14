export interface Node {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  cornerRadius?: number;
}

export interface Link {
  from: Node;
  to: Node;
  speed: number;
  packetColor: string;
  numPackets: number;
  dataSendInterval: number;
  packetSize: { width: number; height: number };
  label: string;
  fromControlPoint: { x: number; y: number };
  toControlPoint: { x: number; y: number };
}

export interface NodeData {
  label: string;
  row: number;
  size?: [number, number];
}

export interface AddLinkData {
  from: string;
  to: string;
  speed: string;
  label: string;
}

export interface CanvasProps {
  nodeData: NodeData[];
  addLinks: AddLinkData[];
}