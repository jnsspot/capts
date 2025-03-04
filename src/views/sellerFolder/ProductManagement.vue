<template>
    <div class="dashboard-container">
      <Sidebar initialActiveItem="Farm Products" />
      
      <div class="main-content">
        <header class="header">
          <div class="page-title">
            <h1>Farm Products</h1>
            <p>Manage your farm products inventory, pricing, and details</p>
          </div>
          
          <div class="user-profile" @click="toggleProfileMenu" ref="profileRef">
            <div class="notification-icon">
              <Bell size="20" />
            </div>
            <div class="avatar">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
            </div>
            <div class="user-info">
              <h3>Antonio Yanto</h3>
              <p>Farm Owner</p>
            </div>
            
            <!-- Profile Dropdown Menu -->
            <div class="profile-dropdown" v-if="showProfileMenu">
              <div class="profile-header">
                <div class="profile-avatar">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
                </div>
                <div>
                  <h3>Antonio Yanto</h3>
                  <p>Farm Owner</p>
                </div>
                <button class="logout-btn">
                  <LogOut size="18" />
                </button>
              </div>
              
              <div class="profile-tabs">
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'profile' }" 
                  @click="setActiveTab('profile')"
                >
                  <User size="18" />
                  Profile
                </button>
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'setting' }" 
                  @click="setActiveTab('setting')"
                >
                  <Settings size="18" />
                  Setting
                </button>
              </div>
              
              <div class="tab-content" v-if="activeTab === 'profile'">
                <button class="menu-item">
                  <Edit size="18" />
                  Edit Profile
                </button>
                <button class="menu-item">
                  <UserCheck size="18" />
                  View Profile
                </button>
                <button class="menu-item">
                  <Share2 size="18" />
                  Social Profile
                </button>
                <button class="menu-item">
                  <CreditCard size="18" />
                  Billing
                </button>
                <button class="menu-item">
                  <LogOut size="18" />
                  Logout
                </button>
              </div>
              
              <div class="tab-content" v-if="activeTab === 'setting'">
                <button class="menu-item">
                  <HelpCircle size="18" />
                  Support
                </button>
                <button class="menu-item">
                  <UserCog size="18" />
                  Account Settings
                </button>
                <button class="menu-item">
                  <Shield size="18" />
                  Privacy Center
                </button>
                <button class="menu-item">
                  <MessageSquare size="18" />
                  Feedback
                </button>
                <button class="menu-item">
                  <Clock size="18" />
                  History
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div class="product-actions">
          <div class="search-container">
            <div class="search-box">
              <Search size="18" class="search-icon" />
              <input type="text" placeholder="Search products..." v-model="searchQuery" />
            </div>
          </div>
          
          <div class="action-buttons">
            <div class="filter-dropdown">
              <button class="filter-btn" @click="toggleFilterDropdown">
                <Filter size="18" />
                {{ activeFilter }}
                <ChevronDown size="18" />
              </button>
              <div v-show="showFilterDropdown" class="filter-options">
                <button v-for="filter in filterOptions" :key="filter" @click="setFilter(filter)">
                  {{ filter }}
                </button>
              </div>
            </div>
            <router-link to="/addproduct" class="add-product-btn">
              <Plus size="18" />
              Add Product
            </router-link>
          </div>
        </div>
        
        <div class="product-categories">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-btn', { active: activeCategory === category.id }]"
            @click="setActiveCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
        
        <div class="products-grid">
  <div v-if="isLoading">Loading...</div>
  <div v-else>
    <div class="product-card" v-for="product in filteredProducts" :key="product.id">
      <div class="product-image">
        <img :src="product.image || '/placeholder.svg?height=180&width=180'" alt="Product image" />
        <div class="product-badge" v-if="product.ribbon">{{ product.ribbon }}</div>
        <div class="product-status" :class="product.status?.toLowerCase() || ''">{{ product.status || 'No Status' }}</div>
      </div>
      <div class="product-details">
        <div class="product-category">{{ product.category || 'No Category' }}</div>
        <h3 class="product-name">{{ product.productName || 'No Name' }}</h3>
        <div class="product-stats">
          <div class="stat">
            <ShoppingCart size="14" />
            {{ product.sales || 0 }}
          </div>
          <div class="stat">
            <Star size="14" />
            {{ product.rating || 0 }}
          </div>
          <div class="stat">
            <Eye size="14" />
            {{ product.views || 0 }}
          </div>
        </div>
        <div class="product-price">
          <div class="current-price">${{ (Number(product.price) || 0).toFixed(2) }}/{{ product.unit }}</div>
          <div class="profit">Profit: ${{ (Number(product.profit) || 0).toFixed(2) }}</div>
        </div>
        <div class="product-stock">
          <div class="stock-label">Stock:</div>
          <div class="stock-bar">
            <div 
              class="stock-progress" 
              :style="{ width: `${(product.stock / product.maxStock) * 100}%` }"
              :class="getStockClass(product.stock, product.maxStock)"
            ></div>
          </div>
          <div class="stock-value">{{ product.stock }} {{ product.unit }}</div>
        </div>
        <div class="product-actions">
          <router-link :to="`/edit-product/${product.id}`" class="edit-btn">
            <Edit size="16" />
            Edit
          </router-link>
          <button class="delete-btn" @click="deleteProduct(product.id)">
            <Trash size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { 
    Search, 
    Bell, 
    Filter, 
    Plus, 
    ShoppingCart, 
    Star, 
    Eye, 
    Edit, 
    Trash,
    ChevronDown,
    LogOut,
    User,
    Settings,
    UserCheck,
    Share2,
    CreditCard,
    HelpCircle,
    UserCog,
    Shield,
    MessageSquare,
    Clock
} from 'lucide-vue-next';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const auth = getAuth();

