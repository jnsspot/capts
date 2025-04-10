<template>
  <div class="app-container" :class="{ 'dark': isDarkMode }">
    <!-- Sidebar -->
    <Sidebar :initial-active-item="'Market'" />
    
    <!-- Main Content - adjusted to work with the fixed sidebar -->
    <div class="main-content">
      <div class="top-bar">
        <h1>Market Overview</h1>
        <button class="theme-toggle" @click="toggleDarkMode">
          <i :class="isDarkMode ? 'i-lucide-sun' : 'i-lucide-moon'"></i>
        </button>
      </div>

      <div class="market-overview-page">
        <!-- Market Summary -->
        <div class="section">
          <h2>Current Market Trends</h2>
          <p class="helper-text">See which crops are trending in the market this season</p>
          
          <div class="market-summary-cards">
            <div class="market-card">
              <div class="market-card-header">
                <h3>Top Rising Crops</h3>
                <span class="trend-badge up">
                  <i class="i-lucide-trending-up"></i>
                </span>
              </div>
              <div class="market-card-content">
                <div v-for="(crop, index) in topRisingCrops" :key="index" class="trend-item">
                  <div class="trend-info">
                    <span class="crop-name">{{ crop.name }}</span>
                    <span class="crop-category">{{ crop.category }}</span>
                  </div>
                  <div class="trend-value up">+{{ crop.change }}%</div>
                </div>
              </div>
            </div>
            
            <div class="market-card">
              <div class="market-card-header">
                <h3>Top Falling Crops</h3>
                <span class="trend-badge down">
                  <i class="i-lucide-trending-down"></i>
                </span>
              </div>
              <div class="market-card-content">
                <div v-for="(crop, index) in topFallingCrops" :key="index" class="trend-item">
                  <div class="trend-info">
                    <span class="crop-name">{{ crop.name }}</span>
                    <span class="crop-category">{{ crop.category }}</span>
                  </div>
                  <div class="trend-value down">{{ crop.change }}%</div>
                </div>
              </div>
            </div>
            
            <div class="market-card">
              <div class="market-card-header">
                <h3>Most Stable Crops</h3>
                <span class="trend-badge stable">
                  <i class="i-lucide-minus"></i>
                </span>
              </div>
              <div class="market-card-content">
                <div v-for="(crop, index) in stableCrops" :key="index" class="trend-item">
                  <div class="trend-info">
                    <span class="crop-name">{{ crop.name }}</span>
                    <span class="crop-category">{{ crop.category }}</span>
                  </div>
                  <div class="trend-value stable">{{ crop.change }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Seasonal Forecast -->
        <div class="section">
          <h2>Seasonal Market Forecast</h2>
          <p class="helper-text">Projected market trends for the next 6 months</p>
          
          <div class="chart-container">
            <canvas ref="seasonalChart"></canvas>
          </div>
          
          <div class="season-legend">
            <div class="season-item">
              <div class="season-color spring"></div>
              <span>Spring</span>
            </div>
            <div class="season-item">
              <div class="season-color summer"></div>
              <span>Summer</span>
            </div>
            <div class="season-item">
              <div class="season-color fall"></div>
              <span>Fall</span>
            </div>
            <div class="season-item">
              <div class="season-color winter"></div>
              <span>Winter</span>
            </div>
          </div>
        </div>
        
        <!-- Market Insights -->
        <div class="section">
          <h2>Market Insights</h2>
          <p class="helper-text">Key information to help you plan your farming strategy</p>
          
          <div class="insights-grid">
            <div class="insight-card">
              <div class="insight-icon">
                <i class="i-lucide-calendar"></i>
              </div>
              <div class="insight-content">
                <h3>Best Planting Time</h3>
                <p>For most vegetables, early April will provide optimal growing conditions based on weather forecasts.</p>
              </div>
            </div>
            
            <div class="insight-card">
              <div class="insight-icon">
                <i class="i-lucide-droplets"></i>
              </div>
              <div class="insight-content">
                <h3>Water Resources</h3>
                <p>Water reserves are 15% higher than last year. Irrigation costs are expected to decrease.</p>
              </div>
            </div>
            
            <div class="insight-card">
              <div class="insight-icon">
                <i class="i-lucide-users"></i>
              </div>
              <div class="insight-content">
                <h3>Consumer Preferences</h3>
                <p>Organic produce demand is up 23% from last year. Consider transitioning more crops to organic.</p>
              </div>
            </div>
            
            <div class="insight-card">
              <div class="insight-icon">
                <i class="i-lucide-truck"></i>
              </div>
              <div class="insight-content">
                <h3>Distribution Channels</h3>
                <p>Local farmers markets are showing 18% growth. Direct-to-consumer sales are becoming more profitable.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Crop Spotlight -->
        <div class="section">
          <h2>Crop Spotlight</h2>
          <p class="helper-text">This month's featured crops with high market potential</p>
          
          <div class="spotlight-grid">
            <div v-for="(crop, index) in spotlightCrops" :key="index" class="spotlight-card">
              <div class="spotlight-image">
                <img :src="crop.image" :alt="crop.name" />
              </div>
              <div class="spotlight-content">
                <h3>{{ crop.name }}</h3>
                <div class="spotlight-stats">
                  <div class="stat-item">
                    <span class="stat-label">Demand</span>
                    <div class="stat-bar">
                      <div class="stat-fill" :style="{ width: crop.demand + '%' }"></div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Profitability</span>
                    <div class="stat-bar">
                      <div class="stat-fill" :style="{ width: crop.profitability + '%' }"></div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Ease of Growing</span>
                    <div class="stat-bar">
                      <div class="stat-fill" :style="{ width: crop.easeOfGrowing + '%' }"></div>
                    </div>
                  </div>
                </div>
                <p class="spotlight-description">{{ crop.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Your Crop Forecasting -->
        <div class="section">
          <h2>Your Personalized Crop Forecast</h2>
          <p class="helper-text">Get detailed predictions for your specific crops</p>
          
          <div class="forecast-cta">
            <p>Want to see how your specific crops will perform in the coming months?</p>
            <router-link to="/seller/crop-forecast" class="primary-btn">
              <i class="i-lucide-chart-line mr-2"></i> Forecast My Crops
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import Sidebar from '@/components/Sidebar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// UI State
const isDarkMode = ref(false);
const activeMenu = ref('market');
const seasonalChart = ref(null);
const chartInstance = ref(null);

// Toggle functions
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark', isDarkMode.value);
  if (chartInstance.value) {
    chartInstance.value.destroy();
    renderSeasonalChart();
  }
};

// Navigation function (alternative to router-link)
const navigateToCropForecasting = () => {
  router.push('/seller/crop-forecast');
};

// Sample data for market trends
const topRisingCrops = ref([
  { name: 'Kale', category: 'Leafy Greens', change: 28 },
  { name: 'Cherry Tomatoes', category: 'Vegetables', change: 23 },
  { name: 'Microgreens', category: 'Specialty', change: 19 },
  { name: 'Blueberries', category: 'Berries', change: 17 },
  { name: 'Sweet Potatoes', category: 'Root Vegetables', change: 15 }
]);

const topFallingCrops = ref([
  { name: 'Iceberg Lettuce', category: 'Leafy Greens', change: -12 },
  { name: 'White Potatoes', category: 'Root Vegetables', change: -9 },
  { name: 'Green Beans', category: 'Vegetables', change: -7 },
  { name: 'Radishes', category: 'Root Vegetables', change: -6 },
  { name: 'Turnips', category: 'Root Vegetables', change: -5 }
]);

const stableCrops = ref([
  { name: 'Carrots', category: 'Root Vegetables', change: 2 },
  { name: 'Onions', category: 'Alliums', change: 1 },
  { name: 'Apples', category: 'Fruits', change: 0 },
  { name: 'Cabbage', category: 'Brassicas', change: -1 },
  { name: 'Garlic', category: 'Alliums', change: -2 }
]);

// Sample data for spotlight crops
const spotlightCrops = ref([
  {
    name: 'Purple Sweet Potatoes',
    image: '/placeholder.svg?height=150&width=150',
    demand: 85,
    profitability: 78,
    easeOfGrowing: 65,
    description: 'Vibrant color and rich in antioxidants. Growing consumer interest in unique varieties makes this a profitable specialty crop.'
  },
  {
    name: 'Heirloom Tomatoes',
    image: '/placeholder.svg?height=150&width=150',
    demand: 92,
    profitability: 80,
    easeOfGrowing: 55,
    description: 'Premium prices at farmers markets. Diverse colors and flavors appeal to chefs and home cooks seeking authentic taste.'
  },
  {
    name: 'Ginger',
    image: '/placeholder.svg?height=150&width=150',
    demand: 75,
    profitability: 88,
    easeOfGrowing: 60,
    description: 'Growing demand for locally-grown ginger. Can be grown in containers and harvested young for specialty markets.'
  }
]);

// Render seasonal chart
const renderSeasonalChart = () => {
  if (!seasonalChart.value) return;
  
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  const ctx = seasonalChart.value.getContext('2d');
  
  // Sample data for seasonal forecast
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const labels = [];
  
  // Get next 6 months
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth + i) % 12;
    labels.push(months[monthIndex]);
  }
  
  // Set chart colors based on dark mode
  const textColor = isDarkMode.value ? '#e0e0e0' : '#333';
  const gridColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Vegetables',
          data: [65, 72, 78, 82, 75, 68],
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.3
        },
        {
          label: 'Fruits',
          data: [45, 55, 70, 85, 80, 70],
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          tension: 0.3
        },
        {
          label: 'Herbs',
          data: [50, 60, 65, 60, 55, 50],
          borderColor: '#9c27b0',
          backgroundColor: 'rgba(156, 39, 176, 0.1)',
          tension: 0.3
        },
        {
          label: 'Root Crops',
          data: [70, 65, 60, 55, 60, 70],
          borderColor: '#795548',
          backgroundColor: 'rgba(121, 85, 72, 0.1)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}% market strength`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: {
              size: 12
            }
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: {
              size: 12
            },
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
};

