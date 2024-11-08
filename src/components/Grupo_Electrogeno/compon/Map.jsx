import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { fetchGenerators } from '../store/generatorSlice';
import 'leaflet/dist/leaflet.css';

function Map({ onNodeSelect }) {
  const dispatch = useDispatch();
  const generators = useSelector(state => state.generators.list);
  const status = useSelector(state => state.generators.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGenerators());
    }
  }, [status, dispatch]);

  return (
    <MapContainer
      center={[-31.751049, -60.485658]}
      zoom={13}
      style={{ height: '90vh', width: '100%' }}
    >
      <TileLayer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        maxZoom={19}
      />
      {generators.map(gen => (
        <Circle
          key={gen.name}
          center={[gen.lat, gen.lon]}
          radius={gen.radius}
          pathOptions={{
            color: gen.iconColor,
            fillColor: gen.fillColor,
            fillOpacity: gen.fillOpacity
          }}
          eventHandlers={{
            click: () => onNodeSelect(gen.name)
          }}
        >
          <Marker 
            position={[gen.lat, gen.lon]} 
            icon={divIcon({
              html: `<span style="color: ${gen.iconColor}"><i class="fa fa-bullseye"></i></span>`,
              className: 'fa-marker'
            })} 
          />
        </Circle>
      ))}
    </MapContainer>
  );
}

export default Map;
