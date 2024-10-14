import React, { useMemo } from 'react';

interface DashboardStatsProps {
  camaras: any[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ camaras }) => {
  const stats = useMemo(() => {
    const totalCamaras = camaras.length;
    const camarasOnline = camaras.filter(c => c.onu?.online === 'true').length;
    const tempPromedio = camaras.reduce((sum, c) => sum + parseInt(c.onu?.system?.temps?.cpu || '0'), 0) / totalCamaras;
    const rxPromedio = camaras.reduce((sum, c) => sum + parseFloat(c.onu?.optics?.rx_power_onu || '0'), 0) / totalCamaras;

    return {
      totalCamaras,
      camarasOnline,
      porcentajeOnline: (camarasOnline / totalCamaras * 100).toFixed(2),
      tempPromedio: tempPromedio.toFixed(2),
      rxPromedio: rxPromedio.toFixed(2),
    };
  }, [camaras]);

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">Estadísticas Generales</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Total de Cámaras</p>
          <p className="text-xl font-bold text-gray-100">{stats.totalCamaras}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Cámaras Online</p>
          <p className="text-xl font-bold text-gray-100">{stats.camarasOnline} ({stats.porcentajeOnline}%)</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Temperatura Promedio</p>
          <p className="text-xl font-bold text-gray-100">{stats.tempPromedio}°C</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">RX Promedio</p>
          <p className="text-xl font-bold text-gray-100">{stats.rxPromedio} dBm</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;