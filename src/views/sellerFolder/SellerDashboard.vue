<template>
    <div class="dashboard-container">
      <Sidebar initialActiveItem="Dashboard" />
      
      <div class="main-content">
        <header class="header">
          <div class="search-container">
            <div class="search-box">
              <Search size="18" class="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          
          <div class="user-profile" @click="toggleProfileMenu" ref="profileRef">
            <div class="notification-icon">
              <Bell size="20" />
            </div>
            <div class="avatar">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
            </div>
            <div class="user-info">
              <h3>Antonio Yanto</h3>
              <p>Lead of Sales</p>
            </div>
            
            <!-- Profile Dropdown Menu -->
            <div class="profile-dropdown" v-if="showProfileMenu">
              <div class="profile-header">
                <div class="profile-avatar">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
                </div>
                <div>
                  <h3>Stebin Ben</h3>
                  <p>UI/UX Designer</p>
                </div>
                <button class="logout-btn">
                  <LogOut size="18" />
                </button>
              </div>
              
              <div class="profile-tabs">
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'profile' }" 
                  @click="setActiveTab('profile')"
                >
                  <User size="18" />
                  Profile
                </button>
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'setting' }" 
                  @click="setActiveTab('setting')"
                >
                  <Settings size="18" />
                  Setting
                </button>
              </div>
              
              <div class="tab-content" v-if="activeTab === 'profile'">
                <button class="menu-item">
                  <Edit size="18" />
                  Edit Profile
                </button>
                <button class="menu-item">
                  <UserCheck size="18" />
                  View Profile
                </button>
                <button class="menu-item">
                  <Share2 size="18" />
                  Social Profile
                </button>
                <button class="menu-item">
                  <CreditCard size="18" />
                  Billing
                </button>
                <button class="menu-item">
                  <LogOut size="18" />
                  Logout
                </button>
              </div>
              
              <div class="tab-content" v-if="activeTab === 'setting'">
                <button class="menu-item">
                  <HelpCircle size="18" />
                  Support
                </button>
                <button class="menu-item">
                  <UserCog size="18" />
                  Account Settings
                </button>
                <button class="menu-item">
                  <Shield size="18" />
                  Privacy Center
                </button>
                <button class="menu-item">
                  <MessageSquare size="18" />
                  Feedback
                </button>
                <button class="menu-item">
                  <Clock size="18" />
                  History
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div class="dashboard-content">
          <!-- Metric Cards -->
          <div class="metric-cards">
            <div class="metric-card" v-for="(metric, index) in metrics" :key="index">
              <div class="metric-header">
                <h3>{{ metric.title }}</h3>
                <div class="info-icon">
                  <Info size="16" />
                </div>
              </div>
              <div class="metric-value">{{ metric.value }}</div>
            </div>
          </div>
          
          <!-- Sales Revenue Chart -->
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
          
          <div class="bottom-section">
            <!-- Sales Performance -->
            <div class="performance-container">
              <h3>Sales Performance</h3>
              <div class="gauge-container">
                <canvas ref="gaugeChart"></canvas>
                <div class="gauge-value">
                  <div class="value">80</div>
                  <div class="label">of 100 points</div>
                </div>
              </div>
              <div class="performance-info">
                <h3>You're Good 👍</h3>
                <p>Your sales performance score is better than 80% other user</p>
                <button class="improve-btn">Improve Performance</button>
              </div>
            </div>
            
            <!-- Top 10 Sales -->
            <div class="top-sales-container">
              <div class="top-sales-header">
                <h3>Top 10 Sales</h3>
                <div class="time-filters small">
                  <button v-for="(period, index) in timePeriods" 
                          :key="index" 
                          :class="{ active: topSalesPeriod === period.value }"
                          @click="setTopSalesPeriod(period.value)">
                    {{ period.label }}
                  </button>
                </div>
              </div>
              <div class="top-sales-chart">
                <div v-for="(item, index) in topSalesItems" :key="index" class="sales-item">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-bar-container">
                    <div class="item-bar" :style="{ width: `${item.percentage}%`, background: getGradient(item.percentage) }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <div class="orders-container">
            <div class="orders-header">
              <h3>Recent Orders</h3>
              <div class="status-filter">
                <span>Status:</span>
                <button class="status-btn">
                  All Status
                  <ChevronDown size="16" />
                </button>
              </div>
            </div>
            
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order Date</th>
                  <th>Product</th>
                  <th>Invoice</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in recentOrders" :key="index">
                  <td>
                    <div class="order-date">
                      <div>{{ order.date }}</div>
                      <div class="order-time">{{ order.time }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="product-cell">
                      <div class="product-icon" :class="order.category.toLowerCase()">
                        <img :src="getProductIcon(order.category)" alt="Product icon" />
                      </div>
                      <div class="product-info">
                        <div>{{ order.productName }}</div>
                        <div class="product-category">{{ order.category }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ order.invoice }}</td>
                  <td>${{ order.price }}</td>
                  <td>{{ order.sold }}</td>
                  <td>
                    <div class="status-badge" :class="order.status.toLowerCase().replace(' ', '-')">
                      <span v-if="order.status === 'New Order'" class="status-dot new"></span>
                      <span v-else-if="order.status === 'Cancelled'" class="status-dot cancelled"></span>
                      <span v-else-if="order.status === 'On Deliver'" class="status-dot on-deliver"></span>
                      {{ order.status }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div class="pagination">
              <div class="pagination-info">1 - 3 of 1025</div>
              <div class="pagination-controls">
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <span class="ellipsis">...</span>
                <button class="page-btn">99</button>
                <button class="page-btn">100</button>
                <button class="next-btn">
                  <ChevronRight size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
  import { 
    Search, 
    Bell, 
    Info, 
    Download, 
    ChevronDown, 
    ChevronRight,
    User,
    Settings,
    Edit,
    UserCheck,
    Share2,
    CreditCard,
    LogOut,
    HelpCircle,
    UserCog,
    Shield,
    MessageSquare,
    Clock
  } from 'lucide-vue-next';
  import Chart from 'chart.js/auto';
  import Sidebar from '@/components/Sidebar.vue'; // Use @ for absolute path

  
  // Profile dropdown state
  const showProfileMenu = ref(false);
  const activeTab = ref('profile');
  const profileRef = ref(null);
  
  const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
  };
  
  const setActiveTab = (tab) => {
    activeTab.value = tab;
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (profileRef.value && !profileRef.value.contains(event.target)) {
      showProfileMenu.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  
  // Metrics data
  const metrics = [
    { title: 'New Order', value: '156' },
    { title: 'Ready to Ship', value: '88' },
    { title: 'New Review', value: '243' },
    { title: 'New Discussion', value: '144' }
  ];
  
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
  const topSalesPeriod = ref('1m');
  
  // Total revenue
  const totalRevenue = ref(1587000);
  
  // Chart references
  const revenueChart = ref(null);
  const gaugeChart = ref(null);
  
  // Top sales items
  const topSalesItems = ref([
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
  ]);
  
  // Recent orders
  const recentOrders = ref([
    {
      date: 'Sep, 05 2023',
      time: '14:23 AM',
      productName: 'Savior Koil Part 2',
      category: 'Shoes',
      invoice: 'INV-0293',
      price: '122.00',
      sold: '1100',
      status: 'New Order'
    },
    {
      date: 'Sep, 05 2023',
      time: '10:07 AM',
      productName: 'Estruct Destructhrone',
      category: 'T-Shirt',
      invoice: 'INV-0293',
      price: '120.00',
      sold: '728',
      status: 'Cancelled'
    },
    {
      date: 'Sep, 05 2023',
      time: '08:23 AM',
      productName: 'Superstar Shoes',
      category: 'Shoes',
      invoice: 'INV-0293',
      price: '135.00',
      sold: '1054',
      status: 'On Deliver'
    }
  ]);
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Set active time period
  const setActivePeriod = (period) => {
    activePeriod.value = period;
  };
  
  // Set top sales time period
  const setTopSalesPeriod = (period) => {
    topSalesPeriod.value = period;
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
  
  // Get product icon
  const getProductIcon = (category) => {
    const icons = {
      'Shoes': 'https://cdn-icons-png.flaticon.com/512/2589/2589903.png',
      'T-Shirt': 'https://cdn-icons-png.flaticon.com/512/2503/2503380.png'
    };
    
    return icons[category] || 'https://cdn-icons-png.flaticon.com/512/1250/1250680.png';
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
    
    // Gauge Chart
    const gaugeCtx = gaugeChart.value.getContext('2d');
    
    new Chart(gaugeCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [80, 20],
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
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-container {
    flex: 1;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 20px;
    padding: 8px 16px;
    width: 300px;
    border: 1px solid #e5e7eb;
  }
  
  .search-icon {
    color: #9ca3af;
    margin-right: 8px;
  }
  
  .search-box input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.9rem;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
    cursor: pointer;
  }
  
  .notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    cursor: pointer;
    border: 1px solid #e5e7eb;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .user-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    color: #111827;
  }
  
  .user-info p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }
  
  /* Profile Dropdown Menu */
  .profile-dropdown {
    position: absolute;
    top: 60px;
    right: 0;
    width: 280px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 100;
    overflow: hidden;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #f3f4f6;
    position: relative;
  }
  
  .profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  
  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-header h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    color: #111827;
  }
  
  .profile-header p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }
  
  .logout-btn {
    position: absolute;
    right: 15px;
    top: 15px;
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
  }
  
  .logout-btn:hover {
    background-color: #fee2e2;
  }
  
  .profile-tabs {
    display: flex;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .tab-btn {
    flex: 1;
    padding: 12px;
    background: none;
    border: none;
    font-size: 0.9rem;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
  }
  
  .tab-btn.active {
    color: #2e5c31;
    font-weight: 500;
  }
  
  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2e5c31;
  }
  
  .tab-content {
    padding: 10px;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 15px;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.9rem;
    color: #4b5563;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .menu-item:hover {
    background-color: #f9fafb;
    color: #2e5c31;
  }
  
  .dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .metric-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  .metric-card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .metric-header h3 {
    font-size: 0.9rem;
    font-weight: 500;
    color: #6b7280;
    margin: 0;
  }
  
  .info-icon {
    color: #9ca3af;
    cursor: pointer;
  }
  
  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
  }
  
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
  
  .time-filters.small button {
    padding: 4px 8px;
    font-size: 0.75rem;
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
  
  .bottom-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
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
  
  .orders-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .orders-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .orders-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
  
  .status-filter {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .status-filter span {
    font-size: 0.9rem;
    color: #6b7280;
  }
  
  .status-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #111827;
    cursor: pointer;
  }
  
  .orders-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .orders-table th {
    text-align: left;
    padding: 12px 16px;
    font-size: 0.85rem;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .orders-table td {
    padding: 16px;
    font-size: 0.9rem;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .order-date {
    font-weight: 500;
  }
  
  .order-time {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .product-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .product-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
  }
  
  .product-icon img {
    width: 24px;
    height: 24px;
  }
  
  .product-icon.shoes {
    background-color: #e6f4e8;
  }
  
  .product-icon.t-shirt {
    background-color: #d1e7d3;
  }
  
  .product-info {
    font-weight: 500;
  }
  
  .product-category {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .status-badge.new-order {
    background-color: #e6f4e8;
    color: #2e5c31;
  }
  
  .status-badge.cancelled {
    background-color: #fef2f2;
    color: #dc2626;
  }
  
  .status-badge.on-deliver {
    background-color: #fff7ed;
    color: #ea580c;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }
  
  .status-dot.new {
    background-color: #2e5c31;
  }
  
  .status-dot.cancelled {
    background-color: #dc2626;
  }
  
  .status-dot.on-deliver {
    background-color: #ea580c;
  }
  
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  
  .pagination-info {
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .page-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: #fff;
    font-size: 0.85rem;
    color: #6b7280;
    cursor: pointer;
  }
  
  .page-btn.active {
    background-color: #2e5c31;
    color: #fff;
    border-color: #2e5c31;
  }
  
  .ellipsis {
    padding: 0 5px;
    color: #6b7280;
  }
  
  .next-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: #fff;
    color: #6b7280;
    cursor: pointer;
  }
  
  /* Dark mode styles */
  :global(.dark) .main-content {
    background-color: #111827;
  }
  
  :global(.dark) .search-box,
  :global(.dark) .metric-card,
  :global(.dark) .chart-container,
  :global(.dark) .performance-container,
  :global(.dark) .top-sales-container,
  :global(.dark) .orders-container,
  :global(.dark) .notification-icon,
  :global(.dark) .export-btn,
  :global(.dark) .status-btn,
  :global(.dark) .page-btn,
  :global(.dark) .next-btn,
  :global(.dark) .improve-btn,
  :global(.dark) .profile-dropdown {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  :global(.dark) .profile-header,
  :global(.dark) .profile-tabs,
  :global(.dark) .orders-table th,
  :global(.dark) .orders-table td {
    border-color: #374151;
  }
  
  :global(.dark) .tab-btn.active {
    color: #4a8f4d;
  }
  
  :global(.dark) .tab-btn.active::after {
    background-color: #4a8f4d;
  }
  
  :global(.dark) .menu-item:hover {
    background-color: #374151;
    color: #4a8f4d;
  }
  
  :global(.dark) .time-filters {
    background-color: #374151;
  }
  
  :global(.dark) .time-filters button.active {
    background-color: #4b5563;
    color: #4a8f4d;
  }
  
  :global(.dark) .metric-header h3,
  :global(.dark) .chart-header h3,
  :global(.dark) .orders-header h3,
  :global(.dark) .status-filter span,
  :global(.dark) .pagination-info,
  :global(.dark) .item-name,
  :global(.dark) .product-category,
  :global(.dark) .order-time,
  :global(.dark) .gauge-value .label,
  :global(.dark) .profile-header p,
  :global(.dark) .tab-btn {
    color: #9ca3af;
  }
  
  :global(.dark) .metric-value,
  :global(.dark) .revenue-amount,
  :global(.dark) .gauge-value .value,
  :global(.dark) .user-info h3,
  :global(.dark) .orders-table td,
  :global(.dark) .status-btn,
  :global(.dark) .page-btn,
  :global(.dark) .profile-header h3,
  :global(.dark) .menu-item {
    color: #f9fafb;
  }
  
  :global(.dark) .product-icon {
    background-color: #374151;
  }
  
  :global(.dark) .item-bar-container {
    background-color: #374151;
  }
  
  :global(.dark) .improve-btn {
    background-color: #4a8f4d;
  }
  
  :global(.dark) .improve-btn:hover {
    background-color: #3a7a3d;
  }
  </style>