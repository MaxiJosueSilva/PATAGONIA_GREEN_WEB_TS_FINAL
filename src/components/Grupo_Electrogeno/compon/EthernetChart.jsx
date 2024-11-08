import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { fetchHistoricalData } from '../store/generatorSlice';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

function EthernetChart({ selectedNode }) {
  const dispatch = useDispatch();
  const historicalData = useSelector(state => state.generators.historicalData[selectedNode]);
  const chartRef = useRef(null);

  useEffect(() => {
    dispatch(fetchHistoricalData(selectedNode));
  }, [selectedNode, dispatch]);

  const formatChartData = (data) => {
    if (!data?.data?.[0]) return [];
    const thirtyMinutesAgo = moment().subtract(30, 'minutes');

    return [{
      label: 'Ethernet Usage',
      borderColor: '#00ffff',
      backgroundColor: 'rgba(0, 255, 255, 0.1)',
      tension: 0.1,
      borderWidth: 1,
      fill: true,
      data: data.data[0].map(point => ({
        x: moment(point.x).isBefore(thirtyMinutesAgo) ? thirtyMinutesAgo : moment(point.x),
        y: point.y
      }))
    }];
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          stepSize: 1,
          displayFormats: {
            minute: 'HH:mm'
          }
        },
        min: moment().subtract(30, 'minutes'),
        max: moment(),
        grid: { color: '#333' },
        ticks: { color: '#fff' }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#333' },
        ticks: { color: '#fff' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    }
  };

  return (
    <div style={{ height: '200px' }}>
      <Line 
        ref={chartRef}
        data={{
          datasets: historicalData ? formatChartData(historicalData) : []
        }}
        options={options}
      />
    </div>
  );
}

export default EthernetChart;
