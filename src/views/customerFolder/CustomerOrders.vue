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
                <h3>Order #{{ order.id }}</h3>
                <p class="order-date">{{ order.date }}</p>
              </div>
              <div class="order-status" :class="order.status.toLowerCase()">
                {{ order.status }}
              </div>
            </div>
            
            <div class="order-items">
              <div class="order-item" v-for="(item, itemIndex) in order.items" :key="itemIndex">
                <div class="item-image">
                  <img :src="item.image" :alt="item.name">
                </div>
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p class="item-quantity">{{ item.quantity }} x ₱{{ item.price }}</p>
                </div>
                <p class="item-total">₱{{ (item.quantity * item.price).toFixed(2) }}</p>
              </div>
            </div>
            
            <div class="order-footer">
              <div class="order-total">
                <span>Total:</span>
                <span class="total-amount">₱{{ order.total.toFixed(2) }}</span>
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
  import { ref, computed } from 'vue';
  
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
      
      const orders = ref([
        {
          id: '12345',
          date: 'June 15, 2023',
          status: 'Processing',
          total: 425,
          items: [
            {
              name: 'Organic Lettuce',
              quantity: 2,
              price: 65,
              image: 'https://cdn-icons-png.flaticon.com/512/5346/5346493.png'
            },
            {
              name: 'Fresh Tomatoes',
              quantity: 1,
              price: 45,
              image: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png'
            },
            {
              name: 'Free-Range Chicken',
              quantity: 1,
              price: 220,
              image: 'https://cdn-icons-png.flaticon.com/512/1046/1046769.png'
            }
          ],
          type: 'active'
        },
        {
          id: '12344',
          date: 'June 10, 2023',
          status: 'Shipped',
          total: 195,
          items: [
            {
              name: 'Fresh Mangoes',
              quantity: 1,
              price: 120,
              image: 'https://cdn-icons-png.flaticon.com/512/6866/6866569.png'
            },
            {
              name: 'Organic Avocado',
              quantity: 1,
              price: 75,
              image: 'https://cdn-icons-png.flaticon.com/512/1147/1147801.png'
            }
          ],
          type: 'active'
        },
        {
          id: '12343',
          date: 'June 5, 2023',
          status: 'Delivered',
          total: 335,
          items: [
            {
              name: 'Carabao Milk',
              quantity: 2,
              price: 95,
              image: 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png'
            },
            {
              name: 'Fresh Strawberries',
              quantity: 1,
              price: 180,
              image: 'https://cdn-icons-png.flaticon.com/512/590/590685.png'
            }
          ],
          type: 'completed'
        },
        {
          id: '12342',
          date: 'May 28, 2023',
          status: 'Cancelled',
          total: 165,
          items: [
            {
              name: 'Native Carrots',
              quantity: 1,
              price: 60,
              image: 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png'
            },
            {
              name: 'Fresh Kalabasa',
              quantity: 1,
              price: 45,
              image: 'https://cdn-icons-png.flaticon.com/512/2909/2909842.png'
            },
            {
              name: 'Pandesal',
              quantity: 1,
              price: 50,
              image: 'https://cdn-icons-png.flaticon.com/512/3014/3014438.png'
            }
          ],
          type: 'cancelled'
        }
      ]);
      
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
      
      return {
        activeTab,
        orders,
        filteredOrders
      };
    }
  }
  </script>
  
  <style scoped>
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