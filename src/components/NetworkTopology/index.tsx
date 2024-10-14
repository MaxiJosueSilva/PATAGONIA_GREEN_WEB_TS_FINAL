import React from 'react';
import styled from 'styled-components';
import Canvas from './Canvas';
import { nodeData, addLinks } from './data';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 91vh;
  width: 100vw;
`;

const Content = styled.div`
  width: 80%;
  height: auto;
  border-radius: 5px;
`;

const NetworkTopology: React.FC = () => {
  return (
    <Container>
      <Content>
        <Canvas nodeData={nodeData} addLinks={addLinks} />
      </Content>
    </Container>
  );
};

export default NetworkTopology;