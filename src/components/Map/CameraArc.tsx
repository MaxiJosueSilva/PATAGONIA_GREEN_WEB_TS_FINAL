import React from 'react';
import { Circle, Polygon } from 'react-leaflet';

interface CameraArcProps {
  camera: any;
}

const CameraArc: React.FC<CameraArcProps> = ({ camera }) => {
  if (!camera.arc) return null;

  const { ranges, pan, fov, color, weight, fillOpacity } = camera.arc;
  const { lat, lon } = camera;

  const createArcPolygon = (range: number) => {
    const points = [];
    const startAngle = pan - fov / 2;
    const endAngle = pan + fov / 2;
    for (let angle = startAngle; angle <= endAngle; angle += 5) {
      const radian = angle * (Math.PI / 180);
      const x = lon + (range / 111320) * Math.cos(radian);
      const y = lat + (range / 111320) * Math.sin(radian);
      points.push([y, x]);
    }
    points.push([lat, lon]);
    return points;
  };

  return (
    <>
      {ranges.map((range, index) => (
        <Polygon
          key={`arc-${camera.idCamara}-${index}`}
          positions={createArcPolygon(range)}
          pathOptions={{
            color: color,
            weight: weight,
            fillOpacity: fillOpacity / (index + 1),
          }}
        />
      ))}
      <Circle
        center={[lat, lon]}
        radius={5}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 1,
        }}
      />
    </>
  );
};

export default CameraArc;