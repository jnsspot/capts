@ -0,0 +1,732 @@
<template>
  <div class="product-details">
    <!-- Header Section -->
    <div class="header">
      <button class="back-button" @click="$emit('navigate', '/')">
        <ChevronLeft size="22" />
      </button>
      <h1>Product Details</h1>
      
      <div class="header-buttons">
        <button class="icon-button" @click="toggleCart">
          <ShoppingCart size="18" />
        </button>
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
      
      <!-- Product Rating Summary -->
      <div class="product-rating">
        <div class="rating-stars">
          <Star size="18" fill="#FFD700" />
          <Star size="18" fill="#FFD700" />
          <Star size="18" fill="#FFD700" />
          <Star size="18" fill="#FFD700" />
          <Star size="18" fill="#E0E0E0" />
          <span class="rating-value">4.0</span>
        </div>
        <span class="rating-count">(24 reviews)</span>
        <button class="see-reviews-btn">See all reviews</button>
      </div>
      
      <div class="guarantee">
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
      
      <!-- Farm Store Information -->
      <div class="farm-store-info">
        <div class="farm-details">
          <div class="farm-avatar">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D&w=100&q=80" alt="Farm logo">
          </div>
          <div class="farm-text">
            <h3>{{ farmName || 'Loading farm...' }}</h3>
            <div class="farm-location">
              <MapPin size="14" />
              <span>{{ farmAddress || 'Loading location...' }}</span>
            </div>
          </div>
        </div>
        <button class="visit-store-btn" @click="visitStore">
          <Store size="16" />
          Visit Store
        </button>
      </div>

      <div class="related-products">
        <h3>You might also like</h3>
        <div class="related-products-grid">
          <div class="related-product" v-for="(product, index) in relatedProducts" :key="index" @click="viewProduct(product)">
            <div class="related-product-image">
              <img :src="product.image" :alt="product.productName">
            </div>
            <div class="related-product-info">
              <h4>{{ product.productName }}</h4>
              <p class="related-price">₱{{ product.price }}</p>
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

    <ProductModal
      v-if="showAddToCartModalVisible"
      :visible="showAddToCartModalVisible"
      :productName="productName"
      :productImage="productImage"
      :category="product?.category"
      :initialPackagingType="'plastic'"
      :initialWeight="1"
      :pricePerKg="productPrice"
      :sellerId="product?.sellerId" 
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
      :category="product?.category"
      :initialPackagingType="'plastic'"
      :initialWeight="1"
      :pricePerKg="productPrice"
      :sellerId="product?.sellerId" 
      :userId="userId"
      :username="username"
      @confirm="handleBuyNowConfirm"
      @close="closeBuyNowModal"
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
  MapPin,
  Store
} from 'lucide-vue-next';
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
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
    MapPin,
    Store
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
      farmAddress: '',
      sellerId: '',
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
      return this.product?.image || '/placeholder.svg?height=200&width=200';
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
    async fetchProduct() {
      try {
        if (!this.productId) {
          console.error('No product ID provided');
          return;
        }

        const productDocRef = doc(db, 'products', this.productId);
        const productDoc = await getDoc(productDocRef);
        
        if (productDoc.exists()) {
          this.product = productDoc.data();
          console.log('Product data loaded:', this.product);
          
          if (this.product.sellerId) {
            await this.fetchFarmDetails();
          } else {
            console.warn('No sellerId found in product document');
            this.farmName = 'Farm not specified';
            this.farmAddress = 'Location not available';
          }
        } else {
          console.error('Product document does not exist');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        this.showNotificationMessage('Failed to load product details', 'error');
      }
    },

    async fetchFarmDetails() {
      try {
        console.log('Fetching farm details for seller:', this.product.sellerId);
        const sellerDocRef = doc(db, 'sellers', this.product.sellerId);
        const sellerDoc = await getDoc(sellerDocRef);
        
        if (sellerDoc.exists()) {
          const sellerData = sellerDoc.data();
          console.log('Seller data loaded:', sellerData);
          
          this.farmName = sellerData.farmName || 'Farm not specified';
          this.farmAddress = sellerData.farmAddress || 'Location not available';
          this.sellerId = this.product.sellerId;
        } else {
          console.error('Seller document does not exist');
          this.farmName = 'Farm not found';
          this.farmAddress = 'Location unknown';
        }
      } catch (error) {
        console.error('Error fetching farm details:', error);
        this.farmName = 'Error loading farm';
        this.farmAddress = 'Error loading location';
      }
    },

    visitStore() {
      if (this.sellerId) {
        this.$router.push({
          name: 'SellerStore',
          params: { sellerId: this.sellerId }
        });
      } else {
        console.error('No seller ID available for store visit');
        this.showNotificationMessage('Unable to visit store at this time', 'error');
      }
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

    async handleAddToCartConfirm(data) {
      try {
        if (!auth.currentUser) {
          this.showNotificationMessage('Please sign in to add items to cart', 'error');
          return;
        }

        const cartItem = {
          userId: auth.currentUser.uid,
          productId: this.productId,
          productName: this.productName,
          productImage: this.productImage,
          price: this.productPrice,
          weight: data.weight,
          packagingType: data.packagingType,
          farmName: this.farmName,
          sellerId: this.product.sellerId,
          quantity: 1,
          selected: false,
          createdAt: serverTimestamp()
        };

        // Add to cart collection
        await addDoc(collection(db, 'carts'), cartItem);
        
        this.closeAddToCartModal();
        this.showNotificationMessage('Item added to cart successfully', 'success');
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showNotificationMessage('Failed to add item to cart', 'error');
      }
    },
    
    handleBuyNowConfirm(data) {
      this.closeBuyNowModal();
      // For Buy Now, we pass a single item directly to checkout
      const buyNowItem = {
        productId: this.productId,
        productName: this.productName,
        productImage: this.productImage,
        weight: data.weight,
        packagingType: data.packagingType,
        price: this.productPrice,
        totalPrice: this.productPrice * data.weight,
        sellerId: this.product.sellerId,
        farmName: this.farmName,
        isBuyNow: true // Flag to indicate this is a buy now order
      };

      this.router.push({
        name: 'Checkout',
        query: {
          items: JSON.stringify([buyNowItem])
        }
      });
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
    try {
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
    } catch (error) {
      console.error('Error in mounted hook:', error);
    }
  }
};
</script>

<style scoped>
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

.farm-store-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.farm-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.farm-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.farm-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.farm-text h3 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.farm-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.visit-store-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #f0f8f0;
  color: #2e5c31;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.visit-store-btn:hover {
  background-color: #e0f0e0;
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
  margin-bottom: 15px;
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

.product-rating {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rating-value {
  margin-left: 5px;
  font-weight: 600;
  color: #333;
}

.rating-count {
  color: #666;
  font-size: 0.9rem;
}

.see-reviews-btn {
  margin-left: auto;
  color: #2e5c31;
  font-size: 0.9rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
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
  margin-bottom: 25px;
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
  height: 100px;
  object-fit: cover;
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

@media (max-width: 480px) {
  .quantity-section {
    flex-wrap: wrap;
  }
  
  .add-to-cart, .buy-now-button {
    flex: 0 0 100%;
    margin-top: 10px;
  }
}
</style>