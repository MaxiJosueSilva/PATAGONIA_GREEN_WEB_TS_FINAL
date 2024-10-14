import React from 'react';

interface MapLegendProps {
  visualization: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ visualization }) => {
  if (!visualization) return null;

  const getLegendItems = () => {
    switch (visualization) {
      case 'temp_cpu':
        return [
          { color: '#2ECC40', label: '< 50°C' },
          { color: '#FFDC00', label: '50°C - 69°C' },
          { color: '#FF4136', label: '> 70°C' },
        ];
      case 'rx':
        return [
          { color: '#2ECC40', label: '> -24 dBm' },
          { color: '#FFDC00', label: '-25 dBm to -27 dBm' },
          { color: '#FF4136', label: '< -28 dBm' },
        ];
      case 'energia':
        return [
          { color: '#2ECC40', label: 'Con energía' },
          { color: '#FF4136', label: 'Sin energía' },
        ];
      default:
        return [];
    }
  };

  const legendItems = getLegendItems();

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar bg-gray-800 p-2 rounded shadow-md text-white">
        <h4 className="font-bold mb-2">{visualization === 'temp_cpu' ? 'Temperatura CPU' : visualization === 'rx' ? 'Potencia RX' : 'Energía'}</h4>
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center mb-1">
            <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;