<template>
  <div class="dashboard-container">
    <Sidebar initialActiveItem="Dashboard" />
    
    <!-- Logout Confirmation Modal -->
    <ConfirmModal 
      :isVisible="showLogoutModal" 
      @confirm="handleLogoutConfirm" 
      @cancel="handleLogoutCancel"
    >
      <template #default>
        <p>Are you sure you want to logout?</p>
      </template>
    </ConfirmModal>
    
    <div class="main-content">
      <header class="header">
        <div class="search-container">
          <div class="search-box">
            <Search size="18" class="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        
        <div class="user-profile" @click.stop="toggleProfileMenu" ref="profileRef">
          <div class="notification-icon">
            <Bell size="20" />
          </div>
          <div class="avatar">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
          </div>
          <div class="user-info">
            <h3>{{ firstName }} {{ lastName }}</h3>
            
            <p>Lead of Sales</p>
          </div>

          <!-- Profile Dropdown Menu -->
          <div class="profile-dropdown" v-if="showProfileMenu">
            <div class="profile-header">
              <div class="profile-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
              </div>
              <div>
                <h3>{{ accountName }}</h3>
                <p>{{ farmName }}</p>
              </div>
              <button class="logout-btn" @click.stop="initiateLogout">
                <LogOut size="18" />
              </button>
            </div>
            
            <div class="profile-tabs">
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'profile' }" 
                @click.stop="setActiveTab('profile')"
              >
                <User size="18" />
                Profile
              </button>
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'setting' }" 
                @click.stop="setActiveTab('setting')"
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
              <button class="menu-item" @click.stop="initiateLogout">
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
        <SalesRevenueChart :totalRevenue="totalRevenue" />
        
        <div class="bottom-section">
          <!-- Sales Performance -->
          <SalesPerformance :performanceScore="80" performanceMessage="You're Good 👍" />
          
          <!-- Top 10 Sales -->
          <TopSales :salesItems="topSalesItems" :timePeriods="timePeriods" :activePeriod="topSalesPeriod" @setActivePeriod="setTopSalesPeriod" />
        </div>
        
        <!-- Recent Orders -->
        <RecentOrders :orders="recentOrders" :totalOrders="1025" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { 
  Search, 
  Bell, 
  Info,
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
import Sidebar from '@/components/Sidebar.vue';
import SalesRevenueChart from '@/components/SalesRevenueChart.vue';
import SalesPerformance from '@/components/SalesPerformance.vue';
import TopSales from '@/components/TopSales.vue';
import RecentOrders from '@/components/RecentOrders.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import { auth, db } from '@/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';


const router = useRouter();

// User data
const firstName = ref('');
const lastName = ref('');
const accountName = ref('');
const farmName = ref('');

// Logout modal state
const showLogoutModal = ref(false);

// Fetch user data
const fetchUserData = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    console.log('Fetching data for user ID:', userId); // Debug log

    // Fetch from users collection
    const userDoc = await getDoc(doc(db, 'users', userId));
    console.log('User document:', userDoc.exists() ? userDoc.data() : 'No user document'); // Debug log

    if (userDoc.exists()) {
      const userData = userDoc.data();
      firstName.value = userData.firstName || '';
      lastName.value = userData.lastName || '';
    }

    // Fetch from sellers collection
    const sellerDoc = await getDoc(doc(db, 'sellers', userId));
    console.log('Seller document:', sellerDoc.exists() ? sellerDoc.data() : 'No seller document'); // Debug log

    if (sellerDoc.exists()) {
      const sellerData = sellerDoc.data();
      accountName.value = sellerData.accountName || '';
      farmName.value = sellerData.farmName || '';
      
      console.log('Fetched seller data:', { // Debug log
        accountName: accountName.value,
        farmName: farmName.value
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

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

// Logout functions
const initiateLogout = () => {
  showLogoutModal.value = true;
  showProfileMenu.value = false;
};

const handleLogoutConfirm = async () => {
  try {
    localStorage.clear();
    sessionStorage.clear();
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  } finally {
    showLogoutModal.value = false;
  }
};

const handleLogoutCancel = () => {
  showLogoutModal.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchUserData();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Metrics data
const metrics = [
  { title: 'New Order', value: '156' },
  { title: 'Ready to Ship', value: '88' },
  { title: 'New Review', value: '243' },
  { title: 'New Message', value: '144' }
];

// Time periods
const timePeriods = [
  { label: '1H', value: '1h' },
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '1M', value: '1m' },
  { label: '1Y', value: '1y' }
];

// Active time period for top sales
const topSalesPeriod = ref('1m');

// Total revenue
const totalRevenue = ref(1587000);

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

// Set top sales time period
const setTopSalesPeriod = (period) => {
  topSalesPeriod.value = period;
};
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
  margin-left: 230px; /* Match sidebar width */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
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
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 0 0 2px rgba(74, 143, 77, 0.2);
  border-color: #4a8f4d;
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
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.metric-card:nth-child(1) {
  border-left-color: #4a8f4d;
}

.metric-card:nth-child(2) {
  border-left-color: #f59e0b;
}

.metric-card:nth-child(3) {
  border-left-color: #3b82f6;
}

.metric-card:nth-child(4) {
  border-left-color: #8b5cf6;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.metric-card:nth-child(1) .metric-value {
  color: #4a8f4d;
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

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Dark mode styles */
:global(.dark) .main-content {
  background-color: #111827;
}

:global(.dark) .search-box,
:global(.dark) .metric-card,
:global(.dark) .notification-icon,
:global(.dark) .profile-dropdown {
  background-color: #1f2937;
  border-color: #374151;
}

:global(.dark) .metric-header h3 {
  color: #9ca3af;
}

:global(.dark) .metric-value,
:global(.dark) .user-info h3 {
  color: #f9fafb;
}

:global(.dark) .user-info p {
  color: #9ca3af;
}

:global(.dark) .profile-header,
:global(.dark) .profile-tabs {
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
</style>