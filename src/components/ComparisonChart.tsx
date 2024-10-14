import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHistorialCamara } from '../redux/slices/camarasSlice';
import { RootState, AppDispatch } from '../redux/store';

interface ComparisonChartProps {
  cameraIds: string[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ cameraIds }) => {
  const dispatch = useDispatch<AppDispatch>();
  const historialData = useSelector((state: RootState) => state.camaras.historial);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    cameraIds.forEach(id => {
      dispatch(fetchHistorialCamara(id));
    });
  }, [dispatch, cameraIds]);

  useEffect(() => {
    if (historialData && Object.keys(historialData).length > 0) {
      const datasets = cameraIds.map(id => ({
        label: `Cámara ${id}`,
        data: historialData[id]?.data.map((item: any) => ({
          x: new Date(item.timestamp),
          y: item.values[0] // Asumiendo que queremos comparar el primer valor
        })),
        fill: false,
        borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
        tension: 0.1
      })).filter(dataset => dataset.data);

      setChartData({
        datasets
      });
    }
  }, [historialData, cameraIds]);

  if (!chartData) return <div>Cargando datos de comparación...</div>;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute'
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }}
      />
    </div>
  );
};

export default ComparisonChart;