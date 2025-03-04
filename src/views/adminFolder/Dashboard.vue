<template>
  <div class="dashboard-container">
    <AdminSidebar initialActiveItem="Dashboard" />
    
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
            <span class="notification-badge">5</span>
          </div>
          <div class="avatar">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin avatar" />
          </div>
          <div class="user-info">
            <h3>Admin User</h3>
            <p>System Administrator</p>
          </div>
          
          <!-- Profile Dropdown Menu -->
          <div class="profile-dropdown" v-if="showProfileMenu">
            <div class="profile-header">
              <div class="profile-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin avatar" />
              </div>
              <div>
                <h3>Admin User</h3>
                <p>System Administrator</p>
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
                <Shield size="18" />
                Security
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
                <Bell size="18" />
                Notifications
              </button>
              <button class="menu-item">
                <Eye size="18" />
                Appearance
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div class="dashboard-content">
        <!-- Admin Dashboard Overview -->
        <div class="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div class="date-filter">
            <Calendar size="18" />
            <span>{{ currentDate }}</span>
            <ChevronDown size="16" />
          </div>
        </div>
        
        <!-- Metric Cards -->
        <div class="metric-cards">
          <div class="metric-card">
            <div class="metric-icon blue">
              <Store size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-header">
                <h3>Total Sellers</h3>
                <div class="info-icon">
                  <Info size="16" />
                </div>
              </div>
              <div class="metric-value">{{ totalSellers }}</div>
              <div class="metric-trend positive">
                <TrendingUp size="16" />
                <span>12.5% from last month</span>
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon green">
              <Users size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-header">
                <h3>Total Customers</h3>
                <div class="info-icon">
                  <Info size="16" />
                </div>
              </div>
              <div class="metric-value">{{ totalCustomers }}</div>
              <div class="metric-trend positive">
                <TrendingUp size="16" />
                <span>8.3% from last month</span>
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon purple">
              <UserPlus size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-header">
                <h3>Total Users</h3>
                <div class="info-icon">
                  <Info size="16" />
                </div>
              </div>
              <div class="metric-value">{{ totalUsers }}</div>
              <div class="metric-trend positive">
                <TrendingUp size="16" />
                <span>10.2% from last month</span>
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon orange">
              <ShoppingBag size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-header">
                <h3>Total Products</h3>
                <div class="info-icon">
                  <Info size="16" />
                </div>
              </div>
              <div class="metric-value">{{ totalProducts }}</div>
              <div class="metric-trend positive">
                <TrendingUp size="16" />
                <span>5.7% from last month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <!-- Seller Overview -->
          <div class="dashboard-card sellers-overview">
            <div class="card-header">
              <h3>Seller Overview</h3>
              <button class="view-all-btn" @click="navigateToSellers">View All</button>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Products</th>
                  <th>Revenue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(seller, index) in topSellers" :key="index">
                  <td>
                    <div class="seller-info">
                      <div class="seller-avatar">
                        <img :src="seller.avatar || '/placeholder.svg?height=40&width=40'" alt="Seller avatar" />
                      </div>
                      <div>
                        <div class="seller-name">{{ seller.name }}</div>
                        <div class="seller-location">{{ seller.location }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ seller.products }}</td>
                  <td>${{ seller.revenue.toLocaleString() }}</td>
                  <td>
                    <span class="status-badge" :class="seller.status.toLowerCase()">
                      {{ seller.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Product Categories -->
          <div class="dashboard-card product-categories">
            <div class="card-header">
              <h3>Product Categories</h3>
              <button class="add-btn" @click="navigateToAddCategory">
                <Plus size="16" />
                Add Category
              </button>
            </div>
            <div class="categories-grid">
              <div v-for="(category, index) in categories" :key="index" class="category-card">
                <div class="category-icon" :style="{ backgroundColor: getCategoryColor(index) }">
                  <component :is="getCategoryIcon(index)" size="24" color="white" />
                </div>
                <div class="category-info">
                  <h4>{{ category.categoryName }}</h4>
                  <p>{{ category.productCount || 0 }} Products</p>
                </div>
                <div class="category-actions">
                  <button class="action-btn" @click="editCategory(category)">
                    <Edit size="16" />
                  </button>
                  <button class="action-btn" @click="confirmDeleteCategory(category)">
                    <Trash size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Price Monitoring -->
          <div class="dashboard-card price-monitoring">
            <div class="card-header">
              <h3>Price Monitoring</h3>
              <div class="time-filters">
                <button v-for="(period, index) in timePeriods" 
                        :key="index" 
                        :class="{ active: activePeriod === period.value }"
                        @click="setActivePeriod(period.value)">
                  {{ period.label }}
                </button>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="priceChart"></canvas>
            </div>
          </div>
          
          <!-- Forecasting -->
          <div class="dashboard-card forecasting">
            <div class="card-header">
              <h3>Harvest Forecasting</h3>
              <select class="product-select">
                <option>Rice</option>
                <option>Corn</option>
                <option>Vegetables</option>
                <option>Fruits</option>
              </select>
            </div>
            <div class="chart-container">
              <canvas ref="forecastChart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="dashboard-card recent-activity">
          <div class="card-header">
            <h3>Recent Activity</h3>
            <button class="view-all-btn">View All</button>
          </div>
          <div class="activity-list">
            <div v-for="(activity, index) in activities" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <component :is="getActivityIcon(activity.type)" size="18" />
              </div>
              <div class="activity-content">
                <div class="activity-text" v-html="activity.text"></div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <div class="activity-actions">
                <button class="action-btn">
                  <MoreVertical size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import { 
  Search, 
  Bell, 
  Info, 
  Calendar,
  ChevronDown,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  Settings,
  Edit,
  Eye,
  Shield,
  LogOut,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  Truck,
  Plus,
  Trash,
  MoreVertical,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  Sprout,
  Leaf,
  Apple,
  Wheat
} from 'lucide-vue-next';
import AdminSidebar from '@/components/AdminSidebar.vue';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, query, where, limit, onSnapshot } from "firebase/firestore";

const router = useRouter();

// Profile dropdown state
const showProfileMenu = ref(false);
const activeTab = ref('profile');
const profileRef = ref(null);

// Chart references
const priceChart = ref(null);
const forecastChart = ref(null);

// Time periods
const timePeriods = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' }
];

