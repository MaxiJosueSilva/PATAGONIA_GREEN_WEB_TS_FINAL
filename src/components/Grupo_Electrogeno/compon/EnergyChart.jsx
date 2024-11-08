import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { getHistorial, updateRealTimeData } from '../../../redux/slices/gruposSlice';
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

function EnergyChart({selectedNode}) {
  const dispatch = useDispatch();
  const historicalData = useSelector(state => state.grupos.historial);
  const chartRef = useRef(null);

  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Energia Entrada',
        borderColor: '#ff6384',
        tension: 0.1,
        fill: false,
        data: []
      },
      {
        label: 'Energia Salida',
        borderColor: '#36a2eb',
        tension: 0.1,
        fill: false,
        data: []
      },
      {
        label: 'Energia Nebula',
        borderColor: '#4bc0c0',
        tension: 0.1,
        fill: false,
        data: []
      }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getHistorial(selectedNode));
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedNode, dispatch]);


  useEffect(() => {
    if (historicalData) {
      setChartData(formatChartData(historicalData));
    }
  }, [historicalData]);
  
  useEffect(() => {
    const handleUpdate = (data) => {
      if (data.node_id !== selectedNode) return;

      setChartData(prev => {
        if (!prev.datasets) return prev;

        const newDatasets = prev.datasets.map((dataset, i) => {
          const newData = [...(dataset.data || [])];
          if (newData.length > 30) newData.shift();

          const value = i === 0 ? data.energia?.entrada :
                       i === 1 ? data.energia?.salida :
                       i === 2 ? data.energia?.nebula : 0;

          if (typeof value === 'number') {
            newData.push({ x: moment(data.timestamp).isBefore(moment().subtract(30, 'minutes')) ? moment().subtract(30, 'minutes') : moment(data.timestamp), y: value });
          }

          return {
            ...dataset,
            data: newData
          };
        });

        return {
          ...prev,
          datasets: newDatasets
        };
      });

      dispatch(updateRealTimeData(data));
    };

    // Aquí se llama a handleUpdate
    dispatch(updateRealTimeData({ node_id: selectedNode }));
  }, [selectedNode, dispatch]);

  const formatChartData = (data) => {
    if (!data?.data) return {
      datasets: [
        {
          label: 'Energia Entrada',
          borderColor: '#ff6384',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.1,
          fill: true,
          borderWidth: 1,
          data: []
        },
        {
          label: 'Energia Salida',
          borderColor: '#36a2eb',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.1,
          fill: true,
          borderWidth: 1,
          data: []
        },
        {
          label: 'Energia Nebula',
          borderColor: '#4bc0c0',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.1,
          fill: true,
          borderWidth: 1,
          data: []
        }
      ]
    };
    
    return {
      datasets: data.data.map((series, index) => ({
        label: ['Energia Entrada', 'Energia Salida', 'Energia Nebula'][index],
        borderColor: ['#ff6384', '#36a2eb', '#4bc0c0'][index],
        backgroundColor: [
          'rgba(255, 99, 132, 0.1)',
          'rgba(54, 162, 235, 0.1)',
          'rgba(75, 192, 192, 0.1)'
        ][index],
        tension: 0.1,
        fill: true,
        borderWidth: 1,
        data: series.map(point => ({
          //x: moment(point.x).isBefore(moment().subtract(1, 'minutes')) ? moment().subtract(30, 'minutes') : moment(point.x),
          x: point.x,
          y: point.y
        }))
      }))
    };
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
        // min: moment().subtract(30, 'minutes'),
        // max: moment(),
        grid: { color: '#333' },
        ticks: { color: '#fff' }
      },
      y: {
        beginAtZero: true,
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
      <Line ref={chartRef} data={historicalData ? formatChartData(historicalData) : formatChartData()} options={options} />
    </div>
  );
}

export default EnergyChart;