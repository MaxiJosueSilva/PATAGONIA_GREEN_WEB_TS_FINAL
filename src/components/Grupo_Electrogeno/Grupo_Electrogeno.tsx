import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Map from './compon/Map';
import EthernetChart from './compon/EthernetChart';
import PowerFlow from './compon/PowerFlow';
import EnergyChart from './compon/EnergyChart';
import AlertSystem from './compon/AlertSystem';
import { fetchLocations, getHistorial } from '../../redux/slices/gruposSlice';
import { setSelectedNode } from '../../redux/slices/selectedNodeSlice';
import './index.css';

interface RealTimeData {
  [key: string]: any;
}

const Grupo_Electrogeno: React.FC = () =>  {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: { selectedNode: { nodeId: string } }) => state.selectedNode.nodeId);
  const [socket, setSocket] = React.useState(null);
  const locations = useSelector((state: any) => state.grupos.locations);
  const historial = useSelector((state: any) => state.grupos.historial);

  useEffect(() => {
    console.log('Componente Grupos montado');
    dispatch(fetchLocations() as any);
    
    const intervalo = setInterval(() => {
        dispatch(fetchLocations() as any);
    }, 1000);

    return () => clearInterval(intervalo);
}, [dispatch]);

  const handleNodeSelect = (nodeId: string) => {
    dispatch(setSelectedNode(nodeId));
  };

  return (
    <div className="container-fluid">
      <AlertSystem socket={socket} />
      <div className="row">
        <div className="col-md-7">
          <Map onNodeSelect={handleNodeSelect} />
        </div>
        <div className="col-md-5">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title">ETHERNET - {selectedNode}</h5>
            </div>
            <div className="card-body">
              <EthernetChart selectedNode={selectedNode} socket={socket} />
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <PowerFlow selectedNode={selectedNode} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title">ENERGIA - {selectedNode}</h5>
            </div>
            <div className="card-body">
              <EnergyChart selectedNode={selectedNode} socket={socket} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grupo_Electrogeno;
