<template>
  <div class="orders-page">
    <div class="header">
      <button class="back-button" @click="$emit('navigate', 'HomePage')">
        <ChevronLeft size="22" />
      </button>
      <h1>My Orders</h1>
      <div class="header-buttons">
        <button class="icon-button" @click="$emit('navigate', 'Cart')">
          <ShoppingCart size="18" />
        </button>
        <button class="icon-button profile-icon">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
        </button>
      </div>
    </div>
    
    <div class="content">
      <div class="tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'active' }"
          @click="activeTab = 'active'"
        >
          Active
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'completed' }"
          @click="activeTab = 'completed'"
        >
          Completed
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'cancelled' }"
          @click="activeTab = 'cancelled'"
        >
          Cancelled
        </button>
      </div>
      
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">
          <Package size="60" />
        </div>
        <h2>No {{ activeTab }} orders</h2>
        <p>Your {{ activeTab }} orders will appear here</p>
        <button v-if="activeTab === 'active'" class="shop-now-btn" @click="$emit('navigate', 'HomePage')">Shop Now</button>
      </div>
      
      <div v-else class="orders-list">
        <div class="order-card" v-for="(order, index) in filteredOrders" :key="index">
          <div class="order-header">
            <div>
              <h3>Order #{{ order.orderCode }}</h3>
              <p class="order-date">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="order-status" :class="order.status.toLowerCase()">
              {{ order.status }}
            </div>
          </div>
          
          <div class="order-items">
            <div class="order-item">
              <div class="item-image">
                <img :src="order.productImage" :alt="order.productName">
              </div>
              <div class="item-details">
                <h4>{{ order.productName }}</h4>
                <p class="item-quantity">{{ order.weight }} x ₱{{ order.price }}</p>
              </div>
              <p class="item-total">₱{{ order.totalPrice.toFixed(2) }}</p>
            </div>
          </div>
          
          <div class="order-footer">
            <div class="order-total">
              <span>Total:</span>
              <span class="total-amount">₱{{ order.totalPrice.toFixed(2) }}</span>
            </div>
            
            <div class="order-actions">
              <button v-if="order.status === 'Processing' || order.status === 'Shipped'" class="track-btn">
                <MapPin size="14" />
                Track Order
              </button>
              <button v-if="order.status === 'Delivered'" class="reorder-btn">
                <RefreshCw size="14" />
                Reorder
              </button>
              <button v-if="order.status === 'Processing'" class="cancel-btn">
                <X size="14" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <bottom-navigation active-tab="orders" @navigate="$emit('navigate', $event)" />
    
  </div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation.vue';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Package, 
  MapPin, 
  RefreshCw, 
  X 
} from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  components: {
    BottomNavigation,
    ChevronLeft,
    ShoppingCart,
    Package,
    MapPin,
    RefreshCw,
    X
  },
  setup() {
    const activeTab = ref('active');
    const orders = ref([]);
    const db = getFirestore();
    const auth = getAuth();
    
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    const fetchOrders = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        
        const q = query(collection(db, 'orders'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        orders.value = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            orderCode: data.orderCode,
            productImage: data.productImage,
            productName: data.productName,
            weight: data.weight,
            price: data.price,
            totalPrice: data.totalPrice,
            status: data.status,
            createdAt: data.createdAt,
            userId: data.userId,
            type: data.status === 'Delivered' ? 'completed' : 
                  data.status === 'Cancelled' ? 'cancelled' : 'active'
          };
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    
    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        if (activeTab.value === 'active') {
          return order.status === 'Processing' || order.status === 'Shipped';
        } else if (activeTab.value === 'completed') {
          return order.status === 'Delivered';
        } else if (activeTab.value === 'cancelled') {
          return order.status === 'Cancelled';
        }
        return true;
      });
    });
    
    onMounted(() => {
      fetchOrders();
    });
    
    return {
      activeTab,
      orders,
      filteredOrders,
      formatDate
    };
  }
}
</script>

<style scoped>
/* All the styles remain exactly the same as in your original file */
.orders-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 15px;
  background-color: #2e5c31;
  color: white;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header h1 {
  font-size: 18px;
  font-weight: 600;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.icon-button {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.profile-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  flex: 1;
  padding: 20px 15px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.tabs {
  display: flex;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 15px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  background: none;
  border: none;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: #2e5c31;
  background-color: rgba(46, 92, 49, 0.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 20px;
}

.empty-icon {
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.empty-state p {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.shop-now-btn {
  padding: 12px 30px;
  background-color: #2e5c31;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(46, 92, 49, 0.3);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.order-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.order-date {
  font-size: 12px;
  color: #666;
}

.order-status {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 15px;
}

.order-status.processing {
  background-color: #fff8e1;
  color: #ffa000;
}

.order-status.shipped {
  background-color: #e1f5fe;
  color: #0288d1;
}

.order-status.delivered {
  background-color: #e8f5e9;
  color: #2e5c31;
}

.order-status.cancelled {
  background-color: #ffebee;
  color: #e53935;
}

.order-items {
  padding: 15px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 40px;
  height: 40px;
  background-color: #f9f9f9;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.item-image img {
  width: 25px;
  height: 25px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
  color: #333;
}

.item-quantity {
  font-size: 12px;
  color: #666;
}

.item-total {
  font-size: 14px;
  font-weight: 600;
  color: #2e5c31;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.order-total {
  font-size: 14px;
  color: #666;
}

.total-amount {
  font-size: 16px;
  font-weight: 700;
  color: #2e5c31;
  margin-left: 5px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.track-btn, .reorder-btn, .cancel-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
}

.track-btn {
  background-color: #e1f5fe;
  color: #0288d1;
}

.reorder-btn {
  background-color: #e8f5e9;
  color: #2e5c31;
}

.cancel-btn {
  background-color: #ffebee;
  color: #e53935;
}
</style>