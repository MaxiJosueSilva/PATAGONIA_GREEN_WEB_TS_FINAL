import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface GraphProps {
  nodes: Node[];
  links: Link[];
}

const Graph: React.FC<GraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0 || links.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create new objects for nodes and links to ensure they are extensible
    const nodesCopy = nodes.map(node => ({...node}));
    const linksCopy = links.map(link => ({...link}));

    // Create the simulation with nodesCopy
    const simulation = d3.forceSimulation(nodesCopy as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(linksCopy).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw the links
    const link = svg.append('g')
      .selectAll('line')
      .data(linksCopy)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    // Draw the nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodesCopy)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d: any) => color(d.group.toString()))
      .call(drag(simulation) as any);

    // Add labels to the nodes
    const labels = svg.append('g')
      .selectAll('text')
      .data(nodesCopy)
      .join('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text((d: any) => d.id);

    // Update positions on each tick of the simulation
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Drag function
    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <svg ref={svgRef} width="100%" height="600"></svg>
  );
};

export default Graph;