// Profile dropdown state
const showProfileMenu = ref(false);
const activeTab = ref('profile');
const profileRef = ref(null);

const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

// Close dropdown when clicking outside
const handleClickOutsideProfile = (event) => {
    if (profileRef.value && !profileRef.value.contains(event.target)) {
        showProfileMenu.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutsideProfile);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutsideProfile);
});

// Product management
const searchQuery = ref('');
const activeCategory = ref('all');
const showFilterDropdown = ref(false);
const activeFilter = ref('All');
const isLoading = ref(true); // Add a loading state

const filterOptions = ['All', 'Active', 'Inactive', 'Scheduled'];

// Categories
const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'grains', name: 'Grains' },
    { id: 'herbs', name: 'Herbs & Spices' }
];

// Products data
const products = ref([]);

// Fetch products from Firestore based on userId
const fetchProducts = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in to view products.');
    router.push('/login');
    return;
  }

  try {
    const q = query(collection(db, 'products'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    products.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        productName: data.productName || 'No Name',
        category: data.category || 'No Category',
        status: data.status || 'No Status',
        price: Number(data.price) || 0, // Ensure price is a number
        profit: Number(data.profit) || 0, // Ensure profit is a number
        ...data, // Spread the rest of the data
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to fetch products.');
  } finally {
    isLoading.value = false; // Set loading to false after fetching
  }
};

// Filtered products based on search, category, and status
const filteredProducts = computed(() => {
    return products.value.filter(product => {
        const productName = product.productName?.toLowerCase() || ''; // Use optional chaining and fallback
        const category = product.category?.toLowerCase() || ''; // Use optional chaining and fallback
        const status = product.status?.toLowerCase() || ''; // Use optional chaining and fallback

        const matchesSearch = productName.includes(searchQuery.value.toLowerCase());
        const matchesCategory = activeCategory.value === 'all' || category === activeCategory.value;
        const matchesFilter = activeFilter.value === 'All' || status === activeFilter.value.toLowerCase();

        return matchesSearch && matchesCategory && matchesFilter;
    });
});

// Set active category
const setActiveCategory = (categoryId) => {
    activeCategory.value = categoryId;
};

// Toggle filter dropdown
const toggleFilterDropdown = () => {
    showFilterDropdown.value = !showFilterDropdown.value;
};

// Set active filter
const setFilter = (filter) => {
    activeFilter.value = filter;
    showFilterDropdown.value = false;
};

// Get stock class based on stock level
const getStockClass = (stock, maxStock) => {
    const percentage = (stock / maxStock) * 100;
    if (percentage < 20) return 'low';
    if (percentage < 50) return 'medium';
    return 'high';
};

// Delete product
const deleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteDoc(doc(db, 'products', productId));
            fetchProducts(); // Refresh the product list after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        }
    }
};

// Fetch products when the component is mounted
onMounted(() => {
    fetchProducts();
});

