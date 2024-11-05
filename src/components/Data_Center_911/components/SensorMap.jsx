// import React, { useRef, useEffect, useState } from 'react';
// import styled from '@emotion/styled';
// import { getTemperatureColor, interpolateTemperature } from '../utils/sensorData';
// import { svgBackground } from '../utils/svgBackground';

// const MapContainer = styled.div`
//   width: 100%;
//   background-color: #1E1E1E;
//   border-radius: 8px;
//   overflow: hidden;
//   margin: 20px 0;
//   position: relative;
// `;

// function SensorMap({ sensorData, settings }) {
//   const mapRef = useRef(null);
//   const [zoom, setZoom] = useState(1);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });

//   const handleWheel = (e) => {
//     e.preventDefault();
//     const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
//     const newZoom = Math.min(Math.max(zoom * scaleAmount, 0.5), 3);
    
//     // Get mouse position relative to SVG
//     const svgRect = mapRef.current.getBoundingClientRect();
//     const mouseX = e.clientX - svgRect.left;
//     const mouseY = e.clientY - svgRect.top;
    
//     // Calculate new offset to keep mouse position fixed
//     const newOffset = {
//       x: mouseX - (mouseX - offset.x) * (newZoom / zoom),
//       y: mouseY - (mouseY - offset.y) * (newZoom / zoom)
//     };
    
//     setZoom(newZoom);
//     setOffset(newOffset);
//   };

//   useEffect(() => {
//     const svg = mapRef.current;
//     svg.addEventListener('wheel', handleWheel);
//     return () => svg.removeEventListener('wheel', handleWheel);
//   }, [zoom, offset]);

//   useEffect(() => {
//     const updateSensorPosition = (sensorId, x, y) => {
//       console.log(`Sensor ${sensorId} moved to (${x}, ${y})`);
//     };

//     const sensors = mapRef.current?.querySelectorAll('.sensor');
//     sensors?.forEach(sensor => {
//       let isDragging = false;
//       let currentX, currentY, initialX, initialY;

//       sensor.addEventListener('mousedown', e => {
//         isDragging = true;
//         const transform = new DOMMatrix(window.getComputedStyle(sensor).transform);
//         currentX = transform.e;
//         currentY = transform.f;
//         initialX = e.clientX;
//         initialY = e.clientY;
//         sensor.style.cursor = 'grabbing';
//       });

//       document.addEventListener('mousemove', e => {
//         if (!isDragging) return;
//         e.preventDefault();
        
//         const dx = e.clientX - initialX;
//         const dy = e.clientY - initialY;
        
//         sensor.setAttribute('transform', 
//           `translate(${currentX + dx},${currentY + dy})`);
//       });

//       document.addEventListener('mouseup', () => {
//         if (isDragging) {
//           sensor.style.cursor = 'move';
//           isDragging = false;
//         }
//       });
//     });
//   }, [sensorData]);

//   // Create background content without SVG wrapper tags
//   const backgroundContent = svgBackground
//     .replace(/<svg[^>]*>/, '')
//     .replace(/<\/svg>/, '');

//   return (
//     <MapContainer>
//       <svg
//         ref={mapRef}
//         width="800"
//         height="600"
//         viewBox="0 0 210 297"
//         style={{ 
//           display: 'block', 
//           margin: 'auto',
//           maxWidth: '100%',
//           height: 'auto'
//         }}
//       >
//         <defs>
//           <style>
//             {`
//               .sensor-circle { cursor: move; }
//               text { fill: white; }
//               .background-layer { transform-origin: center; }
//               .background-layer rect { stroke-width: 0.5; }
//             `}
//           </style>
//         </defs>
        
//         {/* Content container with zoom and pan transformation */}
//         <g transform={`translate(${offset.x},${offset.y}) scale(${zoom})`}>
//           {/* SVG Background */}
//           <g 
//             className="background-layer"
//             transform="translate(0,0)"
//             dangerouslySetInnerHTML={{ __html: backgroundContent }}
//           />
          
//           {/* Heat map layer */}
//           {settings.showHeatMap && (
//             <g className="heat-map-layer">
//               {Array.from({ length: 20 }, (_, i) =>
//                 Array.from({ length: 20 }, (_, j) => {
//                   const x = (j * 210) / 20;
//                   const y = (i * 297) / 20;
//                   const temp = interpolateTemperature(x/210, y/297, sensorData);
//                   return (
//                     <rect
//                       key={`${i}-${j}`}
//                       x={x}
//                       y={y}
//                       width={210/20}
//                       height={297/20}
//                       fill={getTemperatureColor(temp, [settings.tempLow, settings.tempHigh])}
//                       opacity="0.3"
//                     />
//                   );
//                 })
//               ).flat()}
//             </g>
//           )}
          
//           {/* Sensors layer */}
//           <g className="sensors-layer">
//             {Object.entries(sensorData.data).map(([sensorId, metadata]) => {
//               const x = metadata.x * 210;
//               const y = metadata.y * 297;
//               const temperature = metadata; // Supongo que es la temperatura de `seriesData`
//               const color = getTemperatureColor(temperature, [settings.tempLow, settings.tempHigh]);
              
              
//               return (
//                 <g key={sensorId} className="sensor" transform={`translate(${x},${y})`}>
//                   <circle
//                     cx="0"
//                     cy="0"
//                     r="5"
//                     fill={color}
//                     fillOpacity="0.8"
//                     stroke="white"
//                     strokeWidth="1"
//                     className="sensor-circle"
//                   />
//                   <text x="0" y="0" textAnchor="middle" dy=".3em" fontSize="6">
//                     {sensorId}
//                   </text>
//                   <text x="0" y="8" textAnchor="middle" fontSize="5">
//                     {metadata.temperature ? 
//                       `${metadata.temperature.toFixed(1)}°C` : 
//                       'Sin datos'}
//                   </text>
//                 </g>
//               );
//             })}
//           </g>
//         </g>
//       </svg>
//     </MapContainer>
//   );
// }

