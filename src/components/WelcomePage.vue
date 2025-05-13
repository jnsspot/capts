<template>
  <div class="welcome-page">
    <h1>Welcome to Farm Marketplace</h1>
    <p>
      Your one-stop platform for buying and selling fresh farm products.<br>
      Connect with local farmers and get the best quality produce.
    </p>
    
    <div class="features">
      <h3>Key Features</h3>
      <ul>
        <li>Direct farm-to-consumer marketplace</li>
        <li>Fresh and organic produce</li>
        <li>Local farmers support</li>
        <li>Secure transactions</li>
      </ul>
    </div>

    <div class="quick-links">
      <h3>Quick Links</h3>
      <ul>
        <li><router-link to="/products">Browse Products</router-link></li>
        <li><router-link to="/seller/register">Become a Seller</router-link></li>
        <li><router-link to="/about">About Us</router-link></li>
        <li><router-link to="/contact">Contact Support</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    default: 'Welcome to Farm Marketplace'
  }
});
</script>

<style scoped>
.welcome-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #2e5c31;
  margin-bottom: 1.5rem;
}

p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.features, .quick-links {
  margin: 2rem 0;
  text-align: left;
}

h3 {
  color: #2e5c31;
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
  color: #4a5568;
}

a {
  color: #2e5c31;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #4a8f4d;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .welcome-page {
    padding: 1rem;
  }
}
</style>
