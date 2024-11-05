export function getTemperatureColor(temp, thresholds) {
  if (temp === null) {
    return '#808080';  // Grey for inactive sensors
  }
  if (temp < thresholds[0]) {
    return '#0000FF';  // Blue for cold
  }
  if (temp > thresholds[1]) {
    return '#FF0000';  // Red for hot
  }
  // Calculate color gradient between blue and red
  const ratio = (temp - thresholds[0]) / (thresholds[1] - thresholds[0]);
  return `rgb(${Math.floor(255 * ratio)},0,${Math.floor(255 * (1 - ratio))})`;
}

export function interpolateTemperature(x, y, sensorData) {
  let totalWeight = 0;
  let weightedTemp = 0;
  
  Object.entries(sensorData[1].data).forEach(([_, sensor]) => {
    if (sensor.y !== null) {
      const dx = x - sensor.x;
      const dy = y - sensor.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      const weight = 1 / (distance + 0.1);  // Avoid division by zero
      
      totalWeight += weight;
      weightedTemp += sensor.y * weight;
    }
  });
  
  return totalWeight > 0 ? weightedTemp / totalWeight : null;
}

export function getTrendStats(data) {
  const values = data
    .map(point => point.y)
    .filter(value => value !== null);

  if (values.length === 0) {
    return {
      min: null,
      max: null,
      mean: null,
      std: null
    };
  }

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const squareDiffs = values.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: mean,
    std: Math.sqrt(avgSquareDiff)
  };
}

export function generateSensorData(previousData = null) {
  const currentTimestamp = Date.now();
  
  if (!previousData) {
    // Initialize with default data structure
    return {
      metadata: {
        S1: {
          x: 0.3,
          y: 0.3,
          temperature: 23.5,
          humidity: 45,
          temp_change: 0,
          humid_change: 0,
          status: { is_active: true }
        },
        S2: {
          x: 0.7,
          y: 0.3,
          temperature: 22.8,
          humidity: 50,
          temp_change: 0,
          humid_change: 0,
          status: { is_active: true }
        },
        S3: {
          x: 0.5,
          y: 0.7,
          temperature: 24.7,
          humidity: 55,
          temp_change: 0,
          humid_change: 0,
          status: { is_active: true }
        }
      },
      data: [
        [{ x: currentTimestamp, y: 23.5 }],
        [{ x: currentTimestamp, y: 22.8 }],
        [{ x: currentTimestamp, y: 24.7 }]
      ]
    };
  }

  // Update existing data
  const newData = JSON.parse(JSON.stringify(previousData));
  
  Object.keys(newData.metadata).forEach((sensorId, index) => {
    const metadata = newData.metadata[sensorId];
    
    let newTemp, prevTemp, newHumidity, prevHumidity;
    
    if (index === 0) { // Sensor 1: 23.5-23.7°C
      prevTemp = metadata.temperature;
      newTemp = 23.5 + Math.random() * 0.2;
    } else if (index === 1) { // Sensor 2: 22.8-23.0°C
      prevTemp = metadata.temperature;
      newTemp = 22.8 + Math.random() * 0.2;
    } else { // Sensor 3: 24.7-24.8°C
      prevTemp = metadata.temperature;
      newTemp = 24.7 + Math.random() * 0.1;
    }
    
    prevHumidity = metadata.humidity;
    newHumidity = prevHumidity + (Math.random() * 2 - 1); // Adjust humidity within ±1%
    newHumidity = Math.max(40, Math.min(60, newHumidity)); // Keep within 40-60% range
    
    metadata.temperature = newTemp;
    metadata.humidity = newHumidity;
    metadata.temp_change = newTemp - prevTemp;
    metadata.humid_change = newHumidity - prevHumidity;
    metadata.status.is_active = true;
    
    newData.data[index].push({ x: currentTimestamp, y: newTemp });
    
    // Keep only last 30 points
    if (newData.data[index].length > 30) {
      newData.data[index].shift();
    }
  });

  return newData;
}