onMounted(() => {
  // Check for dark mode
  isDarkMode.value = document.body.classList.contains('dark');
  
  // Render chart
  renderSeasonalChart();
});
</script>

<style scoped>
/* Layout - Adjusted to work with fixed sidebar */
.app-container {
  min-height: 100vh;
  background: #f9f9f9;
  color: #333;
  display: flex;
}

.app-container.dark {
  background: #1a1a1a;
  color: #e0e0e0;
}

.main-content {
  margin-left: 230px; /* Match the sidebar width */
  min-height: 100vh;
  flex: 1;
  transition: all 0.3s ease;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #2e5c31;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dark .top-bar {
  background: #1a3a1c;
}

.top-bar h1 {
  margin: 0;
  font-size: 1.5rem;
}

.theme-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.theme-toggle:hover {
  background: rgba(255,255,255,0.1);
}

.market-overview-page {
  max-width: 1200px;
  margin: 1rem auto;
  padding: 0 1rem;
}

/* Section Styles */
.section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.dark .section {
  background: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

h2 {
  color: #2e5c31;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.dark h2 {
  color: #6abe6e;
}

.helper-text {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.dark .helper-text {
  color: #aaa;
}

/* Market Summary Cards */
.market-summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.market-card {
  background: #f5f5f5;
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark .market-card {
  background: #333;
}

.market-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #eee;
  border-bottom: 1px solid #ddd;
}

.dark .market-card-header {
  background: #444;
  border-bottom: 1px solid #555;
}

.market-card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.dark .market-card-header h3 {
  color: #e0e0e0;
}

.trend-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: white;
}

.trend-badge.up {
  background: #4caf50;
}

.trend-badge.down {
  background: #f44336;
}

.trend-badge.stable {
  background: #ff9800;
}

.market-card-content {
  padding: 0.5rem;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.dark .trend-item {
  border-bottom: 1px solid #444;
}

.trend-item:last-child {
  border-bottom: none;
}

.trend-info {
  display: flex;
  flex-direction: column;
}

.crop-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.crop-category {
  font-size: 0.8rem;
  color: #666;
}

.dark .crop-category {
  color: #aaa;
}

.trend-value {
  font-weight: bold;
  font-size: 1.1rem;
}

.trend-value.up {
  color: #4caf50;
}

.trend-value.down {
  color: #f44336;
}

.trend-value.stable {
  color: #ff9800;
}

/* Chart */
.chart-container {
  height: 300px;
  margin-bottom: 1rem;
}

.season-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.season-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.season-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.season-color.spring {
  background: #4caf50;
}

.season-color.summer {
  background: #ff9800;
}

.season-color.fall {
  background: #f44336;
}

.season-color.winter {
  background: #2196f3;
}

/* Insights */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.insight-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
}

.dark .insight-card {
  background: #333;
}

.insight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: #2e5c31;
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.dark .insight-icon {
  background: #6abe6e;
  color: #1a1a1a;
}

.insight-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2e5c31;
}

