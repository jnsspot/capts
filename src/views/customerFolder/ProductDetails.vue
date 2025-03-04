<template>
    <div class="product-details">
      <div class="header">
        <button class="back-button" @click="$emit('navigate', 'HomePage')">
          <ChevronLeft size="22" />
        </button>
        <h1>Product Details</h1>
        <div class="header-buttons">
          <button class="icon-button" @click="toggleCart">
            <ShoppingCart size="18" />
          </button>
          <button class="icon-button" @click="toggleProfileMenu" ref="profileRef">
            <User size="18" />
          </button>
          
          <!-- Profile Dropdown Menu -->
          <div class="profile-dropdown" v-if="showProfileMenu">
            <div class="profile-header">
              <div class="profile-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
              </div>
              <div class="profile-user-info">
                <h3>Antonio Yanto</h3>
                <p>antonio.yanto@example.com</p>
              </div>
            </div>
            
            <div class="profile-actions">
              <button class="become-supplier-btn">
                <Briefcase size="16" />
                Become a Farmer/Supplier
              </button>
            </div>
            
            <div class="profile-menu">
              <button class="menu-item">
                <UserCog size="16" />
                Edit Profile
              </button>
              <button class="menu-item">
                <Settings size="16" />
                Account Settings
              </button>
              <button class="menu-item">
                <MapPin size="16" />
                Shipping Address
              </button>
              <button class="menu-item">
                <FileText size="16" />
                Terms and Conditions
              </button>
              <button class="menu-item">
                <Shield size="16" />
                Privacy Policy
              </button>
              <button class="menu-item">
                <Star size="16" />
                Rate this App
              </button>
              <button class="menu-item">
                <Share2 size="16" />
                Share this App
              </button>
              <button class="menu-item logout">
                <LogOut size="16" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="product-image-container">
        <img :src="productImage" alt="Product" class="product-image">
      </div>
      
      <div class="product-info">
        <div class="product-header">
          <div>
            <h2>{{ productName }}</h2>
            <p class="weight">In 50 gm</p>
            <p class="total-weight">1000 gm</p>
          </div>
          <button class="favorite-button">
            <Heart size="20" />
          </button>
        </div>
        
        <div class="price-section">
          <h3 class="price">23.<span class="cents">46$</span></h3>
          <div class="delivery-badge">
            <span class="dot"></span>
            <span>Available on fast delivery</span>
          </div>
        </div>
        
        <div class="variants">
          <div class="variant-circle red active"></div>
          <div class="variant-circle orange"></div>
          <div class="variant-circle blue"></div>
        </div>
        
        <div class="rating">
          <Star size="16" fill="#FFD700" color="#FFD700" />
          <span>4.5 Rating</span>
        </div>
        
        <div class="guarantee">
          <p>100% satisfaction guarantee. If you experience any of the following issues, missing, poor item, late arrival, unprofessional servic... <a href="#" class="read-more">Read more</a></p>
        </div>
        
        <div class="quantity-section">
          <button class="quantity-button decrease">
            <Minus size="16" />
          </button>
          <span class="quantity">1</span>
          <button class="quantity-button increase">
            <Plus size="16" />
          </button>
          
          <button class="add-to-cart">
            <ShoppingCart size="16" />
            Add to cart
          </button>
        </div>
        
        <div class="related-products">
          <h3>You might also like</h3>
          <div class="related-products-grid">
            <div class="related-product" v-for="(product, index) in relatedProducts" :key="index" @click="viewProduct(product)">
              <div class="related-product-image">
                <img :src="product.image" :alt="product.name">
              </div>
              <div class="related-product-info">
                <h4>{{ product.name }}</h4>
                <p class="related-price">${{ product.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <bottom-navigation active-tab="home" @navigate="$emit('navigate', $event)" @tab-change="handleTabChange" />
    </div>
  </template>
  
  <script>
  import BottomNavigation from '@/components/BottomNavigation.vue';
  import { 
    ChevronLeft, 
    ShoppingCart, 
    Heart, 
    Star, 
    Minus, 
    Plus, 
    User,
    UserCog, 
    Settings, 
    FileText, 
    Shield, 
    Share2, 
    LogOut,
    Briefcase,
    MapPin
  } from 'lucide-vue-next';
  import { onMounted, onUnmounted, ref } from 'vue';
  
  export default {
    components: {
      BottomNavigation,
      ChevronLeft,
      ShoppingCart,
      Heart,
      Star,
      Minus,
      Plus,
      User,
      UserCog,
      Settings,
      FileText,
      Shield,
      Share2,
      LogOut,
      Briefcase,
      MapPin
    },
    props: {
      product: {
        type: Object,
        default: null
      }
    },
    setup() {
      const showProfileMenu = ref(false);
      const profileRef = ref(null);
  
      const toggleProfileMenu = () => {
        showProfileMenu.value = !showProfileMenu.value;
      };
  
      const handleClickOutside = (event) => {
        if (profileRef.value && !profileRef.value.contains(event.target)) {
          showProfileMenu.value = false;
        }
      };
  
      onMounted(() => {
        document.addEventListener('click', handleClickOutside);
      });
  
      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
      });
  
      return {
        showProfileMenu,
        profileRef,
        toggleProfileMenu
      };
    },
    data() {
      return {
        relatedProducts: [
          {
            id: 101,
            name: 'Premium Steak',
            price: '19.99',
            image: 'https://cdn-icons-png.flaticon.com/512/5769/5769382.png'
          },
          {
            id: 102,
            name: 'Lamb Chops',
            price: '15.49',
            image: 'https://cdn-icons-png.flaticon.com/512/8059/8059123.png'
          },
          {
            id: 103,
            name: 'Chicken Breast',
            price: '8.99',
            image: 'https://cdn-icons-png.flaticon.com/512/1046/1046769.png'
          },
          {
            id: 104,
            name: 'Ground Beef',
            price: '7.49',
            image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png'
          }
        ]
      }
    },
    computed: {
      productName() {
        return this.product ? this.product.name : 'Beef Mixed Cut Bone';
      },
      productImage() {
        return this.product ? this.product.image : 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png';
      }
    },
    methods: {
      handleTabChange(tab) {
        console.log(`Changed to tab: ${tab}`);
        // Handle tab change logic here
      },
      toggleCart() {
        console.log('Cart toggled');
        // Implement cart toggle functionality
      },
      viewProduct(product) {
        console.log(`Viewing product: ${product.name}`);
        // Navigate to the product details with the selected product
        this.$emit('navigate', 'ProductDetails', product);
      }
    }
  }
  </script>
  
  <style scoped>
  .product-details {
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
    position: relative;
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
    transition: all 0.2s ease;
  }
  
  .icon-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  /* Profile Dropdown Menu */
  .profile-dropdown {
    position: absolute;
    top: 45px;
    right: 0;
    width: 280px;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    z-index: 100;
    overflow: hidden;
  }
  
  .profile-header {
    padding: 20px;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .profile-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #2e5c31;
  }
  
  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-user-info h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 5px 0;
    color: #333;
  }
  
  .profile-user-info p {
    font-size: 12px;
    color: #666;
    margin: 0;
  }
  
  .profile-actions {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .become-supplier-btn {
    width: 100%;
    padding: 10px;
    background-color: #2e5c31;
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }
  
  .become-supplier-btn:hover {
    background-color: #26492a;
  }
  
  .profile-menu {
    padding: 10px;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 15px;
    background: none;
    border: none;
    text-align: left;
    font-size: 14px;
    color: #333;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .menu-item:hover {
    background-color: #f5f5f5;
  }
  
  .menu-item.logout {
    color: #e74c3c;
  }
  
  .menu-item.logout:hover {
    background-color: #fee2e2;
  }
  
  .product-image-container {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    position: relative;
    overflow: hidden;
  }
  
  .product-image-container::after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background-color: #f5f5f5;
    border-radius: 50% 50% 0 0;
    z-index: 1;
  }
  
  .product-image {
    max-width: 80%;
    max-height: 80%;
    z-index: 2;
  }
  
  .product-info {
    flex: 1;
    padding: 20px 15px;
    background-color: #f5f5f5;
    overflow-y: auto;
  }
  
  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  
  .product-header h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #2e5c31;
  }
  
  .weight {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .total-weight {
    font-size: 14px;
    color: #999;
  }
  
  .favorite-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e74c3c;
    border: 1px solid #e0e0e0;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .price {
    font-size: 24px;
    font-weight: 600;
    color: #2e5c31;
  }
  
  .cents {
    font-size: 16px;
    font-weight: normal;
  }
  
  .delivery-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: #f0e6ff;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    color: #7b61ff;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: #7b61ff;
    border-radius: 50%;
  }
  
  .variants {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .variant-circle {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 2px solid white;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .variant-circle.red {
    background-color: #e74c3c;
  }
  
  .variant-circle.orange {
    background-color: #e67e22;
  }
  
  .variant-circle.blue {
    background-color: #3498db;
  }
  
  .variant-circle.active {
    border-color: #2e5c31;
    transform: scale(1.1);
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 20px;
    color: #2e5c31;
  }
  
  .guarantee {
    background-color: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .guarantee p {
    font-size: 14px;
    line-height: 1.5;
    color: #666;
  }
  
  .read-more {
    color: #2e5c31;
    text-decoration: none;
    font-weight: 500;
  }
  
  .quantity-section {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
  }
  
  .quantity-button {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 1px solid #e0e0e0;
    color: #2e5c31;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
  }
  
  .quantity-button:hover {
    background-color: #f0f0f0;
  }
  
  .quantity {
    font-size: 18px;
    font-weight: 600;
    width: 30px;
    text-align: center;
  }
  
  .add-to-cart {
    flex: 1;
    height: 45px;
    background-color: #2e5c31;
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: 600;
    box-shadow: 0 3px 8px rgba(46, 92, 49, 0.3);
    transition: all 0.2s ease;
  }
  
  .add-to-cart:hover {
    background-color: #26492a;
  }
  
  .related-products {
    margin-top: 20px;
  }
  
  .related-products h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }
  
  .related-products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .related-product {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    padding: 10px;
    transition: transform 0.2s ease;
    cursor: pointer;
  }
  
  .related-product:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  
  .related-product-image {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  
  .related-product-image img {
    width: 40px;
    height: 40px;
  }
  
  .related-product-info h4 {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #333;
  }
  
  .related-price {
    font-size: 12px;
    font-weight: 700;
    color: #2e5c31;
  }
  </style>