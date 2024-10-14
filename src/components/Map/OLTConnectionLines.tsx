import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';

interface OLTConnectionLinesProps {
  camaras: any[];
}

const OLTConnectionLines: React.FC<OLTConnectionLinesProps> = ({ camaras }) => {
  const oltPositions: { [key: string]: [number, number] } = {
    'OLT 1': [-31.7333, -60.5233], // Posición ejemplo, ajustar según sea necesario
    'OLT 2': [-31.7433, -60.5333], // Posición ejemplo, ajustar según sea necesario
    'OLT 3': [-31.7533, -60.5433], // Posición ejemplo, ajustar según sea necesario
    'OLT 4': [-31.7633, -60.5533], // Posición ejemplo, ajustar según sea necesario
  };

  return (
    <>
      {camaras.map(camara => {
        if (!camara.olt || !oltPositions[camara.olt]) return null;

        const oltPosition = oltPositions[camara.olt];
        const cameraPosition: [number, number] = [camara.lat, camara.lon];

        return (
          <Polyline
            key={`olt-connection-${camara.idCamara}`}
            positions={[oltPosition, cameraPosition]}
            color="purple"
            weight={2}
            opacity={0.5}
            dashArray="5, 5"
          >
            <Tooltip permanent>
              {camara.olt} - {camara.name}
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
};

export default OLTConnectionLines;