import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistorialCamara } from '../redux/slices/camarasSlice';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistorialCamaraChartProps {
  camaraId: string;
}

const HistorialCamaraChart: React.FC<HistorialCamaraChartProps> = ({ camaraId }) => {
  const dispatch = useDispatch<any>();
  const historial = useSelector((state: any) => state.camaras.historialCamara);

  useEffect(() => {
    dispatch(fetchHistorialCamara(camaraId));
  }, [dispatch, camaraId]);

  if (!historial || !historial.data || historial.data.length === 0) {
    return <div>Cargando historial...</div>;
  }

  const chartData = {
    labels: Array.from({ length: historial.data[0].length }, (_, i) => i.toString()),
    datasets: historial.series.map((serie: string, index: number) => ({
      label: serie,
      data: historial.data[index],
      fill: false,
      tension: 0.1,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: '#4bc0c0',
      borderWidth: 0.5,
      pointRadius: 0.5,
      lineTension: 0.3
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Índice de muestra'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor'
        }
      }
    }
  };

  return (
    <div style={{ height: '150px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HistorialCamaraChart;