import { Node, Link, NodeData, AddLinkData } from './types';

const defaultControlPoints = { fromControlPoint: { x: 50, y: 50 }, toControlPoint: { x: -50, y: -50 } };

export function configureNodesAndLinks(nodesData: NodeData[], addLinksData: AddLinkData[]) {
  const nodes: Node[] = [];
  const nodeMap: { [key: string]: Node } = {};
  const links: Link[] = [];

  let maxRow = generateNodesFromList(nodesData, nodes, nodeMap);
  positionNodes(nodes, maxRow);
  createLinks(addLinksData, nodeMap, links);

  return { nodes, links };
}

function generateNodesFromList(nodeList: NodeData[], nodes: Node[], nodeMap: { [key: string]: Node }) {
  let maxRow = 0;
  nodeList.forEach((data) => {
    let size = [100 * Math.pow(0.8, data.row), 40 * Math.pow(0.8, data.row)];
    if (data.size && data.size.length === 2) size = data.size;
    let node = addNode(data.label, data.row, size[0], size[1]);
    if (data.row > maxRow) maxRow = data.row;
    nodeMap[data.label] = node;
    nodes.push(node);
  });
  return maxRow;
}

function addNode(label: string, row: number, width: number, height: number): Node {
  return { x: width * 2, y: row, width, height, color: '#111', label };
}

function positionNodes(nodes: Node[], maxRow: number) {
  const width = 2000;
  const height = 1000;
  let nodesByRow: { [key: number]: Node[] } = {};
  nodes.forEach(node => {
    nodesByRow[node.y] = nodesByRow[node.y] || [];
    nodesByRow[node.y].push(node);
  });

  let rowSpacing = height / (maxRow + 1);
  for (let row in nodesByRow) {
    let nodesInRow = nodesByRow[parseInt(row)];
    let rowY = parseInt(row) * rowSpacing;
    nodesInRow.forEach(node => node.y = rowY);
  }

  let spacingFactor = 0.8;
  for (let row in nodesByRow) {
    let nodesInRow = nodesByRow[parseInt(row)];
    let totalWidth = nodesInRow.reduce((sum, node) => sum + node.width, 0);
    let spacing = (width - totalWidth) / (nodesInRow.length + 1);
    let currentX = spacing;
    nodesInRow.forEach(node => {
      node.x = currentX + node.width / 2;
      currentX += spacing + node.width * spacingFactor;
    });
  }
}

function createLinks(addLinksData: AddLinkData[], nodeMap: { [key: string]: Node }, links: Link[]) {
  addLinksData.forEach(addLinkData => {
    let speedMB = convertSpeedToMB(addLinkData.speed);
    addLink(nodeMap[addLinkData.from], nodeMap[addLinkData.to], speedMB, defaultControlPoints.fromControlPoint, defaultControlPoints.toControlPoint, addLinkData.label, links);
  });
}

function convertSpeedToMB(speed: string) {
  let value = parseFloat(speed);
  return speed.toLowerCase().includes('gb') ? value * 1024 : value;
}

function addLink(from: Node, to: Node, speedMB: number, fromControlPoint: { x: number, y: number }, toControlPoint: { x: number, y: number }, label: string, links: Link[]) {
  if (!from || !to) {
    console.error('Invalid link from:', from, 'to:', to);
    return;
  }
  let params = getParametersForSpeed(speedMB);
  links.push({ from, to, ...params, label, fromControlPoint, toControlPoint });
}

const speedParameters = [
  { range: [1024, 10240], params: { speed: 1, packetColor: 'rgba(255, 255, 0, 0.6)', numPackets: 15, dataSendInterval: 500, packetSize: { width: 7, height: 4 } } },
  { range: [500, 1024], params: { speed: 0.8, packetColor: 'rgba(255, 0, 255, 0.6)', numPackets: 10, dataSendInterval: 500, packetSize: { width: 6, height: 4 } } },
  { range: [100, 500], params: { speed: 0.6, packetColor: 'rgba(0, 255, 0, 0.6)', numPackets: 8, dataSendInterval: 700, packetSize: { width: 5, height: 3 } } },
  { range: [10, 100], params: { speed: 0.4, packetColor: 'rgba(0, 0, 255, 0.6)', numPackets: 6, dataSendInterval: 800, packetSize: { width: 4, height: 2 } } },
  { range: [0, 10], params: { speed: 0.2, packetColor: 'rgba(255, 0, 0, 0.6)', numPackets: 4, dataSendInterval: 2000, packetSize: { width: 5, height: 3 } } }
];

export function getParametersForSpeed(speedMB: number) {
  for (let param of speedParameters) {
    if (speedMB >= param.range[0] && speedMB <= param.range[1]) return param.params;
  }
  return speedParameters[speedParameters.length - 1].params;
}