<template>
  <div class="sidebar" :class="{ 'dark-mode': isDarkMode }">
    <div class="logo-container">
      <div class="logo-icon">
        <div class="logo-circle"></div>
      </div>
      <div class="logo-text-container">
        <h1 class="logo-text">FarmXpress</h1>
        <span class="admin-badge">ADMIN</span>
      </div>
    </div>
    
    <nav class="nav-menu">
      <div class="menu-section">
        <span class="section-title">MAIN</span>
        <ul>
          <li v-for="(item, index) in mainMenuItems" :key="index" 
              :class="{ active: activeItem === item.name }"
              @click="setActiveItem(item.name)">
            <router-link :to="item.path" class="nav-link">
              <component :is="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.name }}</span>
              <span v-if="item.badge" class="badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="menu-section">
        <span class="section-title">MANAGEMENT & ANALYTICS</span>
        <ul>
          <li v-for="(item, index) in otherMenuItems" :key="index" 
              :class="{ active: activeItem === item.name }"
              @click="setActiveItem(item.name)">
            <router-link :to="item.path" class="nav-link">
              <component :is="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.name }}</span>
              <span v-if="item.badge" class="badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    
    <div class="theme-toggle">
      <button class="theme-btn" :class="{ active: !isDarkMode }" @click="setLightMode">
        <Sun size="18" />
        <span>Light</span>
      </button>
      <button class="theme-btn" :class="{ active: isDarkMode }" @click="setDarkMode">
        <Moon size="18" />
        <span>Dark</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute from Vue Router
import { 
  LayoutDashboard, 
  Users, 
  UserCog,
  Store,
  ShoppingBag,
  Layers,
  TrendingUp,
  DollarSign,
  MessageSquare, 
  Bell,
  Settings,
  HelpCircle,
  FileText,
  Sun,
  Moon,
  LineChart
} from 'lucide-vue-next';

const route = useRoute(); // Get the current route
const activeItem = ref('');
const isDarkMode = ref(false);

// Main menu items
const mainMenuItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell, badge: 12 },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare, badge: 5 }
];

// Other menu items (Management & Analytics)
const otherMenuItems = [
  { name: 'Sellers', path: '/admin/sellers', icon: Store },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Product Categories', path: '/admin/categories', icon: Layers },
  { name: 'Products', path: '/admin/products', icon: ShoppingBag },
  { name: 'Forecasting', path: '/admin/forecasting', icon: TrendingUp },
  { name: 'Price Monitoring', path: '/admin/price-monitoring', icon: DollarSign },
  { name: 'Trends', path: '/admin/trends', icon: LineChart },
  { name: 'User Management', path: '/admin/user-management', icon: UserCog },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
  { name: 'Help', path: '/admin/help', icon: HelpCircle }
];

// Function to set the active item based on the current route
const setActiveItemFromRoute = () => {
  const currentPath = route.path; // Get the current path
  const allMenuItems = [...mainMenuItems, ...otherMenuItems]; // Combine all menu items
  const activeMenuItem = allMenuItems.find(item => item.path === currentPath); // Find the matching item
  if (activeMenuItem) {
    activeItem.value = activeMenuItem.name; // Set the active item
  }
};

// Function to manually set the active item
const setActiveItem = (itemName) => {
  activeItem.value = itemName;
};

// Watch for route changes and update the active item
watch(() => route.path, () => {
  setActiveItemFromRoute();
});

// Set the active item when the component is mounted
onMounted(() => {
  setActiveItemFromRoute();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setDarkMode();
  }
});

const setLightMode = () => {
  isDarkMode.value = false;
  document.body.classList.remove('dark');
  localStorage.setItem('theme', 'light');
};

const setDarkMode = () => {
  isDarkMode.value = true;
  document.body.classList.add('dark');
  localStorage.setItem('theme', 'dark');
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: #2e5c31;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: white;
  position: fixed; /* Make the sidebar fixed */
  top: 0;
  left: 0;
  z-index: 1000; /* Ensure it stays on top */
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 10px;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.admin-badge {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.nav-menu {
  flex: 1;
  padding: 10px 0;
}

.menu-section {
  margin-bottom: 20px;
}

.section-title {
  display: block;
  padding: 10px 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover, .active .nav-link {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.active .nav-link {
  background-color: rgba(255, 255, 255, 0.15);
  border-left: 3px solid #ffffff;
}

.nav-icon {
  margin-right: 12px;
  width: 18px;
  height: 18px;
}

.badge {
  background-color: #ffffff;
  color: #2e5c31;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  margin-left: auto;
  font-weight: bold;
}

.theme-toggle {
  display: flex;
  margin: 20px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 4px;
}

.theme-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.theme-btn.active {
  background-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* Dark mode styles */
.dark-mode {
  background: #1a3a1c;
}

.dark-mode .theme-toggle {
  background-color: rgba(0, 0, 0, 0.2);
}

.dark-mode .theme-btn.active {
  background-color: rgba(0, 0, 0, 0.3);
  color: #ffffff;
}
</style>