// Close filter dropdown when clicking outside
const clickOutside = (event) => {
    const filterDropdown = document.querySelector('.filter-dropdown');
    if (filterDropdown && !filterDropdown.contains(event.target)) {
        showFilterDropdown.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', clickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', clickOutside);
});
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .page-title h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 5px 0;
  }
  
  .page-title p {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
    cursor: pointer;
  }
  
  .notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    cursor: pointer;
    border: 1px solid #e5e7eb;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .user-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    color: #111827;
  }
  
  .user-info p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }
  
  /* Profile Dropdown Menu */
  .profile-dropdown {
    position: absolute;
    top: 60px;
    right: 0;
    width: 280px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 100;
    overflow: hidden;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #f3f4f6;
    position: relative;
  }
  
  .profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  
  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-header h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    color: #111827;
  }
  
  .profile-header p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }
  
  .logout-btn {
    position: absolute;
    right: 15px;
    top: 15px;
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
  }
  
  .logout-btn:hover {
    background-color: #fee2e2;
  }
  
  .profile-tabs {
    display: flex;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .tab-btn {
    flex: 1;
    padding: 12px;
    background: none;
    border: none;
    font-size: 0.9rem;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
  }
  
  .tab-btn.active {
    color: #2e5c31;
    font-weight: 500;
  }
  
  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2e5c31;
  }
  
  .tab-content {
    padding: 10px;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 15px;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.9rem;
    color: #4b5563;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .menu-item:hover {
    background-color: #f9fafb;
    color: #2e5c31;
  }
  
  .product-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-container {
    flex: 1;
    max-width: 400px;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 20px;
    padding: 8px 16px;
    width: 100%;
    border: 1px solid #e5e7eb;
  }
  
  .search-icon {
    color: #9ca3af;
    margin-right: 8px;
  }
  
  .search-box input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.9rem;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
  }
  
  .filter-dropdown {
    position: relative;
  }
  
  .filter-options {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 10;
  }
  
  .filter-options button {
    display: block;
    width: 100%;
    padding: 8px 16px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .filter-options button:hover {
    background-color: #f3f4f6;
  }
  
  .filter-btn, .add-product-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .filter-btn {
    background-color: #fff;
    color: #6b7280;
    border: 1px solid #e5e7eb;
  }
  
  .filter-btn:hover {
    background-color: #f9fafb;
  }
  
  .add-product-btn {
    background-color: #2e5c31;
    color: #fff;
    border: none;
  }
  
  .add-product-btn:hover {
    background-color: #26492a;
  }
  
  .product-categories {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .category-btn {
    padding: 8px 16px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #6b7280;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }
  
  .category-btn:hover {
    background-color: #f9fafb;
  }
  
  .category-btn.active {
    background-color: #2e5c31;
    color: #fff;
    border-color: #2e5c31;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    height: 180px;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .product-image img {
    max-width: 100%;
    max-height: 80%;
    object-fit: contain;
  }
  
  .product-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 8px;
    background-color: #2e5c31;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 500;
    border-radius: 4px;
  }
  
  .product-status {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 4px 8px;
    font-size: 0.7rem;
    font-weight: 500;
    border-radius: 4px;
  }
  
  .product-status.active {
    background-color: #10b981;
    color: #fff;
  }
  
  .product-status.inactive {
    background-color: #ef4444;
    color: #fff;
  }
  
  .product-status.scheduled {
    background-color: #f59e0b;
    color: #fff;
  }
  
  .product-details {
    padding: 15px;
  }
  
  .product-category {
    font-size: 0.8rem;
    color: #6b7280;
    margin-bottom: 5px;
  }
  
  .product-name {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 10px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-stats {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.8rem;
    color: #6b7280;
  }
  
  .product-price {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .current-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111827;
  }
  
  .profit {
    font-size: 0.8rem;
    color: #10b981;
  }
  
  .product-stock {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .stock-label {
    font-size: 0.8rem;
    color: #6b7280;
  }
  
  .stock-bar {
    flex: 1;
    height: 6px;
    background-color: #f3f4f6;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .stock-progress {
    height: 100%;
    border-radius: 3px;
  }
  
  .stock-progress.high {
    background-color: #2e5c31;
  }
  
  .stock-progress.medium {
    background-color: #f59e0b;
  }
  
  .stock-progress.low {
    background-color: #ef4444;
  }
  
  .stock-value {
    font-size: 0.8rem;
    color: #6b7280;
    min-width: 25px;
    text-align: right;
  }
  
  .product-actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-btn, .delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .edit-btn {
    background-color: #f3f4f6;
    color: #4b5563;
    border: none;
    flex: 1;
  }
  
  .edit-btn:hover {
    background-color: #e5e7eb;
  }
  
  .delete-btn {
    background-color: #fee2e2;
    color: #ef4444;
    border: none;
    width: 36px;
  }
  
  .delete-btn:hover {
    background-color: #fecaca;
  }
  
  /* Dark mode styles */
  :global(.dark) .main-content {
    background-color: #111827;
  }
  
  :global(.dark) .page-title h1 {
    color: #f9fafb;
  }
  
  :global(.dark) .page-title p,
  :global(.dark) .product-category,
  :global(.dark) .stat,
  :global(.dark) .stock-label,
  :global(.dark) .stock-value {
    color: #9ca3af;
  }
  
  :global(.dark) .search-box,
  :global(.dark) .filter-btn,
  :global(.dark) .category-btn,
  :global(.dark) .product-card,
  :global(.dark) .product-image,
  :global(.dark) .profile-dropdown {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  :global(.dark) .product-name,
  :global(.dark) .current-price {
    color: #f9fafb;
  }
  
  :global(.dark) .stock-bar,
  :global(.dark) .edit-btn {
    background-color: #374151;
  }
  
  :global(.dark) .filter-options {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  :global(.dark) .filter-options button:hover {
    background-color: #374151;
  }
  
  :global(.dark) .profit {
    color: #34d399;
  }
  </style>
  
  