<template>
  <div class="user-home">
    <!-- Header -->
    <div class="header">
      <h1 class="app-title">FarmXpress</h1>

      <div class="search-container">
        <input type="text" class="search-bar" placeholder="Search for products..." />
        <div class="icons">
          <i class="fas fa-comments"></i>
          <router-link to="/profile" class="profile-link">
            <i class="fas fa-user-circle"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="categories">
      <div class="category">
        <button class="category-btn">
          <i class="fas fa-apple-alt"></i>
        </button>
        <p>Fruits</p>
      </div>
      <div class="category">
        <button class="category-btn">
          <i class="fas fa-carrot"></i>
        </button>
        <p>Vegetables</p>
      </div>
      <div class="category">
        <button class="category-btn">
          <i class="fas fa-drumstick-bite"></i>
        </button>
        <p>Meat & Poultry</p>
      </div>
      <div class="category">
        <button class="category-btn">
          <i class="fas fa-fish"></i>
        </button>
        <p>Seafood</p>
      </div>
      <div class="category">
        <button class="category-btn">
          <i class="fas fa-seedling"></i>
        </button>
        <p>Grains</p>
      </div>
      <div class="category dropdown">
        <button class="category-btn" @click="toggleDropdown">
          <i class="fas fa-ellipsis-h"></i>
        </button>
        <p>Others</p>
        <div v-if="showDropdown" class="dropdown-content">
          <p>Organic</p>
          <p>Beverages</p>
          <p>Livestock</p>
          <p>Seeds</p>
        </div>
      </div>
    </div>

    <!-- New Products Section -->
    <div class="product-section">
      <h2>New Collection</h2>
      <div class="product-list">
        <div class="product" v-for="(product, index) in products" :key="index">
          <img :src="product.image" alt="Product" />
          <span class="product-price">₱{{ product.price }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="bottom-nav">
      <i class="fas fa-home"></i>
      <i class="fas fa-heart"></i>
      <i class="fas fa-shopping-cart"></i>
      <i class="fas fa-box"></i>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

export default {
  setup() {
    const products = ref([]);

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        products.value = querySnapshot.docs.map(doc => doc.data());
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    onMounted(fetchProducts);

    return { products };
  }
};
</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.product {
  width: 120px;
  text-align: center;
}

.product img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.product-price {
  font-weight: bold;
  color: #28a745;
}
</style>


<style scoped>
.user-home {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background: #f2f2f2;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #2e5c31;
  color: white;
  flex-wrap: wrap;
}

.app-title {
  font-size: 1.5rem;
  margin: 0;
}

/* Search Bar & Icons */
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  max-width: 100%;
  margin: 10px 0;
}

.search-bar {
  width: 60%; /* Minimized width */
  padding: 8px;
  border-radius: 5px;
  border: none;
  max-width: 300px; /* Limits width on larger screens */
}

.icons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icons i {
  font-size: 20px;
  cursor: pointer;
}

/* Profile Link */
.profile-link {
  text-decoration: none;
  color: inherit;
}

.profile-link i {
  transition: transform 0.2s;
}

.profile-link i:hover {
  transform: scale(1.1);
}

/* Categories */
.categories {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}

.category {
  text-align: center;
  flex: 1 1 20%; /* Adjusted for 5 items per row */
  max-width: 20%;
}

.category-btn {
  background: #2e5c31;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  width: 50px;
  height: 50px;
}

.category-btn i {
  font-size: 20px;
}

.category p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.dropdown-content {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  z-index: 1;
}

.dropdown-content p {
  margin: 5px 0;
  font-size: 0.9rem;
}

/* Featured Products */
.product-section {
  text-align: center;
  margin: 15px 0;
}

.product-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.product {
  flex: 1 1 45%; /* Two products per row */
  max-width: 45%;
  background: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product img {
  width: 100%;
  height: 100px; /* Smaller image size */
  border-radius: 8px;
  object-fit: cover; /* Ensures images fill the space */
}

.product-title {
  font-weight: bold;
  font-size: 0.9rem;
  margin: 5px 0;
}

.product-price {
  color: #d35400;
  font-size: 1rem;
  margin: 5px 0;
}

.add-to-cart-btn {
  background: #2e5c31;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 5px;
}

.add-to-cart-btn i {
  margin-right: 5px;
}

/* Bottom Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: white;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
}

.bottom-nav i {
  font-size: 20px;
  color: #2e5c31;
  padding: 10px;
  cursor: pointer;
}

/* Media Queries for Mobile Responsiveness */
@media (max-width: 480px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-title {
    font-size: 1.2rem;
  }

  .search-container {
    width: 100%;
    margin: 5px 0;
  }

  .search-bar {
    width: 80%; /* Adjusted for mobile */
  }

  .icons {
    gap: 5px;
  }

  .icons i {
    font-size: 18px;
  }

  .categories {
    gap: 5px;
  }

  .category {
    flex: 1 1 30%; /* Adjusted for mobile */
    max-width: 30%;
  }

  .category-btn {
    width: 40px;
    height: 40px;
  }

  .category-btn i {
    font-size: 16px;
  }

  .category p {
    font-size: 0.8rem;
  }

  .product {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .product-title {
    font-size: 0.8rem;
  }

  .product-price {
    font-size: 0.9rem;
  }

  .add-to-cart-btn {
    font-size: 0.7rem;
    padding: 6px 10px;
  }

  .bottom-nav i {
    font-size: 18px;
  }
}
</style>