<template>
  <div class="dashboard-container">
    <Sidebar initialActiveItem="Forecasting" />
    
    <div class="main-content">
      <header class="header">
        <div class="page-title">
          <h1>Sales Forecasting</h1>
          <p>Predict future demand for your products</p>
        </div>
        
        <div class="forecast-controls">
          <select v-model="forecastPeriod" class="period-select">
            <option value="7">Next 7 Days</option>
            <option value="14">Next 14 Days</option>
            <option value="30">Next 30 Days</option>
          </select>
          <select v-model="selectedCategory" class="category-select">
            <option value="all">All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button @click="generateForecast" class="generate-btn">
            Generate Forecast
          </button>
        </div>
      </header>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Generating forecast...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <div class="error-icon">!</div>
        <p>{{ error }}</p>
        <button @click="generateForecast" class="retry-btn">Try Again</button>
      </div>
      
      <div v-else-if="forecastData" class="forecast-results">
        <div class="forecast-chart-container">
          <h2>Sales Forecast for {{ forecastTitle }}</h2>
          <div class="chart-wrapper">
            <canvas ref="forecastChart"></canvas>
          </div>
        </div>
        
        <div class="forecast-recommendations">
          <h2>Recommended Products</h2>
          <div class="recommendation-cards">
            <div v-for="(product, index) in recommendedProducts" :key="index" class="recommendation-card">
              <div class="rank-badge">{{ index + 1 }}</div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="category">{{ product.category }}</p>
              </div>
              <div class="forecast-stats">
                <div class="stat">
                  <span class="stat-label">Projected Demand</span>
                  <span class="stat-value">{{ product.demand }} units</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Confidence</span>
                  <span class="stat-value">{{ product.confidence }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2e5c31" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h2>No Forecast Generated</h2>
        <p>Select a time period and click "Generate Forecast" to predict future sales</p>
        <button @click="generateForecast" class="generate-btn">Generate Forecast</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import * as tf from '@tensorflow/tfjs';
import Chart from 'chart.js/auto';
import Sidebar from '@/components/Sidebar.vue';

// Data properties
const forecastPeriod = ref('14');
const selectedCategory = ref('all');
const availableCategories = ref([]);
const loading = ref(false);
const error = ref(null);
const forecastData = ref(null);
const recommendedProducts = ref([]);
const forecastChart = ref(null);
let chartInstance = null;

// Computed properties
const forecastTitle = computed(() => {
  if (selectedCategory.value === 'all') {
    return `All Products (Next ${forecastPeriod.value} Days)`;
  }
  return `${selectedCategory.value} (Next ${forecastPeriod.value} Days)`;
});

// Fetch sales data from Firestore
const fetchSalesData = async () => {
  try {
    const salesCollection = collection(db, 'sales');
    const q = query(salesCollection, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const sales = [];
    const categories = new Set();
    
    querySnapshot.forEach((doc) => {
      const saleData = doc.data();
      sales.push({
        id: doc.id,
        ...saleData,
        timestamp: saleData.timestamp.toDate()
      });
      
      if (saleData.category) {
        categories.add(saleData.category);
      }
    });
    
    availableCategories.value = Array.from(categories).sort();
    return sales;
  } catch (err) {
    console.error("Error fetching sales data:", err);
    error.value = "Failed to load sales data. Please try again.";
    return [];
  }
};

// Prepare time series data for TensorFlow
const prepareTimeSeriesData = (sales) => {
  // Group sales by date and category
  const dailySales = {};
  
  sales.forEach(sale => {
    const date = new Date(sale.timestamp);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!dailySales[dateKey]) {
      dailySales[dateKey] = {
        date: date,
        categories: {}
      };
    }
    
    if (!dailySales[dateKey].categories[sale.category]) {
      dailySales[dateKey].categories[sale.category] = 0;
    }
    
    dailySales[dateKey].categories[sale.category] += sale.quantity || 1;
  });
  
  // Get sorted dates and all categories
  const dates = Object.keys(dailySales).sort();
  const allCategories = availableCategories.value;
  
  // Create time series arrays
  const timeSeries = {};
  allCategories.forEach(cat => {
    timeSeries[cat] = dates.map(date => dailySales[date].categories[cat] || 0);
  });
  
  return {
    dates: dates.map(date => new Date(date)),
    timeSeries,
    categories: allCategories
  };
};

// Create TensorFlow model
const createModel = (inputShape) => {
  const model = tf.sequential();
  
  model.add(tf.layers.lstm({
    units: 50,
    inputShape: inputShape,
    returnSequences: false
  }));
  
  model.add(tf.layers.dense({
    units: 25,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: inputShape[1], // Predict all categories
    activation: 'linear'
  }));
  
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError'
  });
  
  return model;
};

