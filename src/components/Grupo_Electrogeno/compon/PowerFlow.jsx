import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function PowerFlow() {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const components = [
      { type: 'poles', x: 50, label: 'Red Pública en Línea' },
      { type: 'generator', x: 300, label: 'Generador apagado' },
      { type: 'battery', x: 550, label: 'Baterías con carga' },
      { type: 'tower', x: 700, label: 'TX' }
    ];

    // Draw connecting line with updated style
    svg.append('line')
      .attr('x1', 50)
      .attr('y1', 100)
      .attr('x2', 700)
      .attr('y2', 100)
      .style('stroke', '#00ffff')
      .style('stroke-width', 1)
      .style('stroke-opacity', 0.8);

    // Draw components
    components.forEach(comp => {
      const g = svg.append('g')
        .attr('transform', `translate(${comp.x},100)`)
        .attr('class', 'component')
        .style('cursor', 'pointer');

      g.on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.8);
      })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 1);
        });

      switch(comp.type) {
        case 'poles':
          drawPoles(g);
          break;
        case 'generator':
          drawGenerator(g);
          break;
        case 'battery':
          drawBattery(g);
          break;
        case 'tower':
          drawTower(g);
          break;
        default:
          break;
      }

      // Add label
      g.append('text')
        .attr('y', 70)
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .style('font-size', '12px')
        .text(comp.label);
    });
  }, []);

  // Keep the existing component drawing functions unchanged
  const drawPoles = (g) => {
    [-30, 0, 30].forEach(offset => {
      g.append('rect')
        .attr('x', offset - 5)
        .attr('y', -50)
        .attr('width', 10)
        .attr('height', 50)
        .style('fill', '#666');

      g.append('rect')
        .attr('x', offset - 20)
        .attr('y', -45)
        .attr('width', 40)
        .attr('height', 6)
        .style('fill', '#666');
    });
  };

  const drawGenerator = (g) => {
    g.append('rect')
      .attr('x', -25)
      .attr('y', -30)
      .attr('width', 50)
      .attr('height', 40)
      .style('fill', '#444')
      .style('stroke', '#666')
      .style('stroke-width', 2);

    const fuelLevel = 0.7;
    const fuelHeight = 40;
    
    g.append('rect')
      .attr('x', 30)
      .attr('y', -30)
      .attr('width', 10)
      .attr('height', fuelHeight)
      .style('fill', 'none')
      .style('stroke', '#666')
      .style('stroke-width', 1);

    g.append('rect')
      .attr('x', 30)
      .attr('y', -30 + (fuelHeight * (1 - fuelLevel)))
      .attr('width', 10)
      .attr('height', fuelHeight * fuelLevel)
      .style('fill', '#00ffff');
  };

  const drawBattery = (g) => {
    g.append('rect')
      .attr('x', -30)
      .attr('y', -40)
      .attr('width', 60)
      .attr('height', 60)
      .style('fill', '#555')
      .style('stroke', '#666')
      .style('stroke-width', 2);

    for (let i = 0; i < 3; i++) {
      g.append('rect')
        .attr('x', -20 + (i * 25))
        .attr('y', -30)
        .attr('width', 15)
        .attr('height', 40)
        .style('fill', '#00ffff')
        .style('opacity', 0.7);
    }
  };

  const drawTower = (g) => {
    g.append('path')
      .attr('d', `
        M 0,-60 
        L 30,0 
        L -30,0 
        Z
      `)
      .style('fill', 'none')
      .style('stroke', '#666')
      .style('stroke-width', 2);

    [-40, -20].forEach(y => {
      const width = Math.abs(y) * 0.8;
      g.append('line')
        .attr('x1', -width)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)
        .style('stroke', '#666')
        .style('stroke-width', 2);
    });
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="200"
      viewBox="0 0 800 200"
    />
  );
}

export default PowerFlow;
