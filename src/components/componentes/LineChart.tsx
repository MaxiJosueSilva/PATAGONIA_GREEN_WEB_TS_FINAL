import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import styled from 'styled-components';

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  padding: 20px;
`;

const StyledChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface LineChartProps {
  chartData: { x: number; y: number }[][];
  seriesLabels: string[];
  unit?: 'minute' | 'hour' | 'day';
}

const LineChart: React.FC<LineChartProps> = ({ chartData, seriesLabels, unit = 'minute' }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: { unit: unit },
        displayFormats: {
          minute: 'HH:mm'
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

  const dataset = seriesLabels.map((label, index) => ({
    label,
    data: chartData[index].map(point => ({ x: point.x, y: point.y })),
    fill: true,
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: '#4bc0c0',
    borderWidth: 0.5,
    pointRadius: 0.5,
    lineTension: 0.3,
  }));

  return (
    <ChartContainer>
      <StyledChartWrapper>
        <Line data={{ datasets: dataset }} options={chartOptions} />
      </StyledChartWrapper>
    </ChartContainer>
  );
};

export default LineChart;