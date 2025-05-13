<template>
  <div class="bottom-navigation">
    <button 
      v-for="item in navigationItems" 
      :key="item.path"
      class="nav-item" 
      :class="{ active: activeTab === item.path }"
      @click="navigate(item.path)"
    >
      <component 
        :is="item.icon" 
        :size="iconSize" 
        :fill="activeTab === item.path ? '#2e5c31' : 'none'" 
        :stroke="activeTab === item.path ? '#2e5c31' : '#2e5c31'" 
        stroke-width="2" 
      />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Home, Heart, MessageCircle, Package, ShoppingCart } from 'lucide-vue-next';

const props = defineProps({
  activeTab: {
    type: String,
    default: '/'
  }
});

const emit = defineEmits(['navigate', 'tab-change']);

const iconSize = 24;

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/likes', label: 'Likes', icon: Heart },
  { path: '/messages', label: 'Messages', icon: MessageCircle },
  { path: '/customer/orders', label: 'Orders', icon: Package },
  { path: '/cart', label: 'Cart', icon: ShoppingCart }
];

const navigate = (path) => {
  emit('navigate', path);
  emit('tab-change', path);
};
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  width: 20%;
}

.nav-item span {
  font-size: 12px;
  margin-top: 4px;
}

.nav-item.active {
  color: #2e5c31;
}

@media (max-width: 768px) {
  .bottom-navigation {
    height: 56px;
  }

  .nav-item span {
    font-size: 11px;
  }
}
</style>