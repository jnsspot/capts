<template>
  <div class="home-page">
    <div class="header">
      <div class="search-container">
        <div class="search-bar">
          <Search size="18" />
          <input type="text" placeholder='Search for "Farm Products"'>
        </div>
        <div class="header-buttons">
          <button class="icon-button" @click="navigateToPath('/cart')">
            <ShoppingCart size="18" />
            <span v-if="cartItems.length > 0" class="cart-badge">{{ cartItems.length }}</span>
          </button>
          <button class="icon-button profile-icon" @click="toggleProfileMenu" ref="profileRef">
            <User size="18" />
          </button>
          
          <!-- Profile Dropdown Menu -->
          <div class="profile-dropdown" v-if="showProfileMenu">
            <div class="profile-header">
              <div class="profile-avatar">
                <img v-if="userPhotoURL" :src="userPhotoURL" alt="User avatar" />
                <User v-else size="40" class="default-avatar-icon" />
              </div>
              <div class="profile-user-info">
                <h3>{{ username }}</h3> 
                <p>{{ userEmail }}</p>
              </div>
            </div>
            
            <div class="profile-actions">
              <button class="become-supplier-btn" @click="navigateToPath('/register-seller')">
                <Briefcase size="16" />
                Become a Farmer/Supplier
              </button>
            </div>
            
            <div class="profile-menu">
              <button class="menu-item" @click="navigateToPath('/edit-profile')">
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
              <button class="menu-item logout" @click="confirmLogout">
                <LogOut size="16" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="location">
        <p>Current Location</p>
        <h3>{{ userLocation }} <MapPin size="14" /></h3>
      </div>
      
      <div class="categories">
        <div 
          class="category" 
          v-for="category in categories" 
          :key="category.name"
          @click="filterByCategory(category.name)"
          :class="{ 'active': selectedCategory === category.name }"
        >
          <div class="category-icon">
            <img :src="category.image" :alt="category.name">
          </div>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="section-header">
        <h2>{{ selectedCategory || 'Fresh Harvest' }}</h2>
        <a href="#" class="see-more" @click.prevent="clearCategoryFilter">
          {{ selectedCategory ? 'Show All' : 'See more' }}
        </a>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <div v-if="isLoading">Loading products...</div>
        <div v-else-if="filteredProducts.length === 0" class="no-products">
          No products found in this category.
        </div>
        <div v-else class="products-container">
          <div class="product-card" v-for="(product, index) in filteredProducts" :key="index" @click="viewProduct(product)">
            <div class="product-image">
              <img :src="product.image" :alt="product.productName || product.name">
            </div>
            <div class="product-info">
              <h3>{{ product.productName || product.name }}</h3>
              <p class="price">₱{{ product.price }}</p>
            </div>
            <div class="product-actions">
              <button class="add-button" @click.stop="addToCart(product)" :disabled="product.stock <= 0">
                <Plus size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      
    <div class="delivery-options">
      <div class="delivery-card grocery">
        <h3>Farm Fresh</h3>
        <p>By 12:15pm</p>
        <p class="free">Free delivery</p>
        <img src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png" alt="Farm Fresh" class="delivery-image">
      </div>
      <div class="delivery-card wholesale">
        <h3>Wholesale</h3>
        <p>By 1:30pm</p>
        <p class="free">Free Delivery</p>
        <img src="https://cdn-icons-png.flaticon.com/512/1532/1532688.png" alt="Wholesale" class="delivery-image">
      </div>
    </div>
      
    <div class="section-header">
      <h2>Featured Products</h2>
      <a href="#" class="see-all">See all</a>
    </div>
    <div v-if="isLoading">Loading products...</div>
    <div v-else>
      <div class="featured-products">
        <div class="featured-product-card" v-for="(product, index) in featuredProducts" :key="index" @click="viewProduct(product)">
          <div class="featured-product-image">
            <img :src="product.image" :alt="product.name">
            <div class="discount-badge" v-if="product.discount">-{{ product.discount }}%</div>
          </div>
          <div class="featured-product-info">
            <h3>{{ product.name }}</h3>
            <p class="shop-info">{{ product.shop }}</p>
            <div class="featured-product-price">
              <p class="current-price">₱{{ product.currentPrice }}/{{ product.unit }}</p>
              <p class="original-price" v-if="product.originalPrice">₱{{ product.originalPrice }}</p>
            </div>
            <div class="rating">
              <Star size="12" fill="#FFD700" color="#FFD700" />
              <span>{{ product.rating }}</span>
              <span class="sold">({{ product.sold }} sold)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <bottom-navigation active-tab="/" @navigate="handleBottomNavigation" />
  </div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation.vue';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  Plus, 
  User, 
  Star, 
  UserCog, 
  Settings, 
  FileText, 
  Shield, 
  Share2, 
  LogOut,
  Briefcase
} from 'lucide-vue-next';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default {
  components: {
    BottomNavigation,
    Search,
    ShoppingCart,
    MapPin,
    Plus,
    User,
    Star,
    UserCog,
    Settings,
    FileText,
    Shield,
    Share2,
    LogOut,
    Briefcase
  },
  setup() {
    const router = useRouter();
    const showProfileMenu = ref(false);
    const profileRef = ref(null);
    const cartItems = ref([]);
    const isLoading = ref(true);
    const products = ref([]);
    const selectedCategory = ref('');

    const categories = [
      {
        name: 'Vegetables',
        image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Fruits',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Grains',
        image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Dairy',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ];

    const filteredProducts = computed(() => {
      if (!selectedCategory.value) {
        return products.value;
      }
      return products.value.filter(product => 
        product.category && product.category.toLowerCase() === selectedCategory.value.toLowerCase()
      );
    });

    const filterByCategory = (category) => {
      if (selectedCategory.value === category) {
        selectedCategory.value = ''; // Toggle off if already selected
      } else {
        selectedCategory.value = category;
      }
    };

    const clearCategoryFilter = () => {
      selectedCategory.value = '';
    };

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
      router,
      showProfileMenu,
      profileRef,
      toggleProfileMenu,
      cartItems,
      isLoading,
      products,
      categories,
      selectedCategory,
      filteredProducts,
      filterByCategory,
      clearCategoryFilter
    };
  },
  data() {
    return {
      userPhotoURL: '',
      username: '',
      userEmail: '',
      userLocation: 'Manila, Philippines', // Default location
      featuredProducts: []
    };
  },
  methods: {
    async fetchUserInfo() {
      const user = auth.currentUser;
      if (user) {
        this.userEmail = user.email;

        // Fetch user details from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            this.username = userData.username || `${userData.firstName} ${userData.lastName}`.trim();
            
            // Get profile image URL from Firestore
            this.userPhotoURL = userData.profileImageUrl || '';
            
            // Set the location if address exists in the document
            if (userData.address) {
              this.userLocation = userData.address;
            }
          } else {
            console.log('No user document found');
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    },
    async fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        this.products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          image: doc.data().image,
          productName: doc.data().productName,
          name: doc.data().name,
          price: doc.data().price,
          stock: doc.data().stock,
          category: doc.data().category // Make sure to get the category field
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async confirmLogout() {
      try {
        localStorage.clear();
        sessionStorage.clear();
        await signOut(auth);
        this.$router.push('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },
    viewProduct(product) {
      const productId = product.id || product.productId;
      if (!productId) {
        console.error('Product ID is undefined. Cannot navigate to product details.');
        return;
      }
      this.$router.push({ path: `/product/${productId}` });
    },
    handleTabChange(tab) {
      console.log(`Changed to tab: ${tab}`);
    },
    addToCart(product) {
      console.log(`Added ${product.name} to cart`);
      this.cartItems.push({...product, quantity: 1});
    },
    navigateToPath(path, query = null) {
      this.showProfileMenu = false;
      if (query) {
        this.router.push({ path, query });
      } else {
        this.router.push(path);
      }
    },
    handleBottomNavigation(path) {
      this.router.push(path);
    }
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchUserInfo();
        this.fetchProducts();
      } else {
        this.userPhotoURL = '';
        this.username = '';
        this.userEmail = '';
        this.userLocation = 'Oriental Mindoro'; // Reset to default
      }
    });
  }
};
</script>

<style scoped>
.home-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

/* Update the header styling */
.header {
  background: linear-gradient(135deg, #2e5c31, #1e3e21);
  padding: 20px 15px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.search-bar {
  flex: 1;
  background-color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 40px;
}

.search-bar svg {
  color: #9e9e9e;
  margin-right: 10px;
}

.search-bar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
}

.header-buttons {
  display: flex;
  gap: 8px;
  position: relative;
}

.icon-button {
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
}

.icon-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.profile-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.location {
  color: white;
  margin-bottom: 20px;
}

.location p {
  font-size: 12px;
  opacity: 0.8;
}

.location h3 {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Update the categories styling */
.categories {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.category {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.category-icon {
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.category:hover .category-icon {
  transform: scale(1.1);
}

.category.active .category-icon {
  border-color: #ffcc00;
  box-shadow: 0 4px 15px rgba(255, 204, 0, 0.4);
}

.category-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category span {
  color: white;
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: color 0.2s ease;
}

.category.active span {
  color: #ffcc00;
  font-weight: 700;
}

.content {
  flex: 1;
  padding: 20px 15px;
  overflow-y: auto;
}

/* Update the section headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 15px 0;
  padding: 0 15px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  position: relative;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #2e5c31;
  border-radius: 3px;
}

.see-more, .see-all {
  color: #e86424;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.see-more:hover, .see-all:hover {
  color: #c04e15;
}

.no-products {
  text-align: center;
  padding: 30px 0;
  color: #666;
  font-size: 16px;
}

/* Update the products grid and container styling */
.products-grid {
  display: block;
  padding: 10px 0;
  margin: 0 -8px;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 products per row on mobile */
  gap: 12px;
  padding: 0 8px;
}

/* Media query for larger screens */
@media (min-width: 768px) {
  .products-container {
    grid-template-columns: repeat(4, 1fr); /* 4 products per row on medium screens */
  }
}

@media (min-width: 1024px) {
  .products-container {
    grid-template-columns: repeat(6, 1fr); /* 6 products per row on large screens */
  }
}

/* Update the product card styling for consistent sizing */
.product-card {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  border: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%; /* Ensure all cards have the same width */
}

.product-image {
  height: 140px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  overflow: hidden;
}

/* Also update the featured products to match the same responsive behavior */
.featured-products {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 products per row on mobile */
  gap: 16px;
  padding: 5px 8px 15px 8px;
}

@media (min-width: 768px) {
  .featured-products {
    grid-template-columns: repeat(4, 1fr); /* 4 products per row on medium screens */
  }
}

@media (min-width: 1024px) {
  .featured-products {
    grid-template-columns: repeat(6, 1fr); /* 6 products per row on large screens */
  }
}

.featured-product-card {
  min-width: unset; /* Remove the min-width */
  width: 100%;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: none;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.add-button {
  width: 36px;
  height: 36px;
  background-color: #2e9d3a; /* Bright green */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(46, 157, 58, 0.4); /* Enhanced shadow */
  transition: all 0.2s ease;
  border: none;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.add-button:hover:not(:disabled) {
  background-color: #25802f;
  transform: scale(1.1);
  box-shadow: 0 5px 12px rgba(46, 157, 58, 0.5);
}

.add-button:disabled {
  background-color: #cccccc;
  box-shadow: none;
  cursor: not-allowed;
}

.weight {
  font-size: 11px;
  color: #999;
}

.product-price sup {
  font-size: 10px;
  color: #666;
}

.delivery-options {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

/* Update the delivery options styling */
.delivery-options {
  display: flex;
  gap: 15px;
  margin: 25px 0;
  padding: 0 15px;
}

.delivery-card {
  flex: 1;
  padding: 18px;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  height: 130px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.delivery-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.delivery-card.grocery {
  background: linear-gradient(135deg, #f8e9d6, #f0d9b8);
}

.delivery-card.wholesale {
  background: linear-gradient(135deg, #ffd6d6, #ffbdbd);
}

.delivery-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 700;
}

.delivery-card p {
  font-size: 12px;
  margin-bottom: 5px;
  color: #555;
}

.delivery-card .free {
  font-size: 11px;
  opacity: 0.7;
}

.delivery-image {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 60px;
  height: 60px;
  opacity: 0.8;
}

.featured-products {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 products per row on mobile */
  gap: 16px;
  padding: 5px 8px 15px 8px;
  scrollbar-width: none; /* Firefox */
}

.featured-products::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

/* Update the featured products styling */
.featured-product-card {
  min-width: unset; /* Remove the min-width */
  width: 100%;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: none;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.featured-product-image {
  height: 150px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.featured-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-product-card:hover .featured-product-image img {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.featured-product-info {
  padding: 15px;
  background: linear-gradient(to bottom, #ffffff, #f8f8f8);
}

.featured-product-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shop-info {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.featured-product-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
}

.current-price {
  font-size: 16px;
  font-weight: 700;
  color: #2e5c31;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.sold {
  color: #999;
}

.default-avatar-icon {
  color: #2e5c31;
}
</style>

