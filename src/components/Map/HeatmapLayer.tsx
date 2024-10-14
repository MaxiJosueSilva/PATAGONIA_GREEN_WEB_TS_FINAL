import React, { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

declare module 'leaflet' {
  function heatLayer(latlngs: L.LatLngExpression[], options?: L.HeatMapOptions): L.Layer;
}

interface HeatmapLayerProps {
  points: number[][];
  options?: L.HeatMapOptions;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points, options }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatLayer = L.heatLayer(points, options);
    map.addLayer(heatLayer);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
};

export default HeatmapLayer;