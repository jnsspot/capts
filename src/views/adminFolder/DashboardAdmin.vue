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
            <h3>{{ adminData ? `${adminData.firstName} ${adminData.lastName}` : 'Loading...' }}</h3>
            <p>{{ adminData ? adminData.email : 'Loading...' }}</p>
          </div>
          
          <!-- Profile Dropdown Menu -->
          <div class="profile-dropdown" v-if="showProfileMenu">
            <div class="profile-header">
              <div class="profile-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin avatar" />
              </div>
              <div>
                <h3>{{ adminData ? `${adminData.firstName} ${adminData.lastName}` : 'Loading...' }}</h3>
                <p>{{ adminData ? adminData.email : 'Loading...' }}</p>
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
              <button class="menu-item" @click="navigateToEditProfile">
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
          <SellerOverview />
          
          <!-- Product Categories -->
          <ProductCategories />
          
          <!-- Price Monitoring -->
          <PriceMonitoring />
          
          <!-- Forecasting -->
          <HarvestForecasting />
        </div>
        
        <!-- Recent Activity -->
        <RecentActivity />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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
  Store,
  Users,
  ShoppingBag
} from 'lucide-vue-next';
import AdminSidebar from '@/components/AdminSidebar.vue';
import SellerOverview from '@/components/admindashboard/SellerOverview.vue';
import ProductCategories from '@/components/admindashboard/ProductCategories.vue';
import PriceMonitoring from '@/components/admindashboard/PriceMonitoring.vue';
import HarvestForecasting from '@/components/admindashboard/HarvestForecasting.vue';
import RecentActivity from '@/components/admindashboard/RecentActivity.vue';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase Auth
const auth = getAuth();

// Vue Router
const router = useRouter();

// State
const showProfileMenu = ref(false);
const activeTab = ref('profile');
const profileRef = ref(null);
const adminData = ref(null);
const totalSellers = ref(0);
const totalCustomers = ref(0);
const totalUsers = ref(0);
const totalProducts = ref(0);

// Computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Methods
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const navigateToEditProfile = () => {
  router.push('/admin/edit-profile');
};

// Fetch admin data
const fetchAdminData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const adminQuery = query(
      collection(db, 'admins'),
      where('email', '==', user.email)
    );
    const querySnapshot = await getDocs(adminQuery);
    
    if (!querySnapshot.empty) {
      adminData.value = querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }
};

// Fetch dashboard metrics
const fetchDashboardMetrics = async () => {
  try {
    // Fetch total sellers
    const sellersSnapshot = await getDocs(collection(db, 'sellers'));
    totalSellers.value = sellersSnapshot.size;

    // Fetch total customers
    const customersSnapshot = await getDocs(collection(db, 'customers'));
    totalCustomers.value = customersSnapshot.size;

    // Fetch total users (sellers + customers)
    totalUsers.value = totalSellers.value + totalCustomers.value;

    // Fetch total products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    totalProducts.value = productsSnapshot.size;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchAdminData();
  fetchDashboardMetrics();
  
  // Close profile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (profileRef.value && !profileRef.value.contains(e.target)) {
      showProfileMenu.value = false;
    }
  });
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-left: 250px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-icon {
  color: #666;
  margin-right: 0.5rem;
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
  gap: 1rem;
  cursor: pointer;
  position: relative;
}

.notification-icon {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 50%;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h3 {
  font-size: 0.9rem;
  margin: 0;
}

.user-info p {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.profile-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.logout-btn {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.tab-btn.active {
  color: #4CAF50;
  border-bottom: 2px solid #4CAF50;
}

.tab-content {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.metric-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon.blue {
  background-color: #e3f2fd;
  color: #1976d2;
}

.metric-icon.green {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.metric-icon.purple {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.metric-icon.orange {
  background-color: #fff3e0;
  color: #f57c00;
}

.metric-content {
  flex: 1;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.metric-header h3 {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.info-icon {
  color: #999;
  cursor: pointer;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
}

.metric-trend.positive {
  color: #2e7d32;
}

.metric-trend.negative {
  color: #c62828;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .metric-cards {
    grid-template-columns: 1fr;
  }
}
</style> 