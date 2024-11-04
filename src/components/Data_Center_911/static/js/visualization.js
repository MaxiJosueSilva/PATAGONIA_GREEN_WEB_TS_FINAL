class SensorVisualization {
    constructor() {
        this.sensors = ['S1', 'S2', 'S3'];
        this.temperatureColors = {
            cold: '#2196F3',
            normal: '#4CAF50',
            hot: '#F44336'
        };
        this.sensorPositions = {
            'S1': { x: 100, y: 90 },
            'S2': { x: 300, y: 190 },
            'S3': { x: 100, y: 290 }
        };
        this.sensorTemperatures = {
            'S1': 20,
            'S2': 20,
            'S3': 20
        };
        this.sensorHumidities = {
            'S1': 45,
            'S2': 45,
            'S3': 45
        };
        this.predictions = {};
        this.heatMapCells = [];
        this.config = {
            visibility: {
                'S1': true,
                'S2': true,
                'S3': true,
                'heatmap': true
            }
        };
        
        this.setupHeatMap();
        this.setupOverlay();
        
        socket.on('prediction_update', (data) => {
            this.predictions = data;
            this.updatePredictions();
            this.updateHeatMap();
        });

        socket.on('config_update', (config) => {
            this.config = config;
            this.updateHeatMap();
        });
    }

    setupHeatMap() {
        const svg = document.getElementById('sensorGrid');
        const heatMapGroup = document.getElementById('heatMapGrid');
        if (!svg || !heatMapGroup) return;

        while (heatMapGroup.firstChild) {
            heatMapGroup.removeChild(heatMapGroup.firstChild);
        }
        this.heatMapCells = [];

        const cellSize = 20;
        const gridWidth = Math.floor(400 / cellSize);
        const gridHeight = Math.floor(400 / cellSize);

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                cell.setAttribute("x", x * cellSize);
                cell.setAttribute("y", y * cellSize);
                cell.setAttribute("width", cellSize);
                cell.setAttribute("height", cellSize);
                cell.setAttribute("fill", "rgba(0, 0, 0, 0.1)");
                cell.setAttribute("class", "heat-map-cell");
                
                this.heatMapCells.push({
                    element: cell,
                    x: x * cellSize + cellSize/2,
                    y: y * cellSize + cellSize/2
                });
                
                heatMapGroup.appendChild(cell);
            }
        }
        
        this.updateHeatMap();
    }

    updateHeatMapVisibility(visible) {
        const heatMapGroup = document.getElementById('heatMapGrid');
        if (heatMapGroup) {
            heatMapGroup.style.display = visible ? 'block' : 'none';
        }
        this.config.visibility.heatmap = visible;
    }

    updateHeatMap() {
        if (!this.config.visibility.heatmap) return;

        for (const cell of this.heatMapCells) {
            const interpolatedTemp = this.getInterpolatedTemperature(cell.x, cell.y);
            const color = this.getTemperatureColor(interpolatedTemp);
            cell.element.setAttribute("fill", color);
            cell.element.setAttribute("opacity", "0.3");
        }
    }

    setupOverlay() {
        try {
            const svg = document.getElementById('sensorGrid');
            if (!svg) return;

            const indicator = document.createElementNS("http://www.w3.org/2000/svg", "g");
            indicator.setAttribute("id", "tempIndicator");
            indicator.style.display = "none";
            
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", "3");
            circle.setAttribute("fill", "white");
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", "10");
            text.setAttribute("y", "0");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "12px");
            
            indicator.appendChild(circle);
            indicator.appendChild(text);
            svg.appendChild(indicator);
        } catch (error) {
            console.error('Error setting up overlay:', error);
        }
    }

    animateValue(element, start, end, duration = 500, isHumidity = false) {
        if (!element) return;
        
        start = Number(start) || 0;
        end = Number(end);
        
        if (isNaN(end)) {
            console.warn('Invalid end value for animation');
            return;
        }
        
        const range = end - start;
        const startTime = performance.now();
        
        element.classList.add('updating');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = start + (range * easeOutCubic);
            
            element.textContent = isHumidity ? Math.round(current) : current.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.classList.remove('updating');
            }
        };
        
        requestAnimationFrame(animate);
    }

    getTrendColor(trend, confidence) {
        const rising = [76, 175, 80];
        const falling = [244, 67, 54];
        const neutral = [255, 193, 7];

        let color;
        if (Math.abs(trend) < 0.05) {
            color = neutral;
        } else {
            color = trend > 0 ? rising : falling;
        }

        return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${confidence})`;
    }

    updateSensorColor(sensorId, temperature) {
        const sensor = document.getElementById(sensorId);
        if (!sensor) {
            console.warn(`Sensor element ${sensorId} not found`);
            return;
        }

        let color;
        if (temperature < 20) {
            color = this.temperatureColors.cold;
        } else if (temperature > 25) {
            color = this.temperatureColors.hot;
        } else {
            color = this.temperatureColors.normal;
        }
        
        const tempDiff = Math.abs(this.sensorTemperatures[sensorId] - temperature);
        if (tempDiff > 0.5) {
            sensor.style.transform = 'scale(1.1)';
            setTimeout(() => {
                sensor.style.transform = 'scale(1)';
            }, 300);
        }
        
        sensor.style.fill = color;
        this.sensorTemperatures[sensorId] = temperature;
        this.updateHeatMap();
    }

    updatePredictions() {
        for (const [sensorId, data] of Object.entries(this.predictions)) {
            const trendElement = document.getElementById(`${sensorId}-trend`);
            const predictionElement = document.getElementById(`${sensorId}-prediction`);
            const predictionContainer = document.getElementById(`${sensorId}-prediction-container`);
            
            if (trendElement && predictionElement && predictionContainer) {
                const trendValue = data.trend;
                const trendIcon = Math.abs(trendValue) < 0.05 ? '→' : 
                                trendValue > 0 ? '↑' : '↓';
                
                trendElement.classList.add('updating');
                trendElement.textContent = trendIcon;
                trendElement.style.color = this.getTrendColor(trendValue, data.confidence);
                setTimeout(() => trendElement.classList.remove('updating'), 300);
                
                const diffFromCurrent = (data.prediction - data.current).toFixed(1);
                const sign = diffFromCurrent > 0 ? '+' : '';
                predictionElement.textContent = `${data.prediction.toFixed(1)}°C (${sign}${diffFromCurrent}°C)`;
                
                const confidencePercent = (data.confidence * 100).toFixed(0);
                predictionContainer.title = `Prediction confidence: ${confidencePercent}%`;
                predictionContainer.style.opacity = 0.5 + (data.confidence * 0.5);
            }
        }
    }

    updateReadings(sensorId, data) {
        const tempElement = document.getElementById(`${sensorId}-temp`);
        const humidityElement = document.getElementById(`${sensorId}-humidity`);

        if (!tempElement || !humidityElement) {
            console.warn(`Missing DOM elements for sensor ${sensorId}`);
            return;
        }

        try {
            const newTemp = Number(data.temp);
            if (!isNaN(newTemp)) {
                this.animateValue(tempElement, this.sensorTemperatures[sensorId], newTemp);
                this.updateSensorColor(sensorId, newTemp);
            }
            
            const newHumidity = Number(data.humidity);
            if (!isNaN(newHumidity)) {
                const currentHumidity = Number(this.sensorHumidities[sensorId]) || 45;
                this.animateValue(humidityElement, currentHumidity, newHumidity, 500, true);
                this.sensorHumidities[sensorId] = newHumidity;
            }
        } catch (error) {
            console.error(`Error updating readings for sensor ${sensorId}:`, error);
        }
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    getInterpolatedTemperature(x, y) {
        let weightedSum = 0;
        let weightSum = 0;

        for (const sensorId of this.sensors) {
            if (!this.config?.visibility?.[sensorId]) continue;
            
            const pos = this.sensorPositions[sensorId];
            const temp = this.sensorTemperatures[sensorId];
            const distance = this.getDistance(x, y, pos.x, pos.y);
            
            const weight = distance < 1 ? 1000 : 1 / (distance * distance);
            weightedSum += temp * weight;
            weightSum += weight;
        }

        return weightedSum / weightSum;
    }

    getTemperatureColor(temperature) {
        const cold = [33, 150, 243];
        const normal = [76, 175, 80];
        const hot = [244, 67, 54];
        
        let color;
        if (temperature <= 20) {
            color = cold;
        } else if (temperature >= 25) {
            color = hot;
        } else {
            const t = (temperature - 20) / 5;
            if (t <= 0.5) {
                const factor = t * 2;
                color = cold.map((c, i) => Math.round(c + (normal[i] - c) * factor));
            } else {
                const factor = (t - 0.5) * 2;
                color = normal.map((c, i) => Math.round(c + (hot[i] - c) * factor));
            }
        }
        
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }

    interpolateTemperature(event) {
        try {
            const svg = document.getElementById('sensorGrid');
            const indicator = document.getElementById('tempIndicator');
            
            if (!svg || !indicator) {
                console.warn('SVG or indicator element not found');
                return;
            }

            const pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

            const interpolatedTemp = this.getInterpolatedTemperature(svgP.x, svgP.y);
            
            indicator.style.display = 'block';
            indicator.setAttribute('transform', `translate(${svgP.x}, ${svgP.y})`);
            indicator.querySelector('text').textContent = `${interpolatedTemp.toFixed(1)}°C`;
        } catch (error) {
            console.error('Error in temperature interpolation:', error);
        }
    }

    hideInterpolation() {
        const indicator = document.getElementById('tempIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
}

const visualization = new SensorVisualization();

const sensorGrid = document.getElementById('sensorGrid');
if (sensorGrid) {
    sensorGrid.addEventListener('mousemove', (e) => {
        visualization.interpolateTemperature(e);
    });
    sensorGrid.addEventListener('mouseleave', () => {
        visualization.hideInterpolation();
    });
}