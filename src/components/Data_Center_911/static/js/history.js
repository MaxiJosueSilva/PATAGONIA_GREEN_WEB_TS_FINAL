// Initialize charts for each sensor
let charts = {
    S1: null,
    S2: null,
    S3: null
};

const chartColors = {
    S1: '#2196F3',
    S2: '#4CAF50',
    S3: '#F44336'
};

function createChartConfig(sensorId) {
    return {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: `Sensor ${sensorId}`,
                data: [],
                borderColor: chartColors[sensorId],
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: 15,
                    suggestedMax: 30,
                    ticks: {
                        maxTicksLimit: 5
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 6,
                        maxRotation: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
}

function initializeCharts() {
    for (const sensorId of ['S1', 'S2', 'S3']) {
        const ctx = document.getElementById(`historyChart${sensorId}`).getContext('2d');
        charts[sensorId] = new Chart(ctx, createChartConfig(sensorId));
    }
}

// Update charts with new data
function updateCharts(data) {
    for (const sensorId of ['S1', 'S2', 'S3']) {
        if (!charts[sensorId]) continue;
        
        charts[sensorId].data.labels = data.timestamps;
        charts[sensorId].data.datasets[0].data = data[sensorId];
        charts[sensorId].update('none');
    }
}

// Listen for historical data updates
socket.on('historical_update', (data) => {
    updateCharts(data.data);
});

// Initialize charts on page load
document.addEventListener('DOMContentLoaded', initializeCharts);
