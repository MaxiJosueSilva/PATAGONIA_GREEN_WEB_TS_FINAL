class SensorConfig {
    constructor() {
        this.config = {
            positions: {
                S1: { x: 100, y: 90 },
                S2: { x: 300, y: 190 },
                S3: { x: 100, y: 290 }
            },
            ranges: {
                cold: 20,
                hot: 25
            },
            updateInterval: 2,
            enableAnimations: true,
            visibility: {
                S1: true,
                S2: true,
                S3: true,
                heatmap: true
            }
        };

        this.initializeEventListeners();
        this.loadConfig();
    }

    initializeEventListeners() {
        // Position sliders
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const sensor = e.target.dataset.sensor;
                const axis = e.target.dataset.axis;
                this.updateSensorPosition(sensor, axis, e.target.value);
            });
        });

        // Temperature ranges
        document.getElementById('coldRange').addEventListener('input', (e) => {
            this.config.ranges.cold = parseFloat(e.target.value);
        });

        document.getElementById('hotRange').addEventListener('input', (e) => {
            this.config.ranges.hot = parseFloat(e.target.value);
        });

        // Update interval
        document.getElementById('updateInterval').addEventListener('input', (e) => {
            this.config.updateInterval = parseInt(e.target.value);
            socket.emit('update_interval', { interval: this.config.updateInterval });
        });

        // Animation toggle
        document.getElementById('enableAnimations').addEventListener('change', (e) => {
            this.config.enableAnimations = e.target.checked;
            document.documentElement.style.setProperty('--transition-duration', 
                this.config.enableAnimations ? '0.3s' : '0s');
        });

        // Visibility toggles
        ['S1', 'S2', 'S3'].forEach(sensorId => {
            document.getElementById(`${sensorId}-visibility`).addEventListener('change', (e) => {
                this.updateSensorVisibility(sensorId, e.target.checked);
            });
        });

        // Heat map visibility toggle
        document.getElementById('heatmap-visibility').addEventListener('change', (e) => {
            this.config.visibility.heatmap = e.target.checked;
            visualization.updateHeatMapVisibility(e.target.checked);
            this.saveConfig();
        });

        // Save button
        document.getElementById('saveConfig').addEventListener('click', () => {
            this.saveConfig();
            const modal = bootstrap.Modal.getInstance(document.getElementById('configModal'));
            modal.hide();
        });
    }

    updateSensorPosition(sensorId, axis, value) {
        // Update configuration
        this.config.positions[sensorId][axis] = parseInt(value);
        
        // Get sensor circle and label elements
        const sensorCircle = document.getElementById(sensorId);
        const sensorLabel = document.querySelector(`text.sensor-label[x="${sensorCircle.getAttribute('cx')}"][y="${sensorCircle.getAttribute('cy')}"]`);
        
        if (sensorCircle && sensorLabel) {
            // Update circle position
            if (axis === 'x') {
                sensorCircle.setAttribute('cx', value);
                sensorLabel.setAttribute('x', value);
            } else {
                sensorCircle.setAttribute('cy', value);
                sensorLabel.setAttribute('y', value);
            }
            
            // Update visualization positions
            visualization.sensorPositions[sensorId] = {
                x: parseInt(sensorCircle.getAttribute('cx')),
                y: parseInt(sensorCircle.getAttribute('cy'))
            };
            
            // Update heat map when sensor positions change
            visualization.updateHeatMap();
        }
    }

    updateSensorVisibility(sensorId, visible) {
        this.config.visibility[sensorId] = visible;
        const sensor = document.getElementById(sensorId);
        const label = document.querySelector(`text.sensor-label[x="${sensor.getAttribute('cx')}"][y="${sensor.getAttribute('cy')}"]`);
        
        if (sensor && label) {
            sensor.style.display = visible ? 'block' : 'none';
            label.style.display = visible ? 'block' : 'none';
        }
        
        // Update related elements
        const card = document.querySelector(`.col-md-4 .card:has(#${sensorId}-temp)`);
        const chart = document.querySelector(`.col-md-4 .card:has(#historyChart${sensorId})`);
        
        if (card && chart) {
            card.style.display = visible ? 'block' : 'none';
            chart.style.display = visible ? 'block' : 'none';
        }
        
        // Update heat map when sensor visibility changes
        visualization.updateHeatMap();
    }

    loadConfig() {
        const savedConfig = localStorage.getItem('sensorConfig');
        if (savedConfig) {
            this.config = JSON.parse(savedConfig);
            
            // Apply saved positions
            Object.entries(this.config.positions).forEach(([sensorId, pos]) => {
                const xSlider = document.querySelector(`input[data-sensor="${sensorId}"][data-axis="x"]`);
                const ySlider = document.querySelector(`input[data-sensor="${sensorId}"][data-axis="y"]`);
                
                if (xSlider && ySlider) {
                    xSlider.value = pos.x;
                    ySlider.value = pos.y;
                    this.updateSensorPosition(sensorId, 'x', pos.x);
                    this.updateSensorPosition(sensorId, 'y', pos.y);
                }
            });
            
            // Apply saved ranges
            document.getElementById('coldRange').value = this.config.ranges.cold;
            document.getElementById('hotRange').value = this.config.ranges.hot;
            
            // Apply saved update interval
            document.getElementById('updateInterval').value = this.config.updateInterval;
            
            // Apply saved animation setting
            document.getElementById('enableAnimations').checked = this.config.enableAnimations;
            document.documentElement.style.setProperty('--transition-duration', 
                this.config.enableAnimations ? '0.3s' : '0s');
            
            // Apply saved visibility settings
            Object.entries(this.config.visibility).forEach(([id, visible]) => {
                if (id === 'heatmap') {
                    document.getElementById('heatmap-visibility').checked = visible;
                    visualization.updateHeatMapVisibility(visible);
                } else {
                    document.getElementById(`${id}-visibility`).checked = visible;
                    this.updateSensorVisibility(id, visible);
                }
            });
        }
    }

    saveConfig() {
        localStorage.setItem('sensorConfig', JSON.stringify(this.config));
        
        // Update visualization settings
        visualization.temperatureColors = {
            cold: visualization.getTemperatureColor(this.config.ranges.cold),
            normal: visualization.getTemperatureColor((this.config.ranges.cold + this.config.ranges.hot) / 2),
            hot: visualization.getTemperatureColor(this.config.ranges.hot)
        };
        
        // Emit configuration update to server
        socket.emit('config_update', this.config);
    }
}

// Initialize configuration
const sensorConfig = new SensorConfig();
