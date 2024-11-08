// import React, { useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { Line } from 'react-chartjs-2';

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const MetricsChart = ({ type, value }) => {
//   const chartRef = useRef(null);
//   const historicalData  = value;
//   const labels = Array(50).fill('').map((_, i) => 
//     new Date(Date.now() - (49 - i) * 2000).toLocaleTimeString()
//   );
  
//   const colors = [
//     'rgb(0, 255, 157)',    // Green (accent)
//     'rgb(255, 215, 0)',    // Yellow (warning)
//     'rgb(255, 71, 87)',    // Red (danger)
//     'rgb(0, 174, 255)'     // Blue
//   ];
  
//   const datasets = type === 'cpu'; 

//   useEffect(() => {
//     const labels = [];
//     const datasets = {};

//     rawData.forEach(item => {
//       labels.push(item.timestamp);

//       if (type === 'cpu') {
//         for (let i = 1; i <= 4; i++) {
//           const cpuKey = `cpu${i}`;
//           if (!datasets[cpuKey]) {
//             datasets[cpuKey] = [];
//           }
//           datasets[cpuKey].push(item[cpuKey]);
//         }
//       } else {
//         if (!datasets[type]) {
//           datasets[type] = [];
//         }
//         datasets[type].push(parseFloat(item[type])); // Parsear memoria y disco a números
//       }
//     });
//     const chartDatasets = type === 'cpu'
//       ? Object.keys(datasets).map((key, i) => ({
//           label: `Core ${i + 1}`,
//           data: datasets[key],
//           borderColor: colors[i], // Asegúrate de que 'colors' esté definido
//           // ... (resto de las propiedades del dataset)
//         }))
//       : [{
//           label: type.charAt(0).toUpperCase() + type.slice(1),
//           data: datasets[type],
//           borderColor: colors[0], // Asegúrate de que 'colors' esté definido
//           // ... (resto de las propiedades del dataset)
//         }];

//       setChartData({ labels, datasets: chartDatasets });
//     }, [rawData, type]);
    
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: { duration: 0 },
//     backgroundColor: 'var(--bg-secondary)',
//     scales: {
//       x: {
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)',
//           borderColor: 'rgba(255, 255, 255, 0.2)'
//         },
//         ticks: {
//           maxRotation: 0,
//           maxTicksLimit: 8,
//           color: 'var(--text-secondary)',
//           font: {
//             size: 11
//           }
//         }
//       },
//       y: {
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)',
//           borderColor: 'rgba(255, 255, 255, 0.2)'
//         },
//         ticks: {
//           color: 'var(--text-secondary)',
//           font: {
//             size: 11
//           }
//         },
//         min: 0,
//         max: 100
//       }
//     },
//     plugins: {
//       legend: {
//         display: type === 'cpu',
//         position: 'top',
//         labels: {
//           padding: 20,
//           usePointStyle: true,
//           color: 'var(--text-primary)',
//           font: {
//             size: 12
//           }
//         }
//       },
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//         backgroundColor: 'var(--bg-primary)',
//         titleColor: 'var(--text-primary)',
//         bodyColor: 'var(--text-secondary)',
//         borderColor: 'var(--accent)',
//         borderWidth: 1,
//         padding: 10,
//         bodyFont: {
//           size: 12
//         },
//         titleFont: {
//           size: 13,
//           weight: 'bold'
//         },
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//               label += ': ';
//             }
//             if (context.parsed.y !== null) {
//               label += context.parsed.y.toFixed(1) + '%';
//               if (context.datasetIndex === 0) {
//                 if (type === 'memory') {
//                   const gbValue = (context.parsed.y * 16 / 100).toFixed(1);
//                   label += ` (${gbValue} GB)`;
//                 } else if (type === 'disk') {
//                   const gbValue = (context.parsed.y * 500 / 100).toFixed(1);
//                   label += ` (${gbValue} GB)`;
//                 }
//               }
//             }
//             return label;
//           }
//         }
//       }
//     }
//   };
  
//   return (
//     <div className="chart-container">
//       <Line
//         ref={chartRef}
//         data={{ labels, datasets }}
//         options={options}
//       />
//     </div>
//   );
// };

// export default MetricsChart;


import React, { useRef, useState, useEffect } from 'react';
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

const MetricsChart = ({ type, value }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const rawData  = value;



  const colors = [
    'rgb(0, 255, 157)',    // Green (accent)
    'rgb(255, 215, 0)',    // Yellow (warning)
    'rgb(255, 71, 87)',    // Red (danger)
    'rgb(0, 174, 255)'     // Blue
  ];

  useEffect(() => {
    const labels = [];
    const datasets = {};

    rawData.forEach(item => {
      labels.push(item.timestamp);

      if (type === 'cpu') {
        for (let i = 1; i <= 4; i++) {
          const cpuKey = `cpu${i}`;
          if (!datasets[cpuKey]) {
            datasets[cpuKey] = [];
          }
          datasets[cpuKey].push(item[cpuKey]);
        }
      } else {
        if (!datasets[type]) {
          datasets[type] = [];
        }
        datasets[type].push(parseFloat(item[type])); 
      }
    });

    const chartDatasets = type === 'cpu'
      ? Object.keys(datasets).map((key, i) => ({
          label: `Core ${i + 1}`,
          data: datasets[key],
          borderColor: colors[i],
          backgroundColor: colors[i],
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointRadius: 0
        }))
      : [{
          label: type.charAt(0).toUpperCase() + type.slice(1),
          data: datasets[type],
          borderColor: colors[0],
          backgroundColor: colors[0],
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointRadius: 0
        }];

    setChartData({ labels, datasets: chartDatasets });
  }, [rawData, type, colors]); // Agrega colors a las dependencias

  const options = { 
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    backgroundColor: 'var(--bg-secondary)',
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 8,
          color: 'var(--text-secondary)',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: 'var(--text-secondary)',
          font: {
            size: 11
          }
        },
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: type === 'cpu',
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: 'var(--text-primary)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'var(--bg-primary)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--accent)',
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + '%';
              if (context.datasetIndex === 0) {
                if (type === 'memory') {
                  const gbValue = (context.parsed.y * 16 / 100).toFixed(1);
                  label += ` (${gbValue} GB)`;
                } else if (type === 'disk') {
                  const gbValue = (context.parsed.y * 500 / 100).toFixed(1);
                  label += ` (${gbValue} GB)`;
                }
              }
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default MetricsChart;