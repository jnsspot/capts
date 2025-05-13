<template>
    <div class="top-sales-container">
      <div class="top-sales-header">
        <h3>Top 10 Sales</h3>
        <div class="time-filters small">
          <button v-for="(period, index) in timePeriods" 
                  :key="index" 
                  :class="{ active: activePeriod === period.value }"
                  @click="setActivePeriod(period.value)">
            {{ period.label }}
          </button>
        </div>
      </div>
      <div class="top-sales-chart">
        <div v-for="(item, index) in salesItems" :key="index" class="sales-item">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-bar-container">
            <div class="item-bar" :style="{ width: `${item.percentage}%`, background: getGradient(item.percentage) }"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  
  defineProps({
    salesItems: {
      type: Array,
      default: () => [
        { name: 'Shoes', percentage: 95 },
        { name: 'T-Shirt', percentage: 85 },
        { name: 'Shirt', percentage: 70 },
        { name: 'Jackets', percentage: 55 },
        { name: 'Belt', percentage: 50 },
        { name: 'Wallet', percentage: 45 },
        { name: 'Hat', percentage: 40 },
        { name: 'Pants', percentage: 30 },
        { name: 'Watch', percentage: 25 },
        { name: 'Bags', percentage: 20 }
      ]
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
  
  // Set active time period
  const setActivePeriod = (period) => {
    activePeriod.value = period;
  };
  
  // Get gradient color for bar
  const getGradient = (percentage) => {
    if (percentage > 80) {
      return 'linear-gradient(90deg, #2e5c31, #4a8f4d)';
    } else if (percentage > 60) {
      return 'linear-gradient(90deg, #3a7a3d, #4a8f4d)';
    } else if (percentage > 40) {
      return 'linear-gradient(90deg, #4a8f4d, #6ab04c)';
    } else {
      return 'linear-gradient(90deg, #6ab04c, #badc58)';
    }
  };
  </script>
  
  <style scoped>
  .top-sales-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .top-sales-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .top-sales-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
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
  
  .time-filters.small button {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
  
  .top-sales-chart {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .sales-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .item-name {
    width: 80px;
    font-size: 0.9rem;
    color: #6b7280;
  }
  
  .item-bar-container {
    flex: 1;
    height: 8px;
    background-color: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .item-bar {
    height: 100%;
    border-radius: 4px;
  }
  
  /* Dark mode styles */
  :global(.dark) .top-sales-container {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  :global(.dark) .top-sales-header h3 {
    color: #f9fafb;
  }
  
  :global(.dark) .time-filters {
    background-color: #374151;
  }
  
  :global(.dark) .time-filters button.active {
    background-color: #4b5563;
    color: #4a8f4d;
  }
  
  :global(.dark) .item-name {
    color: #9ca3af;
  }
  
  :global(.dark) .item-bar-container {
    background-color: #374151;
  }
  </style>
  
  