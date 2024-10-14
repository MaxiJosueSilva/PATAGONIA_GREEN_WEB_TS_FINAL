import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchNodes } from '../../redux/slices/neo4jSlice';
import Graph from './Graph';
import './D3.css';

export const D3: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { nodes, status } = useSelector((state: RootState) => state.neo4j);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    dispatch(fetchNodes());
  }, [dispatch]);
  
  useEffect(() => {
    if (status === 'succeeded' && nodes.nodeData && nodes.nodeLinks) {
      setGraphData({ 
        nodes: nodes.nodeData.map(node => ({...node})),
        links: nodes.nodeLinks.map(link => ({...link}))
      });
    }
  }, [nodes, status]);
  
  return (
    <div className="login-container">
      <div className="graph-container">
        {status === 'loading' ? (
          <p>Cargando nodos...</p>
        ) : graphData.nodes.length > 0 && graphData.links.length > 0 ? (
          <Graph nodes={graphData.nodes} links={graphData.links} />
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default D3;