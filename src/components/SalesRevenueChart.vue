<template>
  <div class="revenue-chart-container">
    <div class="chart-header">
      <div class="revenue-info">
        <h3>Sales Revenue</h3>
        <div class="total-revenue">
          <span class="currency">₱</span>
          <span class="amount">{{ formatNumber(totalRevenue) }}</span>
        </div>
      </div>
      <div class="time-filters">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          :class="{ active: activePeriod === period.value }"
          @click="setActivePeriod(period.value)"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    
    <div class="chart-container">
      <canvas ref="revenueChart"></canvas>
    </div>
    
    <div class="chart-actions">
      <button class="download-btn" @click="downloadChart">
        <Download size="16" />
        Download Report
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';
import { Download } from 'lucide-vue-next';
import Chart from 'chart.js/auto';

defineProps({
  totalRevenue: {
    type: Number,
    required: true
  }
});

// Time periods
const timePeriods = [
  { label: '1H', value: '1h' },
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '1M', value: '1m' },
  { label: '1Y', value: '1y' }
];

// Active time period
const activePeriod = ref('1m');
const revenueChart = ref(null);
let chart = null;

// Format number with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Set active time period
const setActivePeriod = (period) => {
  activePeriod.value = period;
  updateChart();
};

// Generate mock data based on time period
const generateChartData = () => {
  const labels = [];
  const data = [];
  let points = 0;
  
  switch (activePeriod.value) {
    case '1h':
      points = 12;
      for (let i = 0; i < points; i++) {
        labels.push(`${i * 5}min`);
        data.push(Math.random() * 10000 + 5000);
      }
      break;
    case '1d':
      points = 24;
      for (let i = 0; i < points; i++) {
        labels.push(`${i}:00`);
        data.push(Math.random() * 50000 + 20000);
      }
      break;
    case '7d':
      points = 7;
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i < points; i++) {
        labels.push(days[i]);
        data.push(Math.random() * 200000 + 100000);
      }
      break;
    case '1m':
      points = 30;
      for (let i = 1; i <= points; i++) {
        labels.push(i.toString());
        data.push(Math.random() * 500000 + 300000);
      }
      break;
    case '1y':
      points = 12;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < points; i++) {
        labels.push(months[i]);
        data.push(Math.random() * 1000000 + 500000);
      }
      break;
  }
  
  return { labels, data };
};

// Initialize chart
const initChart = () => {
  const ctx = revenueChart.value.getContext('2d');
  const { labels, data } = generateChartData();
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#2e5c31',
        backgroundColor: 'rgba(46, 92, 49, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              return `₱${formatNumber(context.raw)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `₱${formatNumber(value)}`
          }
        }
      }
    }
  });
};

// Update chart data
const updateChart = () => {
  if (!chart) return;
  
  const { labels, data } = generateChartData();
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
};

// Download chart as image
const downloadChart = () => {
  if (!chart) return;
  
  const link = document.createElement('a');
  link.download = `revenue-chart-${activePeriod.value}.png`;
  link.href = chart.canvas.toDataURL('image/png');
  link.click();
};

// Watch for period changes
watch(activePeriod, () => {
  updateChart();
});

// Initialize chart on mount
onMounted(() => {
  initChart();
});
</script>

<style scoped>
.revenue-chart-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.revenue-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 10px 0;
}

.total-revenue {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 1.2rem;
  color: #2e5c31;
}

.amount {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2e5c31;
}

.time-filters {
  display: flex;
  gap: 8px;
}

.time-filters button {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  color: #4b5563;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-filters button.active {
  background-color: #2e5c31;
  color: white;
  border-color: #2e5c31;
}

.chart-container {
  height: 300px;
  margin: 20px 0;
}

.chart-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .time-filters {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .time-filters button {
    white-space: nowrap;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>
  
  