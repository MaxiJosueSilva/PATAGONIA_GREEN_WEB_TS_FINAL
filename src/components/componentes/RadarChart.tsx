import React from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import styled from 'styled-components';

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
`;

const StyledChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 300px;
`;

interface RadarChartProps {
  chartData: { y: number }[][];
  seriesLabels: string[];
}

const RadarChart: React.FC<RadarChartProps> = ({ chartData, seriesLabels }) => {
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  const dataset = {
    labels: seriesLabels,
    datasets: [
      {
        label: 'Últimos valores',
        data: chartData.map((series) => series[series.length - 1].y),
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 0.5,
        pointRadius: 0.5,
      },
    ],
  };

  return (
    <ChartContainer>
      <StyledChartWrapper>
        <Radar data={dataset} options={radarOptions} />
      </StyledChartWrapper>
    </ChartContainer>
  );
};

export default RadarChart;