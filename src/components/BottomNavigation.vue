<template>
  <div class="bottom-navigation">
    <button 
      class="nav-item" 
      :class="{ active: activeTab === '/' }"
      @click="navigate('/')"
    >
      <Home :size="iconSize" />
      <span>Home</span>
    </button>
    <button 
      class="nav-item" 
      :class="{ active: activeTab === '/likes' }"
      @click="navigate('/likes')"
    >
      <Heart :size="iconSize" />
      <span>Likes</span>
    </button>
    <button 
      class="nav-item" 
      :class="{ active: activeTab === '/messages' }"
      @click="navigate('/messages')"
    >
      <MessageCircle :size="iconSize" />
      <span>Messages</span>
    </button>
    <button 
      class="nav-item" 
      :class="{ active: activeTab === '/customer-orders' }"
      @click="navigate('/customer-orders')"
    >
      <Package :size="iconSize" />
      <span>Orders</span>
    </button>
    <button 
      class="nav-item" 
      :class="{ active: activeTab === '/cart' }"
      @click="navigate('/cart')"
    >
      <ShoppingCart :size="iconSize" />
      <span>Cart</span>
    </button>
  </div>
</template>

<script>
import { Home, Heart, MessageCircle, Package, ShoppingCart } from 'lucide-vue-next';

export default {
  components: {
    Home,
    Heart,
    MessageCircle,
    Package,
    ShoppingCart
  },
  props: {
    activeTab: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      iconSize: 20
    }
  },
  methods: {
    navigate(path) {
      this.$emit('navigate', path);
    }
  }
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #999;
  background: none;
  border: none;
  padding: 10px;
  transition: all 0.2s ease;
  width: 20%;
}

.nav-item span {
  font-size: 12px;
  font-weight: 500;
}

.nav-item.active {
  color: #2e5c31;
}
</style>