
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SensorMap from './components/SensorMap';
import SensorCard from './components/SensorCard';
import TemperatureChart from './components/TemperatureChart';
import Sidebar from './components/Sidebar';
import { fetchTemperatura } from '../../redux/slices/datacenterSlice';
import './index.css'

export const Data_Center = () => {
  const dispatch = useDispatch();
  const sensorData = useSelector(state => state.datacenter.temp);
  const [settings, setSettings] = useState({
    tempLow: 21.0,
    tempHigh: 24.0,
    showHeatMap: false,
    timeframe: '5min',
    enableAlerts: true
  });

  useEffect(() => {
    if (!sensorData || sensorData.length === 0) {
      dispatch(fetchTemperatura());
    }

    const interval = setInterval(() => {
      dispatch(fetchTemperatura());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, sensorData]);

  if (!sensorData || sensorData.length === 0) return <div>Loading...</div>;

  // Procesa datos para pasar a los componentes

  const seriesLabels = sensorData[0].series; // ["S1", "S2", "S3", "Promedio"]

  return (
    <div className="app">
      <Sidebar settings={settings} onSettingsChange={setSettings} />
      <main className="main-content">
        <h1>Panel de Sensores</h1>
        <p>Monitoreo en tiempo real de sensores de temperatura y humedad</p>
        
        <SensorMap 
          sensorData={sensorData} 
          settings={settings}
        />
        
        <div className="sensor-grid">
          {seriesLabels.slice(0, 3).map((sensorId, index) => (
            <SensorCard
              key={sensorId}
              sensorId={sensorId}
              temperatureData={sensorData[0].data[index]}
              humidityData={sensorData[1].data[index]}
            />
          ))}
        </div>

        <TemperatureChart 
          sensorData={sensorData[0]}  // Pasamos todos los datos para graficar
          timeframe={settings.timeframe}
        />
      </main>
    </div>
  );
}

export default Data_Center;
