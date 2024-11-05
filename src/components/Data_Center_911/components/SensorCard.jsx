// import React from 'react';
// import styled from '@emotion/styled';

// // Definir estilos con Emotion
// const Card = styled.div`
//   background-color: var(--sidebar-color);
//   padding: 20px;
//   border-radius: 8px;
//   color: var(--text-color);
// `;

// const Metric = styled.div`
//   margin: 15px 0;
// `;

// const MetricValue = styled.div`
//   font-size: 1.5em;
//   font-weight: bold;
//   display: flex;
//   align-items: center;
//   gap: 10px;
// `;

// const Change = styled.span`
//   font-size: 0.8em;
//   color: ${props => props.value > 0 ? '#4CAF50' : props.value < 0 ? '#F44336' : '#888'};
// `;

// // Función utilitaria para calcular el último valor o promedio de una serie de datos
// const getLatestValue = (data) => {
//   if (data.length === 0) return null;
//   return data[data.length - 1]?.y; // Último valor `y` de la serie
// };

// // Función utilitaria para calcular promedio de los valores `y`
// const getAverageValue = (data) => {
//   if (data.length === 0) return null;
//   const sum = data.reduce((acc, point) => acc + point.y, 0);
//   return (sum / data.length).toFixed(2); // Redondear a 2 decimales
// };

// function SensorCard({ sensorId, metadata = {}, data = [] }) {
//   // Obtener el valor más reciente de la serie de datos
//   const latestValue = getLatestValue(data);
//   // También puedes calcular el promedio si es necesario
//   const averageValue = getAverageValue(data);

//   return (
//     <Card>
//       <h3>Sensor {sensorId}</h3>

//       {/* Mostrar el último valor medido */}
//       <Metric>
//         Última Lectura: 
//         <MetricValue>{latestValue !== null ? `${latestValue}°C` : 'N/A'}</MetricValue>
//       </Metric>

//       {/* Mostrar el promedio de las lecturas */}
//       <Metric>
//         Promedio:
//         <MetricValue>{averageValue !== null ? `${averageValue}°C` : 'N/A'}</MetricValue>
//       </Metric>

//       {/* Aquí podrías agregar más métricas según los datos que necesites */}
//       {metadata?.is_active && (
//         <Metric>
//           Estado: <MetricValue>Activo</MetricValue>
//         </Metric>
//       )}
//     </Card>
//   );
// }

// export default SensorCard;
import React from 'react';
import styled from '@emotion/styled';

// Definir estilos con Emotion
const Card = styled.div`
  background-color: var(--sidebar-color);
  padding: 20px;
  border-radius: 8px;
  color: var(--text-color);
`;

const Metric = styled.div`
  margin: 15px 0;
`;

const MetricValue = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Change = styled.span`
  font-size: 0.8em;
  color: ${props => props.value > 0 ? '#4CAF50' : props.value < 0 ? '#F44336' : '#888'};
`;

// Función utilitaria para obtener el último valor de una métrica específica de un sensor
const getLatestValue = (data, key) => {
  if (data.length === 0) return null;
  return data[data.length - 1]?.[key]; // Último valor de `key` en la serie
};

// Función para calcular el promedio de valores de una métrica específica (temperature o humidity)
const getAverageValue = (data, key) => {
  if (data.length === 0) return null;
  const sum = data.reduce((acc, point) => acc + point[key], 0);
  return (sum / data.length).toFixed(2); // Redondear a 2 decimales
};

// Función para calcular una predicción (utiliza los últimos valores para calcular la tendencia)
const getPrediction = (data, key) => {
  if (data.length < 2) return null; // Necesitamos al menos dos puntos para predecir
  const recentValues = data.slice(-5); // Tomar los últimos 5 valores para el cálculo
  const trend = recentValues.reduce((acc, point, idx, arr) => {
    if (idx === 0) return acc;
    return acc + (point[key] - arr[idx - 1][key]);
  }, 0) / (recentValues.length - 1);
  
  // Estimar el siguiente valor con la tendencia calculada
  return (getLatestValue(data, key) + trend).toFixed(2);
};

function SensorCard({ sensorId, temperatureData, humidityData }) {
  // Obtener el valor más reciente de temperatura y humedad para el sensor específico
  const latestTemperature = getLatestValue(temperatureData, 'y');
  const latestHumidity = getLatestValue(humidityData, 'y');

  // Calcular el promedio de temperatura y humedad para el sensor específico
  const averageTemperature = getAverageValue(temperatureData, 'y');
  const averageHumidity = getAverageValue(humidityData, 'y');

  // Calcular la predicción de temperatura y humedad para el sensor específico
  const predictedTemperature = getPrediction(temperatureData, 'y');
  const predictedHumidity = getPrediction(humidityData, 'y');

  return (
    <Card>
      <h3>Sensor {sensorId}</h3>

      {/* Última lectura de temperatura */}
      <Metric>
        Última Temperatura:
        <MetricValue>{latestTemperature !== null ? `${latestTemperature}°C` : 'N/A'}</MetricValue>
      </Metric>

      {/* Última lectura de humedad */}
      <Metric>
        Última Humedad:
        <MetricValue>{latestHumidity !== null ? `${latestHumidity}%` : 'N/A'}</MetricValue>
      </Metric>

      {/* Promedio de temperatura */}
      <Metric>
        Promedio Temperatura:
        <MetricValue>{averageTemperature !== null ? `${averageTemperature}°C` : 'N/A'}</MetricValue>
      </Metric>

      {/* Promedio de humedad */}
      <Metric>
        Promedio Humedad:
        <MetricValue>{averageHumidity !== null ? `${averageHumidity}%` : 'N/A'}</MetricValue>
      </Metric>

      {/* Predicción de temperatura */}
      <Metric>
        Predicción Temperatura:
        <MetricValue>{predictedTemperature !== null ? `${predictedTemperature}°C` : 'N/A'}</MetricValue>
      </Metric>

      {/* Predicción de humedad */}
      <Metric>
        Predicción Humedad:
        <MetricValue>{predictedHumidity !== null ? `${predictedHumidity}%` : 'N/A'}</MetricValue>
      </Metric>
    </Card>
  );
}

export default SensorCard;