// Generate forecast
const generateForecast = async () => {
  loading.value = true;
  error.value = null;
  forecastData.value = null;
  recommendedProducts.value = [];
  
  try {
    // 1. Fetch sales data
    const sales = await fetchSalesData();
    
    if (sales.length === 0) {
      error.value = "No sales data available for forecasting";
      return;
    }
    
    // 2. Prepare time series data
    const { dates, timeSeries, categories } = prepareTimeSeriesData(sales);
    
    if (categories.length === 0) {
      error.value = "No product categories found in sales data";
      return;
    }
    
    // 3. Normalize data (0-1 range)
    const maxValues = {};
    const normalizedSeries = {};
    
    categories.forEach(cat => {
      maxValues[cat] = Math.max(...timeSeries[cat], 1); // Ensure at least 1 to avoid division by zero
      normalizedSeries[cat] = timeSeries[cat].map(val => val / maxValues[cat]);
    });
    
    // 4. Prepare training data
    const lookBack = 7; // Use 7 days to predict next day
    const xs = [];
    const ys = [];
    
    for (let i = lookBack; i < dates.length; i++) {
      const x = [];
      for (let j = i - lookBack; j < i; j++) {
        const point = categories.map(cat => normalizedSeries[cat][j]);
        x.push(point);
      }
      xs.push(x);
      
      const y = categories.map(cat => normalizedSeries[cat][i]);
      ys.push(y);
    }
    
    if (xs.length === 0) {
      error.value = "Not enough data points for forecasting (need at least 8 days of data)";
      return;
    }
    
    // 5. Convert to tensors
    const xTensor = tf.tensor3d(xs, [xs.length, lookBack, categories.length]);
    const yTensor = tf.tensor2d(ys, [ys.length, categories.length]);
    
    // 6. Create and train model
    const model = createModel([lookBack, categories.length]);
    await model.fit(xTensor, yTensor, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
    
    // 7. Generate forecast
    const forecastDays = parseInt(forecastPeriod.value);
    const forecast = [];
    let lastInput = xs[xs.length - 1]; // Start with last known week
    
    for (let i = 0; i < forecastDays; i++) {
      const inputTensor = tf.tensor3d([lastInput], [1, lookBack, categories.length]);
      const prediction = model.predict(inputTensor);
      const predictedValues = prediction.arraySync()[0];
      
      // Denormalize
      const denormalized = categories.map((cat, idx) => ({
        category: cat,
        value: Math.round(predictedValues[idx] * maxValues[cat]),
        confidence: Math.min(95, Math.round(predictedValues[idx] * 100)) // Simple confidence metric
      }));
      
      forecast.push({
        date: new Date(dates[dates.length - 1].getTime() + (i + 1) * 24 * 60 * 60 * 1000),
        values: denormalized
      });
      
      // Update lastInput for next prediction
      lastInput.shift();
      lastInput.push(predictedValues);
    }
    
    // 8. Process results
    forecastData.value = {
      dates: forecast.map(f => f.date),
      categories,
      values: forecast.map(f => f.values)
    };
    
    // 9. Generate recommendations
    generateRecommendations();
    
    // 10. Render chart
    renderChart();
    
  } catch (err) {
    console.error("Error generating forecast:", err);
    error.value = "An error occurred during forecasting. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Generate product recommendations
const generateRecommendations = () => {
  if (!forecastData.value) return;
  
  const { categories, values } = forecastData.value;
  const productDemand = {};
  
  // Initialize demand for each category
  categories.forEach(cat => {
    productDemand[cat] = {
      total: 0,
      confidenceSum: 0,
      count: 0
    };
  });
  
  // Calculate total demand and average confidence
  values.forEach(dailyValues => {
    dailyValues.forEach(item => {
      productDemand[item.category].total += item.value;
      productDemand[item.category].confidenceSum += item.confidence;
      productDemand[item.category].count++;
    });
  });
  
  // Create recommendations array
  recommendedProducts.value = categories.map(cat => ({
    name: `Top ${cat}`,
    category: cat,
    demand: productDemand[cat].total,
    confidence: Math.round(productDemand[cat].confidenceSum / productDemand[cat].count)
  })).sort((a, b) => b.demand - a.demand)
    .slice(0, 5); // Top 5 recommended products
};

// Render forecast chart
const renderChart = () => {
  if (!forecastChart.value || !forecastData.value) return;
  
  const ctx = forecastChart.value.getContext('2d');
  
  // Destroy previous chart instance if exists
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const { dates, values } = forecastData.value;
  
  // Filter data if specific category is selected
  const displayData = selectedCategory.value === 'all' 
    ? forecastData.value.categories.map((cat, idx) => ({
        label: cat,
        data: values.map(daily => daily.find(item => item.category === cat)?.value || 0),
        borderColor: getCategoryColor(idx),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.3
      }))
    : [{
        label: selectedCategory.value,
        data: values.map(daily => daily.find(item => item.category === selectedCategory.value)?.value || 0),
        borderColor: '#2e5c31',
        backgroundColor: 'rgba(46, 92, 49, 0.1)',
        tension: 0.3,
        fill: true
      }];
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.map(d => d.toLocaleDateString()),
      datasets: displayData
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: forecastTitle.value
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw} units`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Units'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
};

// Helper function for category colors
const getCategoryColor = (index) => {
  const colors = ['#2e5c31', '#4a8f4d', '#6ab76e', '#8fd991', '#b3e6b5'];
  return colors[index % colors.length];
};

// Watch for changes in category selection
watch(selectedCategory, (newValue, oldValue) => {
  if (forecastData.value) {
    renderChart();
  }
});

// Initialize component
onMounted(async () => {
  // Load available categories
  const sales = await fetchSalesData();
  if (sales.length > 0) {
    const categories = new Set();
    sales.forEach(sale => {
      if (sale.category) categories.add(sale.category);
    });
    availableCategories.value = Array.from(categories).sort();
  }
});
</script>
<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

.main-content {
  flex: 1;
  padding: 24px;
  margin-left: 230px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-title p {
  font-size: 1rem;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.forecast-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.period-select,
.category-select {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
}

.generate-btn {
  padding: 10px 20px;
  background-color: #2e5c31;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generate-btn:hover {
  background-color: #235127;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(46, 92, 49, 0.2);
  border-top: 4px solid #2e5c31;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
  text-align: center;
}

.error-icon {
  width: 40px;
  height: 40px;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.retry-btn {
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
}

.empty-icon {
  margin-bottom: 16px;
}

.forecast-results {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.forecast-chart-container {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.forecast-chart-container h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #111827;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.forecast-recommendations {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.forecast-recommendations h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #111827;
}

.recommendation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.recommendation-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 16px;
  position: relative;
}

.rank-badge {
  width: 32px;
  height: 32px;
  background-color: #2e5c31;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.product-info {
  flex-grow: 1;
}

.product-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.product-info .category {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.forecast-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }
  
  .forecast-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .recommendation-cards {
    grid-template-columns: 1fr;
  }
}

/* Dark mode styles */
:global(.dark) .main-content {
  background-color: #111827;
}

:global(.dark) .page-title h1,
:global(.dark) .forecast-chart-container h2,
:global(.dark) .forecast-recommendations h2,
:global(.dark) .product-info h3,
:global(.dark) .stat-value {
  color: #f9fafb;
}

:global(.dark) .page-title p,
:global(.dark) .product-info .category,
:global(.dark) .stat-label {
  color: #9ca3af;
}

:global(.dark) .period-select,
:global(.dark) .category-select {
  background-color: #1f2937;
  border-color: #374151;
  color: #e5e7eb;
}

:global(.dark) .forecast-chart-container,
:global(.dark) .forecast-recommendations,
:global(.dark) .recommendation-card {
  background-color: #1f2937;
  border-color: #374151;
}

:global(.dark) .recommendation-card {
  background-color: #1f2937;
  border-color: #374151;
}
</style>