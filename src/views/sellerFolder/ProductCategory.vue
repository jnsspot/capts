<template>
  <div class="product-category">
    <!-- Header -->
    <div class="header">
      <h1 class="app-title">FarmXpress</h1>
      <div class="icons">
        <i class="fas fa-comments"></i>
        <i class="fas fa-user-circle"></i>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <h2>Start Adding New Products</h2>
      <p>Easily add your products and manage your inventory.</p>

      <div class="button-group">
        <button class="new-product-btn" @click="addNewProduct">New Product</button>
        <button class="new-category-btn" @click="addNewCategory">New Category</button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="bottom-nav">
      <router-link to="/seller-home">
        <i class="fas fa-home"></i>
      </router-link>
      <router-link to="/product-category">
        <i class="fas fa-plus-circle"></i>
      </router-link>
      <router-link to="/orders">
        <i class="fas fa-shopping-cart"></i>
      </router-link>
      <router-link to="/sales">
        <i class="fas fa-chart-line"></i>
      </router-link>
      <router-link to="/notifications">
        <i class="fas fa-bell"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCategory",
  methods: {
    addNewProduct() {
      console.log("New Product button clicked");
      this.$router.push('/product'); 
    },
    addNewCategory() {
      console.log("New Category button clicked");
      this.$router.push('/category'); 
    },
  },
};
</script>

<style scoped>
.product-category {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background: #f2f2f2;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #2e5c31;
  color: white;
}

.icons i {
  font-size: 24px;
  margin-left: 15px;
}

.main-content {
  text-align: center;
  padding: 20px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.new-product-btn,
.new-category-btn {
  background: #2e5c31;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.new-product-btn:hover,
.new-category-btn:hover {
  background: #256127;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: white;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.bottom-nav a {
  text-decoration: none;
}

.bottom-nav i {
  font-size: 24px;
  color: #2e5c31;
}
</style>