// Active time period
const activePeriod = ref('1m');

// Current date
const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

// Data for metrics
const sellers = ref([]);
const customers = ref([]);
const products = ref([]);
const categories = ref([]);

// Computed properties for metrics
const totalSellers = computed(() => sellers.value.length);
const totalCustomers = computed(() => customers.value.length);
const totalUsers = computed(() => totalSellers.value + totalCustomers.value);
const totalProducts = computed(() => products.value.length);

// Top sellers for the seller overview
const topSellers = ref([
  {
    name: 'Green Harvest Farm',
    location: 'California',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    products: 48,
    revenue: 12450,
    status: 'Active'
  },
  {
    name: 'Sunshine Organics',
    location: 'Florida',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    products: 36,
    revenue: 9870,
    status: 'Active'
  },
  {
    name: 'Valley Fresh Produce',
    location: 'Oregon',
    avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
    products: 24,
    revenue: 7650,
    status: 'Pending'
  },
  {
    name: 'Mountain View Farms',
    location: 'Colorado',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    products: 18,
    revenue: 5430,
    status: 'Inactive'
  }
]);

// Activities data
const activities = [
  {
    type: 'user',
    text: '<strong>John Doe</strong> registered as a new seller',
    time: '2 hours ago'
  },
  {
    type: 'product',
    text: '<strong>15 new products</strong> were added by <strong>Green Harvest Farm</strong>',
    time: '4 hours ago'
  },
  {
    type: 'order',
    text: '<strong>Order #12345</strong> has been completed',
    time: '5 hours ago'
  },
  {
    type: 'alert',
    text: '<strong>Price alert:</strong> Tomato prices increased by 15%',
    time: '8 hours ago'
  },
  {
    type: 'system',
    text: 'System maintenance scheduled for <strong>tomorrow at 2:00 AM</strong>',
    time: '1 day ago'
  }
];

