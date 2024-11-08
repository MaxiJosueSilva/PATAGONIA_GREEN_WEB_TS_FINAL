import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Map from './compon/Map';
import EthernetChart from './compon/EthernetChart';
import PowerFlow from './compon/PowerFlow';
import EnergyChart from './compon/EnergyChart';
import AlertSystem from './compon/AlertSystem';
import { fetchLocations, getHistorial, updateRealTimeData } from '../../redux/slices/gruposSlice';
import { setSelectedNode } from '../../redux/slices/selectedNodeSlice';
import './Grupo_Electrogeno.css';


interface RealTimeData {
  [key: string]: any;
}

const Grupo_Electrogeno: React.FC = () =>  {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: { selectedNode: { nodeId: string } }) => state.selectedNode.nodeId);
  const [socket, setSocket] = React.useState(null);

  useEffect(() => {
    console.log('Componente Grupos montado');
    dispatch(fetchLocations() as any);
    
    const intervalo = setInterval(() => {
        dispatch(fetchLocations() as any);
        
        getHistorial
    }, 1000);

    return () => clearInterval(intervalo);
}, [dispatch]);

  const handleNodeSelect = (nodeId: string) => {
    dispatch(setSelectedNode(nodeId));
    //dispatch(updateRealTimeData(nodeId));
  };

  return (
    <div className="grupo-electrogeno-container">
      <AlertSystem socket={socket} />
      <div className="grupo-electrogeno-content">
        {/* Columna Izquierda: Mapa */}
        <div className="map-container">
          <Map onNodeSelect={handleNodeSelect} />
        </div>
  
        {/* Columna Derecha: Gráficos */}
        <div className="charts-container">
          {/* EthernetChart */}
          <div className="chart-card">
            <div className="card-header">
              <h5 className="card-title">ETHERNET - {selectedNode}</h5>
            </div>
            <div className="card-body">
              <EthernetChart selectedNode={selectedNode} />
            </div>
          </div>
  
          {/* PowerFlow */}
          <div className="chart-card">
            <div className="card-body">
              <PowerFlow selectedNode={selectedNode} />
            </div>
          </div>
  
          {/* EnergyChart */}
          <div className="chart-card">
            <div className="card-header">
              <h5 className="card-title">ENERGIA - {selectedNode}</h5>
            </div>
            <div className="card-body">
              <EnergyChart selectedNode={selectedNode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Grupo_Electrogeno;
