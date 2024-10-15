import React from 'react';
import { FaWifi, FaThermometerHalf, FaMemory, FaBolt, FaArrowUp, FaArrowDown, FaMicrochip } from 'react-icons/fa';
import GaugeChart from 'react-gauge-chart';

interface ONUDataProps {
  data: {
    online: string;
    serial_number: string;
    name: string;
    mac_address: string;
    firmware_version: string;
    status: string;
    distance: string;
    system: {
      cpu: string;
      mem: string;
      temps: {
        cpu: string;
      };
    };
    optics: {
      tx_power_onu: string;
      rx_power_onu: string;
      tx_power_olt: string;
      rx_power_olt: string;
    };
    stats: {
      tx_bps: string;
      rx_bps: string;
      tx_bytes: string;
      rx_bytes: string;
    };
  };
}

const ONUData: React.FC<ONUDataProps> = ({ data }) => {
  if (!data) {
    return <div>No ONU data available</div>;
  }

  const { online, serial_number, name, mac_address, firmware_version, status, distance, system, optics, stats } = data;

  return (
    <div style={{ padding: '10px', backgroundColor: 'transparent', color: 'white', borderRadius: '5px', width: '100%', height: '100%', overflow: 'auto', fontSize: '0.8rem' }}>
      <h4 className="text-sm font-semibold mb-2 text-center flex items-center justify-center"><FaMicrochip /> Información del Sistema</h4>
      <div className="flex justify-between mb-2">
        <div>
          <p>CPU: {system.cpu}%</p>
          <GaugeChart id="cpu-gauge" nrOfLevels={5} percent={parseInt(system.cpu) / 100} colors={['#5BE12C', '#F5CD19', '#EA4228']} textColor="#333" style={{ width: '100px', height: '50px' }} />
        </div>
        <div>
          <p>Memoria: {system.mem}%</p>
          <GaugeChart id="mem-gauge" nrOfLevels={5} percent={parseInt(system.mem) / 100} colors={['#5BE12C', '#F5CD19', '#EA4228']} textColor="#333" style={{ width: '100px', height: '50px' }} />
        </div>
        <div>
          <p>Temp: {system.temps.cpu}°C</p>
          <GaugeChart id="temp-gauge" nrOfLevels={5} percent={parseInt(system.temps.cpu) / 100} colors={['#5BE12C', '#F5CD19', '#EA4228']} textColor="#333" style={{ width: '100px', height: '50px' }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <h6 className="font-semibold"><FaWifi /> ONU Estado: {online === "true" ? 'Online' : 'Offline'}</h6>
          <p>Serie: {serial_number}</p>
          <p>Firmware: {firmware_version}</p>
          <p>Estado: {status === "1" ? 'Activo' : 'Inactivo'}</p>
        </div>
        <div>
          <h6 className="font-semibold"><FaBolt /> Óptica</h6>
          <p>TX (ONU): {optics.tx_power_onu}</p>
          <p>RX (ONU): {optics.rx_power_onu}</p>
          <p>TX (OLT): {optics.tx_power_olt}</p>
          <p>RX (OLT): {optics.rx_power_olt}</p>
        </div>
        <div>
          <h6 className="font-semibold"><FaArrowUp /> Tráfico</h6>
          <p>TX: {stats.tx_bps} bps | RX: {stats.rx_bps} bps</p>
          <p>TX Total: {stats.tx_bytes} bytes | RX Total: {stats.rx_bytes} bytes</p>
        </div>
      </div> 
      <p className="mt-2">Distancia: {distance} metros</p>
    </div>
  );
};

export default ONUData;