import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hierarchy, tree } from 'd3-hierarchy';
import { schemeDark2 } from 'd3-scale-chromatic'; 
import './D3_Arbol_tree.css';

interface TangledTreeChartProps {
  data: any;
}

const TangledTreeChart: React.FC<TangledTreeChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 954; 
    const height = 600; 

    const root = hierarchy(data);
    const treeLayout = tree().nodeSize([50, 200]); 
    treeLayout(root);

    // Crear la escala de colores
    const color = d3.scaleOrdinal(schemeDark2); 

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g')
      .attr('transform', `translate(50, ${height / 2})`); 

      g.append('g')
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', d => color(d.target.data.name)) // Color de línea según nodo hijo
      .attr('stroke-width', 2)
      .attr('d', d3.linkHorizontal()
        .x(d => d.y) 
        .y(d => d.x));  

    const node = g.append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.y},${d.x})`); 

    node.append('circle')
      .attr('r', 5)
      .attr('fill', d => color(d.data.name)); // Aplicar color al círculo

    node.append('text')
      .attr('dy', '0.35em')
      .attr('x', d => d.children ? 10 : 10) 
      .attr('text-anchor', d => d.children ? 'start' : 'start') 
      .text(d => d.data.name)
      .style('fill', d => color(d.data.name)); // Aplicar color al texto

    // Agregar zoom
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
  }, [data]);

  return (
    <div className="tangled-tree-container">
      <svg ref={svgRef} width="954" height="600" /> 
    </div>
  );
};

export default TangledTreeChart;