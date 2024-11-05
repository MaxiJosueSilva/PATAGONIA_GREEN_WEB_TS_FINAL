import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TemperatureChart({ sensorData, timeframe }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFFFFF'
        }
      },
      title: {
        display: true,
        text: 'Historial de Temperatura',
        color: '#FFFFFF'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(128,128,128,0.2)'
        },
        ticks: {
          color: '#FFFFFF'
        }
      },
      y: {
        grid: {
          color: 'rgba(128,128,128,0.2)'
        },
        ticks: {
          color: '#FFFFFF'
        },
        beginAtZero: true  // Comienza la escala en 0 para evitar valores negativos en la temperatura
      }
    }
  };

  const data = {
    labels: sensorData.data[0].map(point => 
      new Date(point.x).toLocaleTimeString()
    ).reverse(), // Invertir el orden de las etiquetas
    datasets: ['S1', 'S2', 'S3', 'Promedio'].map((sensorId, index) => ({
      label: `${sensorId} Temperatura`,
      data: sensorData.data[index].map(point => point.y).reverse(), // Invertir el orden de los datos
      borderColor: index === 0 ? '#FF6384' : 
                  index === 1 ? '#36A2EB' : 
                  index === 2 ? '#4BC0C0' : 
                  '#FFCE56',
      tension: 0.1,
      spanGaps: true  // Permite saltar los puntos sin valor para mantener una línea continua
    }))
  };

  return (
    <div style={{ 
      backgroundColor: '#262730', 
      padding: '20px', 
      borderRadius: '8px',
      maxHeight: '300px'
    }}>
      <Line options={options} data={data} />
    </div>
  );
}

export default TemperatureChart;
