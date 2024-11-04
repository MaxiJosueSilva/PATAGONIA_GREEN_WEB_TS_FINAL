// Initialize Socket.IO connection with reconnection settings
const checkInterval = 10000; // 10 seconds
let reconnectAttempts = 0;
const maxReconnectDelay = 30000; // 30 seconds
let connectionState = 'disconnected';
let heartbeatTimeout = null;

function getReconnectDelay() {
    return Math.min(1000 * Math.pow(2, reconnectAttempts), maxReconnectDelay);
}

const socket = io({
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: maxReconnectDelay,
    timeout: 20000,
    transports: ['websocket', 'polling'],
    forceNew: true,
    autoConnect: true
});

// Track connection state
function updateConnectionState(state) {
    connectionState = state;
    console.log('Connection state:', state);
}

// Handle connection
socket.on('connect', () => {
    console.log('Connected to server');
    updateConnectionState('connected');
    reconnectAttempts = 0;
    
    // Start heartbeat after connection
    startHeartbeat();
});

// Heartbeat mechanism
function startHeartbeat() {
    if (heartbeatTimeout) {
        clearTimeout(heartbeatTimeout);
    }
    
    // Send ping every 5 seconds
    setInterval(() => {
        if (socket.connected) {
            socket.emit('ping');
            
            // Set timeout for pong response
            heartbeatTimeout = setTimeout(() => {
                console.warn('Server heartbeat timeout');
                socket.disconnect();
            }, 10000); // 10 second timeout
        }
    }, 5000);
}

// Handle pong from server
socket.on('pong', () => {
    if (heartbeatTimeout) {
        clearTimeout(heartbeatTimeout);
    }
});

// Handle sensor updates
socket.on('sensor_update', (data) => {
    for (const [sensorId, sensorData] of Object.entries(data)) {
        visualization.updateReadings(sensorId, sensorData);
    }
});

// Handle connection error with improved logging
socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
    updateConnectionState('error');
    
    // Attempt to reconnect with polling if websocket fails
    if (socket.io.opts.transports[0] === 'websocket') {
        console.log('Falling back to polling transport');
        socket.io.opts.transports = ['polling', 'websocket'];
    }
});

// Handle disconnection with exponential backoff
socket.on('disconnect', (reason) => {
    console.warn('Disconnected:', reason);
    updateConnectionState('disconnected');
    
    // Handle various disconnect scenarios
    switch (reason) {
        case 'io server disconnect':
            // Server initiated disconnect, try to reconnect immediately
            console.log('Server initiated disconnect, attempting immediate reconnection');
            socket.connect();
            break;
        case 'transport close':
        case 'transport error':
            // Transport issues, try alternative transport
            console.log('Transport issue, switching transport method');
            socket.io.opts.transports = ['polling', 'websocket'];
            reconnectAttempts++;
            setTimeout(() => {
                socket.connect();
            }, getReconnectDelay());
            break;
        case 'ping timeout':
            // Connection timed out, try to reconnect with increased timeout
            console.log('Ping timeout, increasing timeout duration');
            socket.io.opts.timeout = 30000;
            reconnectAttempts++;
            setTimeout(() => {
                socket.connect();
            }, getReconnectDelay());
            break;
        default:
            // For any other reason, attempt a reconnection with backoff
            reconnectAttempts++;
            setTimeout(() => {
                if (!socket.connected) {
                    console.log(`Attempting reconnection after ${getReconnectDelay()}ms delay`);
                    socket.connect();
                }
            }, getReconnectDelay());
    }
});

// Handle reconnection attempt
socket.on('reconnecting', (attemptNumber) => {
    console.log('Attempting to reconnect:', attemptNumber);
    updateConnectionState('reconnecting');
});

// Handle successful reconnection
socket.on('reconnect', (attemptNumber) => {
    console.log('Successfully reconnected after', attemptNumber, 'attempts');
    updateConnectionState('connected');
    reconnectAttempts = 0;
    socket.io.opts.transports = ['websocket', 'polling'];
    socket.io.opts.timeout = 20000;
});

// Handle reconnection error
socket.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error.message);
    updateConnectionState('error');
    
    if (socket.io.opts.transports[0] === 'websocket') {
        console.log('Reconnection failed, trying polling transport');
        socket.io.opts.transports = ['polling', 'websocket'];
    }
});
