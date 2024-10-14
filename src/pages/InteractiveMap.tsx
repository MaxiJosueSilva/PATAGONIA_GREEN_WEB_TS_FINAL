import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCamaras } from '../redux/slices/camarasSlice';
import { RootState, AppDispatch } from '../redux/store';
import MapLegend from '../components/MapLegend';
import CameraArc from '../components/CameraArc';
import OLTConnectionLines from '../components/OLTConnectionLines';
import DashboardStats from '../components/DashboardStats';
import AlertBanner from '../components/AlertBanner';
import 'leaflet/dist/leaflet.css';

const InteractiveMap: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const camaras = useSelector((state: RootState) => state.camaras.camaras);
  const [visualization, setVisualization] = useState<string>('');

  useEffect(() => {
    dispatch(fetchCamaras());
  }, [dispatch]);

  const getMarkerColor = (camara: any) => {
    if (visualization === 'temp_cpu') {
      const temp = parseInt(camara.onu?.temp_cpu || '0');
      if (temp > 60) return 'red';
      if (temp > 40) return 'yellow';
      return 'green';
    }
    if (visualization === 'rx') {
      const rx = parseFloat(camara.onu?.rx || '0');
      if (rx < -25) return 'red';
      if (rx < -20) return 'yellow';
      return 'green';
    }
    if (visualization === 'energia') {
      return camara.energia ? 'green' : 'red';
    }
    return 'blue';
  };

  return (
    <div className="flex flex-col h-screen">
      <AlertBanner camaras={camaras} />
      <div className="flex flex-1">
        <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Filtros y Visualización</h2>
          <div className="mb-4">
            <label className="block mb-2">Visualización:</label>
            <select
              className="w-full p-2 border rounded"
              value={visualization}
              onChange={(e) => setVisualization(e.target.value)}
            >
              <option value="">Normal</option>
              <option value="temp_cpu">Temperatura CPU</option>
              <option value="rx">Potencia RX</option>
              <option value="energia">Energía</option>
            </select>
          </div>
          <DashboardStats camaras={camaras} />
        </div>
        <div className="w-3/4 relative">
          <MapContainer center={[-31.7333, -60.5233]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup>
              {camaras.map((camara: any) => (
                <Marker
                  key={camara.idCamara}
                  position={[camara.lat, camara.lon]}
                  icon={L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="background-color: ${getMarkerColor(camara)}; width: 10px; height: 10px; border-radius: 50%;"></div>`,
                  })}
                >
                  <Popup>
                    <h3>{camara.name}</h3>
                    <p>Tipo: {camara.tipo}</p>
                    <p>Sector: {camara.sector}</p>
                    {camara.onu && (
                      <>
                        <p>ONU: {camara.onu.name}</p>
                        <p>Temperatura CPU: {camara.onu.temp_cpu}°C</p>
                        <p>RX: {camara.onu.rx}</p>
                      </>
                    )}
                  </Popup>
                  <CameraArc camera={camara} />
                </Marker>
              ))}
            </MarkerClusterGroup>
            <OLTConnectionLines camaras={camaras} />
            <MapLegend visualization={visualization} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;