// export default SensorMap;


import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { getTemperatureColor, interpolateTemperature } from '../utils/sensorData';
import { svgBackground } from '../utils/svgBackground';

const MapContainer = styled.div`
  width: 100%;
  background-color: #1E1E1E;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  position: relative;
`;

function SensorMap({ sensorData, settings }) {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Estado para almacenar la posición de cada sensor
  const [sensorPositions, setSensorPositions] = useState(() => {
    const savedPositions = localStorage.getItem('sensorPositions');
    return savedPositions ? JSON.parse(savedPositions) : 
      Object.fromEntries(
        Object.entries(sensorData.data).map(([id, { x, y }]) => [id, { x, y }])
      );
  });

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * scaleAmount, 0.5), 3);
    
    // Obtener posición del mouse en relación al SVG
    const svgRect = mapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // Calcular nuevo offset para mantener fija la posición del mouse
    const newOffset = {
      x: mouseX - (mouseX - offset.x) * (newZoom / zoom),
      y: mouseY - (mouseY - offset.y) * (newZoom / zoom)
    };
    
    setZoom(newZoom);
    setOffset(newOffset);
  };

  useEffect(() => {
    const svg = mapRef.current;
    svg.addEventListener('wheel', handleWheel);
    return () => svg.removeEventListener('wheel', handleWheel);
  }, [zoom, offset]);

  const handleMouseDown = (e, sensorId) => {
    e.stopPropagation();
    const svgRect = mapRef.current.getBoundingClientRect();

    let initialX = e.clientX;
    let initialY = e.clientY;
    let startX = sensorPositions[sensorId].x;
    let startY = sensorPositions[sensorId].y;

    const handleMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - initialX) / (210 * zoom);
      const dy = (moveEvent.clientY - initialY) / (297 * zoom);
      
      // Calcular nuevas posiciones con el zoom aplicado
      const newX = startX + dx;
      const newY = startY + dy;

      setSensorPositions((prevPositions) => ({
        ...prevPositions,
        [sensorId]: { x: newX, y: newY }
      }));
    };

    const handleMouseUp = () => {
      localStorage.setItem('sensorPositions', JSON.stringify(sensorPositions));
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Crear contenido del fondo sin etiquetas SVG
  const backgroundContent = svgBackground
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '');

  return (
    <MapContainer>
      <svg
        ref={mapRef}
        width="800"
        height="600"
        viewBox="0 0 210 297"
        style={{ 
          display: 'block', 
          margin: 'auto',
          maxWidth: '100%',
          height: 'auto'
        }}
      >
        <defs>
          <style>
            {`
              .sensor-circle { cursor: move; }
              text { fill: white; }
              .background-layer { transform-origin: center; }
              .background-layer rect { stroke-width: 0.5; }
            `}
          </style>
        </defs>
        
        {/* Contenedor para transformación de zoom y desplazamiento */}
        <g transform={`translate(${offset.x},${offset.y}) scale(${zoom})`}>
          {/* Fondo SVG */}
          <g 
            className="background-layer"
            transform="translate(0,0)"
            dangerouslySetInnerHTML={{ __html: backgroundContent }}
          />
          
          {/* Capa de calor */}
          {settings.showHeatMap && (
            <g className="heat-map-layer">
              {Array.from({ length: 20 }, (_, i) =>
                Array.from({ length: 20 }, (_, j) => {
                  const x = (j * 210) / 20;
                  const y = (i * 297) / 20;
                  const temp = interpolateTemperature(x / 210, y / 297, sensorData);
                  return (
                    <rect
                      key={`${i}-${j}`}
                      x={x}
                      y={y}
                      width={210 / 20}
                      height={297 / 20}
                      fill={getTemperatureColor(temp, [settings.tempLow, settings.tempHigh])}
                      opacity="0.3"
                    />
                  );
                })
              ).flat()}
            </g>
          )}
          
          {/* Capa de sensores */}
          <g className="sensors-layer">
            
            {Object.entries(sensorData[0].data).map(([sensorId, metadata]) => {
              if (sensorId < 3) {
                const position = sensorPositions[sensorId];
                const x = position.x * 210;
                const y = position.y * 297;
                const label = parseInt(sensorId) + 1;
                const temperature = metadata[sensorData[0].data.length - 1].y;
                const color = getTemperatureColor(temperature, [settings.tempLow, settings.tempHigh]);
                
                return (
                  <g
                    key={sensorId}
                    className="sensor"
                    transform={`translate(${x},${y})`}
                    data-sensor-id={sensorId}
                    onMouseDown={(e) => handleMouseDown(e, sensorId)}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="5"
                      fill={color}
                      fillOpacity="0.8"
                      stroke="white"
                      strokeWidth="1"
                      className="sensor-circle"
                    />
                    <text x="0" y="0" textAnchor="middle" dy=".3em" fontSize="6">
                      {label} 
                    </text>
                    <text x="0" y="8" textAnchor="middle" fontSize="5">
                      {temperature ? 
                        `${temperature.toFixed(1)}°C` : 
                        'Sin datos'}
                    </text>
                  </g>
                );
              }
            })}
          </g>
        </g>
      </svg>
    </MapContainer>
  );
}

export default SensorMap;
