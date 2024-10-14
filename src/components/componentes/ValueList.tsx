import React from 'react';
import styled from 'styled-components';

const StyledList = styled.ul`
  list-style-type: none;
  padding: 5px;
  min-width: 200px;
`;

const StyledListItem = styled.li<{ value: number }>`
  color: ${(props) => (props.value === 0 ? 'red' : 'white')};
  margin: 5px 0;
`;

interface ValueListProps {
  chartData: {
    series: string[];
    data: { y: number }[][];
  };
}

const ValueList: React.FC<ValueListProps> = ({ chartData }) => {
  return (
    <StyledList>
      {chartData.series.map((label, index) => {
        const lastValue = chartData.data[index][chartData.data[index].length - 1].y;
        return (
          <StyledListItem key={index} value={lastValue}>
            {label}: {lastValue}
          </StyledListItem>
        );
      })}
    </StyledList>
  );
};

export default ValueList;