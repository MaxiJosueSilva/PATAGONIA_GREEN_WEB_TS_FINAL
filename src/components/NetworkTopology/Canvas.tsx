import React, { useEffect, useRef } from 'react';
import { drawNode, drawLink, animatePackets } from './renderFunctions';
import { configureNodesAndLinks, getParametersForSpeed } from './dataProcessing';
import { handleMouseInteractions } from './interactionHandlers';
import { Node, Link, CanvasProps } from './types';

export const Canvas: React.FC<CanvasProps> = ({ nodeData, addLinks }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 2000;
    let height = 1000;
    let zoomLevel = 1;
    let canvasX = 0;
    let canvasY = 0;

    const { nodes, links } = configureNodesAndLinks(nodeData, addLinks);

    function resizeCanvas() {
      width = canvas.width = 1800;
      height = canvas.height = 1000;
    }

    function animate(time: number) {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(canvasX, canvasY);
      ctx.scale(zoomLevel, zoomLevel);

      links.forEach(link => drawLink(ctx, link));
      nodes.forEach(node => drawNode(ctx, node));
      animatePackets(ctx, links, time);

      ctx.restore();
      requestIdRef.current = requestAnimationFrame(animate);
    }

    function init() {
      resizeCanvas();
      animate(0);
    }

    const cleanup = handleMouseInteractions(canvas, (newZoom, newX, newY) => {
      zoomLevel = newZoom;
      canvasX = newX;
      canvasY = newY;
    });

    init();

    return () => {
      cancelAnimationFrame(requestIdRef.current!);
      cleanup();
    };
  }, [nodeData, addLinks]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', backgroundColor: '#040405' }} />;
};

export default Canvas;