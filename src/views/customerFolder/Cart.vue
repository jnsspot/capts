<template>
    <div class="cart-page">
      <div class="header">
        <button class="back-button" @click="$emit('navigate', 'HomePage')">
          <ChevronLeft size="22" />
        </button>
        <h1>My Cart</h1>
        <div class="header-buttons">
          <button class="icon-button profile-icon">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
          </button>
        </div>
      </div>
      
      <div class="content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-cart-icon">
            <ShoppingCart size="60" />
          </div>
          <h2>Your cart is empty</h2>
          <p>Browse our farm-fresh products and add items to your cart</p>
          <button class="shop-now-btn" @click="$emit('navigate', 'HomePage')">Shop Now</button>
        </div>
        
        <template v-else>
          <div class="cart-items">
            <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
              <div class="item-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-shop">{{ item.shop }}</p>
                <p class="item-weight">{{ item.weight }}</p>
              </div>
              <div class="item-actions">
                <div class="quantity-controls">
                  <button @click="decreaseQuantity(index)" class="quantity-btn">
                    <Minus size="14" />
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(index)" class="quantity-btn">
                    <Plus size="14" />
                  </button>
                </div>
                <p class="item-price">₱{{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
              <button class="remove-btn" @click="removeItem(index)">
                <Trash2 size="16" />
              </button>
            </div>
          </div>
          
          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₱{{ calculateSubtotal().toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Fee</span>
              <span>₱{{ deliveryFee.toFixed(2) }}</span>
            </div>
            <div class="summary-row discount" v-if="discount > 0">
              <span>Discount</span>
              <span>-₱{{ discount.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>₱{{ calculateTotal().toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="promo-code">
            <input type="text" placeholder="Enter promo code" v-model="promoCode">
            <button @click="applyPromoCode">Apply</button>
          </div>
          
          <div class="checkout-section">
            <button class="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </template>
      </div>
      
      <bottom-navigation active-tab="cart" @navigate="$emit('navigate', $event)" />
    </div>
  </template>
  
  <script>
  import BottomNavigation from '@/components/BottomNavigation.vue';
  import { 
    ChevronLeft, 
    ShoppingCart, 
    Minus, 
    Plus, 
    Trash2 
  } from 'lucide-vue-next';
  import { ref } from 'vue';
  
  export default {
    components: {
      BottomNavigation,
      ChevronLeft,
      ShoppingCart,
      Minus,
      Plus,
      Trash2
    },
    setup() {
      // Sample cart items - in a real app, this would be passed from a store or parent component
      const cartItems = ref([
        {
          id: 1,
          name: 'Fresh Kalabasa',
          shop: 'Batangas Farms',
          weight: '500 gm',
          price: 45,
          quantity: 2,
          image: 'https://cdn-icons-png.flaticon.com/512/2909/2909842.png'
        },
        {
          id: 2,
          name: 'Organic Avocado',
          shop: 'Davao Growers',
          weight: '450 gm',
          price: 75,
          quantity: 1,
          image: 'https://cdn-icons-png.flaticon.com/512/1147/1147801.png'
        },
        {
          id: 3,
          name: 'Native Carrots',
          shop: 'Baguio Farms',
          weight: '1000 gm',
          price: 60,
          quantity: 1,
          image: 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png'
        }
      ]);
      
      const promoCode = ref('');
      const discount = ref(0);
      const deliveryFee = ref(50);
      
      const increaseQuantity = (index) => {
        cartItems.value[index].quantity += 1;
      };
      
      const decreaseQuantity = (index) => {
        if (cartItems.value[index].quantity > 1) {
          cartItems.value[index].quantity -= 1;
        }
      };
      
      const removeItem = (index) => {
        cartItems.value.splice(index, 1);
      };
      
      const calculateSubtotal = () => {
        return cartItems.value.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      };
      
      const calculateTotal = () => {
        return calculateSubtotal() + deliveryFee.value - discount.value;
      };
      
      const applyPromoCode = () => {
        if (promoCode.value.toLowerCase() === 'farm10') {
          discount.value = calculateSubtotal() * 0.1;
          alert('Promo code applied! 10% discount');
        } else if (promoCode.value.toLowerCase() === 'freeship') {
          discount.value = deliveryFee.value;
          alert('Promo code applied! Free shipping');
        } else {
          alert('Invalid promo code');
          discount.value = 0;
        }
        promoCode.value = '';
      };
      
      return {
        cartItems,
        promoCode,
        discount,
        deliveryFee,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        calculateSubtotal,
        calculateTotal,
        applyPromoCode
      };
    }
  }
  </script>
  
  <style scoped>
  .cart-page {
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
  
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding: 0 20px;
  }
  
  .empty-cart-icon {
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .empty-cart h2 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
  }
  
  .empty-cart p {
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
  
  .cart-items {
    margin-bottom: 20px;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    position: relative;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
    background-color: #f9f9f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }
  
  .item-image img {
    width: 40px;
    height: 40px;
  }
  
  .item-details {
    flex: 1;
  }
  
  .item-details h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
    color: #333;
  }
  
  .item-shop {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
  }
  
  .item-weight {
    font-size: 12px;
    color: #999;
  }
  
  .item-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 10px;
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .quantity-btn {
    width: 24px;
    height: 24px;
    border-radius: 5px;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
  }
  
  .quantity {
    width: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
  }
  
  .item-price {
    font-size: 14px;
    font-weight: 700;
    color: #2e5c31;
  }
  
  .remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #e74c3c;
    background: none;
    border: none;
    padding: 5px;
  }
  
  .cart-summary {
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 14px;
    color: #666;
  }
  
  .summary-row.discount {
    color: #e74c3c;
  }
  
  .summary-row.total {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    border-top: 1px solid #eee;
    padding-top: 12px;
    margin-top: 5px;
  }
  
  .promo-code {
    display: flex;
    margin-bottom: 20px;
  }
  
  .promo-code input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 10px 0 0 10px;
    font-size: 14px;
  }
  
  .promo-code button {
    padding: 0 20px;
    background-color: #2e5c31;
    color: white;
    border-radius: 0 10px 10px 0;
    font-weight: 600;
  }
  
  .checkout-section {
    margin-top: 20px;
  }
  
  .checkout-btn {
    width: 100%;
    padding: 15px 0;
    background-color: #2e5c31;
    color: white;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 3px 8px rgba(46, 92, 49, 0.3);
  }
  </style>