import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';
import styled from 'styled-components';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ContenedorGrafico = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  padding: 20px;
`;

const EnvolturioGraficoEstilizado = styled.div`
  width: 100%;
  height: 100%;
`;

interface PropiedadesGraficoLinea {
  datosGrafico: { x: number; y: number }[][];
  etiquetasSeries: string[];
  unidad?: 'minute' | 'hour' | 'day';
}

const GraficoLinea: React.FC<PropiedadesGraficoLinea> = ({ datosGrafico, etiquetasSeries, unidad = 'minute' }) => {
  const opcionesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: { 
          unit: unidad,
          displayFormats: {
            minute: 'HH:mm'
          },
        },
        adapters: {
          date: {
            locale: es,
          },
        },
      },
      y: {
        beginAtZero: true,
      }
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
      }
    }
  };

  const conjuntoDatos = etiquetasSeries.map((etiqueta, indice) => ({
    label: etiqueta,
    data: datosGrafico[indice].map(punto => ({ x: new Date(punto.x), y: punto.y })),
    fill: true,
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: '#4bc0c0',
    borderWidth: 0.5,
    pointRadius: 0.5,
  }));

  return (
    <ContenedorGrafico>
      <EnvolturioGraficoEstilizado>
        <Line data={{ datasets: conjuntoDatos }} options={opcionesGrafico} />
      </EnvolturioGraficoEstilizado>
    </ContenedorGrafico>
  );
};

export default GraficoLinea;