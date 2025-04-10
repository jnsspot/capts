<template>
    <div class="performance-container">
      <h3>Sales Performance</h3>
      <div class="gauge-container">
        <canvas ref="gaugeChart"></canvas>
        <div class="gauge-value">
          <div class="value">{{ performanceScore }}</div>
          <div class="label">of 100 points</div>
        </div>
      </div>
      <div class="performance-info">
        <h3>{{ performanceMessage }}</h3>
        <p>Your sales performance score is better than {{ performanceScore }}% other user</p>
        <button class="improve-btn">Improve Performance</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  const props = defineProps({
    performanceScore: {
      type: Number,
      default: 80
    },
    performanceMessage: {
      type: String,
      default: "You're Good 👍"
    }
  });
  
  const gaugeChart = ref(null);
  
  onMounted(() => {
    // Gauge Chart
    const gaugeCtx = gaugeChart.value.getContext('2d');
    
    new Chart(gaugeCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [props.performanceScore, 100 - props.performanceScore],
          backgroundColor: [
            createGradient(gaugeCtx, ['#2e5c31', '#4a8f4d']),
            '#f3f4f6'
          ],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      }
    });
  });
  
  // Create gradient for gauge chart
  function createGradient(ctx, colors) {
    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    return gradient;
  }
  </script>
  
  <style scoped>
  .performance-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .performance-container h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 20px 0;
  }
  
  .gauge-container {
    position: relative;
    height: 180px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .gauge-value {
    position: absolute;
    bottom: 0;
    text-align: center;
  }
  
  .gauge-value .value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
  }
  
  .gauge-value .label {
    font-size: 0.8rem;
    color: #6b7280;
  }
  
  .performance-info {
    text-align: center;
  }
  
  .performance-info h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .performance-info p {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 20px;
  }
  
  .improve-btn {
    padding: 10px 20px;
    background-color: #2e5c31;
    border: none;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .improve-btn:hover {
    background-color: #26492a;
    transform: translateY(-2px);
  }
  
  /* Dark mode styles */
  :global(.dark) .performance-container {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  :global(.dark) .performance-container h3,
  :global(.dark) .performance-info h3 {
    color: #f9fafb;
  }
  
  :global(.dark) .gauge-value .value {
    color: #f9fafb;
  }
  
  :global(.dark) .gauge-value .label,
  :global(.dark) .performance-info p {
    color: #9ca3af;
  }
  
  :global(.dark) .improve-btn {
    background-color: #4a8f4d;
  }
  
  :global(.dark) .improve-btn:hover {
    background-color: #3a7a3d;
  }
  </style>
  
  