.dark .insight-content h3 {
  color: #6abe6e;
}

.insight-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.dark .insight-content p {
  color: #aaa;
}

/* Spotlight */
.spotlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.spotlight-card {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark .spotlight-card {
  background: #333;
}

.spotlight-image {
  height: 150px;
  overflow: hidden;
}

.spotlight-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spotlight-content {
  padding: 1rem;
}

.spotlight-content h3 {
  margin: 0 0 1rem 0;
  color: #2e5c31;
}

.dark .spotlight-content h3 {
  color: #6abe6e;
}

.spotlight-stats {
  margin-bottom: 1rem;
}

.stat-item {
  margin-bottom: 0.5rem;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.dark .stat-label {
  color: #aaa;
}

.stat-bar {
  height: 0.5rem;
  background: #ddd;
  border-radius: 0.25rem;
  overflow: hidden;
}

.dark .stat-bar {
  background: #444;
}

.stat-fill {
  height: 100%;
  background: #2e5c31;
  border-radius: 0.25rem;
}

.dark .stat-fill {
  background: #6abe6e;
}

.spotlight-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.dark .spotlight-description {
  color: #aaa;
}

/* Forecast CTA */
.forecast-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
}

.dark .forecast-cta {
  background: #333;
}

.forecast-cta p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* Buttons */
.primary-btn {
  background: #2e5c31;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  text-decoration: none;
}

.primary-btn:hover {
  background: #234425;
}

.dark .primary-btn {
  background: #6abe6e;
  color: #1a1a1a;
}

.dark .primary-btn:hover {
  background: #58a85c;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0; /* On mobile, sidebar will be hidden or shown as overlay */
    padding-top: 60px; /* Add space for a mobile header */
  }
  
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 90;
    padding: 0.75rem 1rem;
  }
  
  .market-overview-page {
    padding: 0 0.5rem;
  }
  
  .section {
    padding: 1rem;
  }
  
  .market-summary-cards,
  .insights-grid,
  .spotlight-grid {
    grid-template-columns: 1fr;
  }
  
  .forecast-cta {
    padding: 1.5rem 1rem;
  }
  
  .top-bar h1 {
    font-size: 1.25rem;
  }
}
</style>