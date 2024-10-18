import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchNodestree } from '../../redux/slices/neo4jSlice';
import TreeChart from './TreeChart';
import TangledTreeChart from './TangledTreeChart';

import './D3_Arbol.css';


export const D3_Arbol: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { nodes, status } = useSelector((state: RootState) => state.neo4j);
  const [treeData, setTreeData] = useState(nodes);

  useEffect(() => {
    dispatch(fetchNodestree());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      setTreeData(nodes);
    }
  }, [nodes, status]);

  return (
    <div className="tree-container">
      {status === 'loading' ? (
        <p>Cargando datos...</p>
      ) : treeData ? (
        // <TreeChart data={treeData} />
        <TangledTreeChart data={treeData} /> 
      ) : (
        <p>No hay datos para mostrar</p>
      )}
    </div>
  );
};

export default D3_Arbol;