// Fetch data from Firestore
const fetchData = async () => {
  try {
    // Fetch sellers
    const sellersQuery = query(collection(db, "users"), where("role", "==", "seller"));
    const sellersSnapshot = await getDocs(sellersQuery);
    sellers.value = sellersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Fetch customers
    const customersQuery = query(collection(db, "users"), where("role", "==", "customer"));
    const customersSnapshot = await getDocs(customersQuery);
    customers.value = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Fetch products
    const productsSnapshot = await getDocs(collection(db, "products"));
    products.value = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Fetch categories with real-time updates
    const categoriesCollection = collection(db, "categories");
    const categoriesQuery = query(categoriesCollection, limit(4));
    
    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      categories.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
    
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Get category icon based on index
const getCategoryIcon = (index) => {
  const icons = [Sprout, Apple, Wheat, Leaf];
  return icons[index % icons.length];
};

// Get category color based on index
const getCategoryColor = (index) => {
  const colors = ['#4a8f4d', '#e05d44', '#f0b429', '#3b82f6'];
  return colors[index % colors.length];
};

// Toggle profile menu
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

// Set active tab
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

// Set active time period
const setActivePeriod = (period) => {
  activePeriod.value = period;
};

// Get activity icon based on type
const getActivityIcon = (type) => {
  const icons = {
    'user': User,
    'product': ShoppingBag,
    'order': Truck,
    'alert': AlertCircle,
    'system': CheckCircle,
    'message': MessageSquare
  };
  
  return icons[type] || Info;
};

// Navigation functions
const navigateToSellers = () => {
  router.push('/admin/sellers');
};

const navigateToAddCategory = () => {
  router.push('/add-category');
};

const editCategory = (category) => {
  router.push(`/add-category?id=${category.id}`);
};

const confirmDeleteCategory = (category) => {
  // This would typically show a confirmation modal
  console.log('Confirm delete category:', category);
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    showProfileMenu.value = false;
  }
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  
  // Fetch data from Firestore
  const unsubscribe = await fetchData();
  
  // Initialize Price Monitoring Chart
  if (priceChart.value) {
    const ctx = priceChart.value.getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Rice',
            data: [45, 47, 50, 48, 52, 55, 53, 58, 60],
            borderColor: '#4a8f4d',
            backgroundColor: 'rgba(74, 143, 77, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Vegetables',
            data: [30, 32, 35, 38, 36, 40, 42, 45, 43],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Fruits',
            data: [25, 28, 30, 32, 35, 34, 38, 40, 42],
            borderColor: '#e05d44',
            backgroundColor: 'rgba(224, 93, 68, 0.1)',
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
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      }
    });
  }
  
  // Initialize Forecasting Chart
  if (forecastChart.value) {
    const ctx = forecastChart.value.getContext('2d');
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Predicted Harvest (tons)',
            data: [120, 145, 135, 110, 95, 130],
            backgroundColor: '#4a8f4d',
          },
          {
            label: 'Actual Harvest (tons)',
            data: [125, 150, 130, 105, null, null],
            backgroundColor: '#f0b429',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Harvest Volume (tons)'
            }
          }
        }
      }
    });
  }
  
  return () => {
    // Clean up listeners
    document.removeEventListener('click', handleClickOutside);
    if (unsubscribe) unsubscribe();
  };
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
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  color: #3498db;
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3498db;
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
  color: #3498db;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #6b7280;
  cursor: pointer;
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
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-icon.blue {
  background-color: #3498db;
}

.metric-icon.green {
  background-color: #4a8f4d;
}

.metric-icon.purple {
  background-color: #8b5cf6;
}

.metric-icon.orange {
  background-color: #f59e0b;
}

.metric-content {
  flex: 1;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
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
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 5px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
}

.metric-trend.positive {
  color: #4a8f4d;
}

.metric-trend.negative {
  color: #ef4444;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.dashboard-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: #3498db;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background-color: #2980b9;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 12px 16px;
  font-size: 0.9rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.seller-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
}

.seller-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seller-name {
  font-weight: 500;
}

.seller-location {
  font-size: 0.8rem;
  color: #6b7280;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9fafb;
  position: relative;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-info {
  flex: 1;
}

.category-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #111827;
}

.category-info p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

.category-actions {
  display: flex;
  gap: 5px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.chart-container {
  height: 250px;
  position: relative;
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
  color: #3498db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-select {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #6b7280;
  background-color: #fff;
  outline: none;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9fafb;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-icon.user {
  background-color: #3498db;
}

.activity-icon.product {
  background-color: #4a8f4d;
}

.activity-icon.order {
  background-color: #8b5cf6;
}

.activity-icon.alert {
  background-color: #ef4444;
}

.activity-icon.system {
  background-color: #f59e0b;
}

.activity-icon.message {
  background-color: #06b6d4;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 0.8rem;
  color: #9ca3af;
}

@media (max-width: 1200px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metric-cards {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>