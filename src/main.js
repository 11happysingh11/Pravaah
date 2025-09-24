import './style.css'


// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getDatabase, ref, onValue, off } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA86x2wbw7deK4HwxWElAxgLcDNJJlMvpU",
  authDomain: "sih-project-7ccb3.firebaseapp.com",
  databaseURL: "https://sih-project-7ccb3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sih-project-7ccb3",
  storageBucket: "sih-project-7ccb3.firebasestorage.app",
  messagingSenderId: "924626383675",
  appId: "1:924626383675:web:c9b50047140bc07f3e7d1e",
  measurementId: "G-2T7ZYX1HR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get DOM elements
const statusEl = document.getElementById('status');
const messageEl = document.getElementById('message');
const timestampEl = document.getElementById('timestamp');
const updatesCountEl = document.getElementById('updates-count');

let updateCount = 0;

// Function to format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Function to update status
function updateStatus(status, message) {
    statusEl.className = `status ${status}`;
    statusEl.textContent = message;
}

try {
    // Listen for changes in the message
    const messageRef = ref(database, 'message');
    onValue(messageRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            messageEl.textContent = data;
            messageEl.classList.add('pulse');
            setTimeout(() => messageEl.classList.remove('pulse'), 2000);
            updateCount++;
            updatesCountEl.textContent = `${updateCount} updates received`;
        } else {
            messageEl.textContent = 'No data';
        }
    }, (error) => {
        console.error('Message error:', error);
        messageEl.textContent = 'Error loading message';
        updateStatus('disconnected', 'Connection Error');
    });

    // Listen for changes in the timestamp
    const timestampRef = ref(database, 'timestamp');
    onValue(timestampRef, (snapshot) => {
        const data = snapshot.val();
        timestampEl.textContent = formatTimestamp(data);
        updateStatus('connected', 'Connected & Live');
    }, (error) => {
        console.error('Timestamp error:', error);
        timestampEl.textContent = 'Error loading timestamp';
    });

} catch (error) {
    console.error('Firebase initialization error:', error);
    updateStatus('disconnected', 'Configuration Error');
    messageEl.textContent = 'Check Firebase config';
    timestampEl.textContent = 'Configuration needed';
}

// Optional: Handle visibility changes to reconnect when tab becomes active
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        updateStatus('loading', 'Reconnecting...');
    }
});

// Timeline Chart Variables
let timestampHistory = []; // Store last 7 timestamps
let chart = null; // Chart instance

// Function to initialize the timeline chart
function initChart() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded! Add this to HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>');
        return;
    }
    
    // Check if canvas exists
    const canvas = document.getElementById('timestampChart');
    if (!canvas) {
        console.error('Canvas element not found! Add this to HTML: <canvas id="timestampChart"></canvas>');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Updates',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    display: true,
                    grid: {
                        display: true
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 7,
                        color: '#666'
                    }
                }
            },
            animation: {
                duration: 500
            }
        }
    });
    
    console.log('Chart initialized successfully!');
}

// Function to update the chart with new timestamp
function updateChart(timestamp) {
    console.log('updateChart called with:', timestamp);
    
    if (!chart) {
        console.error('Chart not initialized! Call initChart() first.');
        return;
    }
    
    // Convert timestamp to date
    const now = new Date(timestamp);
    const timeLabel = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    console.log('Adding data point:', timeLabel);
    
    // Add new data point
    timestampHistory.push({
        timestamp: timestamp,
        label: timeLabel,
        value: timestampHistory.length + 1
    });
    
    // Keep only last 7 entries
    if (timestampHistory.length > 7) {
        timestampHistory.shift();
        // Recalculate values to keep them sequential
        timestampHistory.forEach((item, index) => {
            item.value = index + 1;
        });
    }
    
    // Update chart data
    chart.data.labels = timestampHistory.map(item => item.label);
    chart.data.datasets[0].data = timestampHistory.map(item => item.value);
    
    // Update chart
    chart.update();
    
    console.log('Chart updated with', timestampHistory.length, 'data points');
}

// Test function to add sample data
function testChart() {
    console.log('Testing chart with sample data...');
    
    // Add some test data
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            updateChart(Date.now());
        }, i * 1000);
    }
}

// Wait for page to load, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing chart...');
        setTimeout(initChart, 100); // Small delay to ensure everything is ready
    });
} else {
    console.log('DOM already loaded, initializing chart...');
    setTimeout(initChart, 100);
}

// Global functions for testing
window.testChart = testChart;
window.updateChart = updateChart;
window.initChart = initChart;

console.log('Timeline chart script loaded!');