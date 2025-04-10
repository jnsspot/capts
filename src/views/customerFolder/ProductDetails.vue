<template>
  <div class="product-details">
    <!-- Header Section -->
    <div class="header">
      <button class="back-button" @click="$emit('navigate', '/')">
        <ChevronLeft size="22" />
      </button>
      <h1>Product Details</h1>
      
      <div class="header-buttons">
        <p class="farm-name" v-if="farmName">{{ farmName }}</p>
        <button class="icon-button" @click="toggleCart">
          <ShoppingCart size="18" />
        </button>
        <button class="icon-button" @click="toggleProfileMenu" ref="profileRef">
          <User size="18" />
        </button>

        <div class="profile-dropdown" v-if="showProfileMenu">
          <!-- Profile Dropdown Content -->
        </div>
      </div>
    </div>
    
    <!-- Product Image -->
    <div class="product-image-container">
      <img v-if="productImage" :src="productImage" alt="Product" class="product-image">
      <div v-else class="placeholder-image">No Image Available</div>
    </div>
  
    <!-- Product Information -->
    <div class="product-info">
      <div class="product-header">
        <div>
          <h2>{{ productName }}</h2>
        </div>
        <button class="favorite-button">
          <Heart size="20" />
        </button>
      </div>
      
      <div class="price-section">
        <h3 class="price">₱{{ computedPrice }}</h3>
        <p class="stock">Quantity: {{ computedStock }}</p>
      </div>
      
      <div class="guarantee">
        <span><MapPin size="16" /> {{ farmName }}</span>
        <p>{{ productDescription }}</p>
      </div>
      
      <div class="quantity-section">
        <button class="quantity-button decrease" @click="decreaseQuantity">
          <Minus size="16" />
        </button>
        <span class="quantity">{{ quantity }}</span>
        <button class="quantity-button increase" @click="increaseQuantity">
          <Plus size="16" />
        </button>
        
        <button class="add-to-cart" @click="showAddToCartModal">
          <ShoppingCart size="16" />
          Add to cart
        </button>

        <button class="buy-now-button" @click="showBuyNowModal">
          Buy Now
        </button>
      </div>

      <ProductModal
        v-if="showAddToCartModalVisible"
        :visible="showAddToCartModalVisible"
        :productName="productName"
        :productImage="productImage"
        :category="product.category"
        :initialPackagingType="'plastic'"
        :initialWeight="1"
        :pricePerKg="productPrice"
        :sellerId="product.sellerId" 
        :userId="userId"
        :username="username"
        @confirm="handleAddToCartConfirm"
        @close="closeAddToCartModal"
      />

      <ProductModal
        v-if="showBuyNowModalVisible"
        :visible="showBuyNowModalVisible"
        :productName="productName"
        :productImage="productImage"
        :category="product.category"
        :initialPackagingType="'plastic'"
        :initialWeight="1"
        :pricePerKg="productPrice"
        :sellerId="product.sellerId" 
        :userId="userId"
        :username="username"
        @confirm="handleBuyNowConfirm"
        @close="closeBuyNowModal"
      />

      <div class="related-products">
        <h3>You might also like</h3>
        <div class="related-products-grid">
          <div class="related-product" v-for="(product, index) in relatedProducts" :key="index" @click="viewProduct(product)">
            <div class="related-product-image">
              <img :src="product.image" :alt="product.productName">
            </div>
            <div class="related-product-info">
              <h4>{{ product.productName }}</h4>
              <p class="related-price">${{ product.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <bottom-navigation active-tab="home" @navigate="$emit('navigate', $event)" @tab-change="handleTabChange" />

    <Notification 
      :message="notificationMessage"
      :type="notificationType"
      :visible="showNotification"
    />
  </div>
</template>

<script>
import Notification from '@/components/Notification.vue'; 
import BottomNavigation from '@/components/BottomNavigation.vue';
import ProductModal from '@/components/ProductModal.vue';
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
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { useRouter } from 'vue-router';

export default {
  components: {
    Notification,
    ProductModal,
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
  setup() {
    const router = useRouter();
    return { router };
  },
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      farmName: '',
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success',
      notificationTimeout: null,
      product: null,
      userId: '',
      relatedProducts: [],
      username: '',
      userEmail: '',
      userPhotoURL: '',
      showProfileMenu: false,
      quantity: 1,
      showAddToCartModalVisible: false,
      showBuyNowModalVisible: false
    };
  },
  computed: {
    productName() {
      return this.product ? this.product.productName : 'Loading...';
    },
    productImage() {
      return this.product?.image || '';
    },
    productPrice() {
      return this.product ? this.product.price : 0;
    },
    productStock() {
      return this.product ? this.product.stock : 0;
    },
    productDescription() {
      return this.product ? this.product.description : 'Loading...';
    },
    computedPrice() {
      return this.productPrice * this.quantity;
    },
    computedStock() {
      return this.productStock - this.quantity;
    }
  },
  methods: {
    handleAddToCartConfirm(data) {
      this.closeAddToCartModal();
      this.showNotificationMessage('Item added to cart', 'success');
    },
    handleBuyNowConfirm(data) {
      this.closeBuyNowModal();
      this.router.push({
        name: 'Checkout',
        query: {
          productId: this.productId,
          productName: this.productName,
          productImage: this.productImage,
          weight: data.weight,
          packagingType: data.packagingType,
          totalPrice: data.totalPrice,
          sellerId: data.sellerId,
          pricePerKg: this.productPrice
        }
      });
    },
    
    showNotificationMessage(message, type) {
      this.notificationMessage = message;
      this.notificationType = type;
      this.showNotification = true;
      
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
      
      this.notificationTimeout = setTimeout(() => {
        this.showNotification = false;
      }, 5000);
    },

    async fetchFarmName() {
      if (this.product && this.product.sellerId) {
        try {
          const sellerDocRef = doc(db, 'sellers', this.product.sellerId);
          const sellerDoc = await getDoc(sellerDocRef);
          if (sellerDoc.exists()) {
            this.farmName = sellerDoc.data().farmName;
          }
        } catch (error) {
          console.error('Failed to fetch farm name:', error);
        }
      }
    },

    async fetchProduct() {
      if (!this.productId) return;

      try {
        const productDocRef = doc(db, 'products', this.productId);
        const productDoc = await getDoc(productDocRef);
        if (productDoc.exists()) {
          this.product = productDoc.data();
          await this.fetchFarmName();
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    },

    showAddToCartModal() {
      this.showAddToCartModalVisible = true;
    },
    showBuyNowModal() {
      this.showBuyNowModalVisible = true;
    },
    closeAddToCartModal() {
      this.showAddToCartModalVisible = false;
    },
    closeBuyNowModal() {
      this.showBuyNowModalVisible = false;
    },
    async fetchUserInfo() {
      const user = auth.currentUser;
      if (user) {
        this.userPhotoURL = user.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg';
        this.userEmail = user.email;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          this.username = userDoc.data().username;
        }
      }
    },
    async fetchRelatedProducts() {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        this.relatedProducts = productsSnapshot.docs
          .filter(doc => doc.id !== this.productId)
          .map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      }
    },
    viewProduct(product) {
      const productId = product.id || product.productId;
      if (productId) {
        this.$router.push({ path: `/product/${productId}` });
      }
    },  
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    toggleCart() {
      console.log('Cart toggled');
    },
    handleTabChange(tab) {
      console.log(`Changed to tab: ${tab}`);
    },
    increaseQuantity() {
      if (this.quantity < this.productStock) {
        this.quantity++;
      } else {
        alert('Cannot exceed available stock.');
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
  },
  async mounted() {
    if (!this.productId) return;

    const user = auth.currentUser;
    if (user) {
      this.userId = user.uid;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        this.username = userDoc.data().username;
      }
    }

    await this.fetchUserInfo();
    await this.fetchProduct();
    await this.fetchRelatedProducts();
  }
};
</script>

  <style scoped>
 .farm-name {
  font-size: 14px;
  color: white;
  margin-right: 10px;
}

.product-image-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align farm name to left */
  padding: 15px;
}

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
    background-color: #ffffff;
    color: rgb(2, 2, 2);
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
    background-color: #2e5c31;
  }
  .buy-now-button {
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
  
  .buy-now-button:hover {
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

  .product-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding-bottom: 80px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #2e5c31;
  color: white;
}

.header h1 {
  font-size: 1.1rem;
  font-weight: 600;
}

.product-image-container {
  height: 250px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-image {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.product-info {
  padding: 20px 15px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.product-header h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.price-section {
  margin-bottom: 20px;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e5c31;
}

.stock {
  color: #666;
  font-size: 0.9rem;
}

.guarantee {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.guarantee p {
  color: #555;
  line-height: 1.5;
  font-size: 0.95rem;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.quantity-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #2e5c31;
}

.quantity {
  font-size: 1.1rem;
  width: 30px;
  text-align: center;
}

.add-to-cart, .buy-now-button {
  flex: 1;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  gap: 8px;
}

.add-to-cart {
  background-color: white;
  color: #2e5c31;
  border: 1px solid #2e5c31;
}

.buy-now-button {
  background-color: #2e5c31;
  color: white;
}

.related-products {
  margin-top: 25px;
}

.related-products h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.related-product {
  background-color: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.related-product-image img {
  width: 100%;
  border-radius: 6px;
}

.related-product-info h4 {
  font-size: 0.9rem;
  margin: 8px 0 4px;
}

.related-price {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2e5c31;
}
  </style>