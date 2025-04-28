<template>
  <div class="sidebar" :class="{ 'dark-mode': isDarkMode, 'collapsed': isCollapsed }">
    <div class="logo-container">
      <div class="logo-icon">
        <div class="logo-circle"></div>
      </div>
      <h1 class="logo-text">FarmXpress</h1>
      <button class="hamburger-btn" @click="toggleSidebar">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
    </div>
    
    <nav class="nav-menu">
      <ul>
        <li v-for="(item, index) in menuItems" :key="index" 
            :class="{ active: activeItem === item.name }"
            @click="setActiveItem(item.name)">
          <router-link :to="item.path" class="nav-link">
            <component :is="item.icon" class="nav-icon" />
            <span class="nav-text">{{ item.name }}</span>
            <span v-if="item.badge" class="badge">{{ item.badge }}</span>
          </router-link>
        </li>
      </ul>
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
import { ref, onMounted } from 'vue';
import { 
  LayoutDashboard, 
  Sprout, 
  Users, 
  BarChart, 
  Receipt, 
  MessageSquare, 
  ThumbsUp, 
  HelpCircle, 
  Settings,
  Sun,
  Moon,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-vue-next';

const props = defineProps({
  initialActiveItem: {
    type: String,
    default: 'Dashboard'
  }
});

const activeItem = ref(props.initialActiveItem);
const isDarkMode = ref(false);
const isCollapsed = ref(false);

const menuItems = [
  { name: 'Dashboard', path: '/seller-dashboard', icon: LayoutDashboard },
  { name: 'Farm Products', path: '/products', icon: Sprout },
  { name: 'Forecasting', path: '/seller/forecasting', icon: TrendingUp },
  { name: 'Harvest Calendar', path: '/calendar', icon: Calendar },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Analytics', path: 'seller/analytics', icon: BarChart },
  { name: 'Orders', path: '/orders', icon: Receipt },
  { name: 'Chat', path: 'seller/chat', icon: MessageSquare, badge: 8 },
  { name: 'Feedback', path: '/feedback', icon: ThumbsUp },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Help', path: '/help', icon: HelpCircle },
  { name: 'Settings', path: '/settings', icon: Settings }
];

const setActiveItem = (itemName) => {
  activeItem.value = itemName;
};

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

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isCollapsed.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setDarkMode();
  }
  
  const savedCollapseState = localStorage.getItem('sidebarCollapsed');
  if (savedCollapseState === 'true') {
    isCollapsed.value = true;
  }
});
</script>

<style scoped>
.sidebar {
  width: 230px;
  height: 100vh;
  background: linear-gradient(135deg, #2e5c31, #4a8f4d);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  padding: 0;
}

.sidebar.collapsed {
  width: 70px;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  gap: 8px;
  position: relative;
  margin: 0;
  min-height: 56px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.sidebar.collapsed .logo-icon {
  width: 0;
  opacity: 0;
  overflow: hidden;
}

.logo-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  transition: all 0.3s ease;
}

.sidebar.collapsed .logo-circle {
  opacity: 0;
  width: 0;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.sidebar.collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.hamburger-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: absolute;
  right: 8px;
  width: 40px;
  height: 40px;
}

.sidebar.collapsed .hamburger-btn {
  position: static;
  margin: 0 auto;
}

.hamburger-btn svg {
  width: 24px;
  height: 24px;
}

.hamburger-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-menu {
  flex: 1;
  margin-top: 8px;
  padding: 0 8px;
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin: 6px 0;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 6px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.active .nav-link {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.15);
  border-left: 3px solid #ffffff;
  font-weight: 600;
}

.nav-icon {
  margin-right: 12px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.nav-text {
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
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

.sidebar.collapsed .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  transform: scale(0.8);
}

.theme-toggle {
  display: flex;
  margin: 12px 8px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sidebar.collapsed .theme-toggle {
  flex-direction: column;
  align-items: center;
  padding: 4px;
  gap: 4px;
}

.sidebar.collapsed .theme-toggle span {
  display: none;
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
  white-space: nowrap;
  font-size: 0.85rem;
}

.theme-btn.active {
  background-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* Dark mode styles */
.dark-mode {
  background: linear-gradient(135deg, #1a3a1c, #2e5c31);
}

.dark-mode .theme-toggle {
  background-color: rgba(0, 0, 0, 0.2);
}

.dark-mode .theme-btn.active {
  background-color: rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

/* Tooltip for collapsed state */
.sidebar.collapsed li {
  position: relative;
}

.sidebar.collapsed li:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4a8f4d;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  white-space: nowrap;
  z-index: 1000;
  margin-left: 10px;
  pointer-events: none;
}
</style>