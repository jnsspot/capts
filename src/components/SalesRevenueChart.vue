<template>
    <div class="chart-container">
      <div class="chart-header">
        <div>
          <h3>Total Sales Revenue</h3>
          <div class="revenue-amount">${{ formatNumber(totalRevenue) }}</div>
        </div>
        <div class="chart-actions">
          <div class="time-filters">
            <button v-for="(period, index) in timePeriods" 
                    :key="index" 
                    :class="{ active: activePeriod === period.value }"
                    @click="setActivePeriod(period.value)">
              {{ period.label }}
            </button>
          </div>
          <button class="export-btn">
            <Download size="16" />
            Export
          </button>
        </div>
      </div>
      <div class="chart-body">
        <canvas ref="revenueChart"></canvas>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Download } from 'lucide-vue-next';
  import Chart from 'chart.js/auto';
  
  const props = defineProps({
    totalRevenue: {
      type: Number,
      default: 1587000
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
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Set active time period
  const setActivePeriod = (period) => {
    activePeriod.value = period;
  };
  
  onMounted(() => {
    // Revenue Chart
    const revenueCtx = revenueChart.value.getContext('2d');
    
    const gradientFill = revenueCtx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(74, 143, 77, 0.3)');
    gradientFill.addColorStop(1, 'rgba(74, 143, 77, 0)');
    
    const secondGradientFill = revenueCtx.createLinearGradient(0, 0, 0, 400);
    secondGradientFill.addColorStop(0, 'rgba(46, 92, 49, 0.3)');
    secondGradientFill.addColorStop(1, 'rgba(46, 92, 49, 0)');
    
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['03/09', '06/08', '09/09', '12/09', '15/09', '18/09', '21/09', '24/09', '27/09', '30/09'],
        datasets: [
          {
            label: 'Revenue',
            data: [40000, 42000, 41000, 43000, 45000, 46000, 48000, 50000, 52000, 54000],
            borderColor: '#4a8f4d',
            backgroundColor: gradientFill,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Profit',
            data: [30000, 31000, 32000, 34000, 36000, 38000, 40000, 42000, 44000, 45000],
            borderColor: '#2e5c31',
            backgroundColor: secondGradientFill,
            tension: 0.4,
            fill: true
          }
        ]
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
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value / 1000 + 'K';
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  });
  </script>
  
  <style scoped>
  .chart-container {
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
  
  .chart-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
    margin: 0 0 5px 0;
  }
  
  .revenue-amount {
    font-size: 1.8rem;
    font-weight: 700;
    color: #111827;
  }
  
  .chart-actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .time-filters {
    display: flex;
    background-color: #f3f4f6;
    border-radius: 8px;
    padding: 4px;
  }
  
  .time-filters button {
    padding: 6px 12px;
    border: none;
    background: none;
    border-radius: 6px;
    font-size: 0.8rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .time-filters button.active {
    background-color: #fff;
    color: #2e5c31;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .export-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .export-btn:hover {
    background-color: #f9fafb;
  }
  
  .chart-body {
    height: 300px;
    position: relative;
  }
  
  /* Dark mode styles */
  :global(.dark) .chart-container {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  :global(.dark) .chart-header h3 {
    color: #9ca3af;
  }
  
  :global(.dark) .revenue-amount {
    color: #f9fafb;
  }
  
  :global(.dark) .time-filters {
    background-color: #374151;
  }
  
  :global(.dark) .time-filters button.active {
    background-color: #4b5563;
    color: #4a8f4d;
  }
  
  :global(.dark) .export-btn {
    background-color: #1f2937;
    border-color: #374151;
    color: #9ca3af;
  }
  </style>
  
  