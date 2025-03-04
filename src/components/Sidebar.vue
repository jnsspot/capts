<template>
  <div class="sidebar" :class="{ 'dark-mode': isDarkMode }">
    <div class="logo-container">
      <div class="logo-icon">
        <div class="logo-circle"></div>
      </div>
      <h1 class="logo-text">FarmXpress</h1>
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
  Tag, 
  MessageSquare, 
  ThumbsUp, 
  HelpCircle, 
  Settings,
  Sun,
  Moon,
  TrendingUp,
  Calendar,
  Truck,
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

const menuItems = [
  { name: 'Dashboard', path: '/seller-dashboard', icon: LayoutDashboard },
  { name: 'Farm Products', path: '/products', icon: Sprout },
  { name: 'Forecasting', path: '/forecasting', icon: TrendingUp },
  { name: 'Harvest Calendar', path: '/calendar', icon: Calendar },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Analytics', path: '/analytics', icon: BarChart },
  { name: 'Orders', path: '/orders', icon: Receipt },
  { name: 'Delivery', path: '/delivery', icon: Truck },
  { name: 'Promotions', path: '/promotions', icon: Tag },
  { name: 'Chat', path: '/chat', icon: MessageSquare, badge: 8 },
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

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setDarkMode();
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
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 10px;
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
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.nav-menu {
  flex: 1;
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin: 5px 0;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.active .nav-link {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.15);
  border-left: 3px solid #ffffff;
}

.nav-icon {
  margin-right: 12px;
  width: 20px;
  height: 20px;
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
  background: linear-gradient(135deg, #1a3a1c, #2e5c31);
}

.dark-mode .theme-toggle {
  background-color: rgba(0, 0, 0, 0.2);
}

.dark-mode .theme-btn.active {
  background-color: rgba(0, 0, 0, 0.3);
  color: #ffffff;
}
</style>