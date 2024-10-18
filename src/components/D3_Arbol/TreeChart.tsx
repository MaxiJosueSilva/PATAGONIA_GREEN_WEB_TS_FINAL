import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeChart: React.FC<{ data: any }> = ({ data }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data) return;

    // Limpiar el SVG existente
    d3.select(svgRef.current).selectAll('*').remove();

    // Configuración inicial
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const nodeWidth = 100;
    const nodeHeight = 30;
    const nodeRadius = 5;
    const nodePadding = 50;
    const levelPadding = 150;

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g')
      .attr('transform', `translate(${50},${50})`);

    // Procesar los datos (accede a data directamente)
    const hierarchyData = d3.hierarchy(data);
    const treeLayout = d3.tree().nodeSize([nodeWidth + nodePadding, levelPadding]);
    const root = treeLayout(hierarchyData);

    // Dibujar los enlaces
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .attr('d', d => {
        return `M${d.source.x},${d.source.y + nodeHeight}
                C${d.source.x},${(d.source.y + d.target.y + nodeHeight) / 2} 
                 ${d.target.x},${(d.source.y + d.target.y + nodeHeight) / 2} 
                 ${d.target.x},${d.target.y}`;
      });

    // Dibujar los nodos
    const nodeGroups = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Rectángulos de los nodos
    nodeGroups
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', nodeRadius)
      .attr('ry', nodeRadius)
      .attr('fill', '#fff')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))');

    // Etiquetas de los nodos
    nodeGroups
      .append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'Arial')
      .attr('fill', '#333')
      .style('font-weight', 'bold')
      .text(d => d.data.name);

    // Agregar zoom
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '600px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        padding: '20px'
      }}
    >
      <svg ref={svgRef} style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '4px'
      }} />
    </div>
  );
};

export default TreeChart;