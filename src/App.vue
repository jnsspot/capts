<template>
  <div id="app">
    <div v-if="error" class="error-banner">
      {{ error.message }}
      <button @click="clearError" class="close-button">&times;</button>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>


<script>
import { getSession } from './helpers/sessionHelper';
import { ref, provide, onMounted, onUnmounted } from "vue";
import { useStore } from 'vuex';
import { handleApiError } from './utils/errorHandling';

export default {
  setup() {
    const store = useStore();
    const categories = ref([]);
    const products = ref([]);
    const error = ref(null);
    const sessionTimeout = ref(null);

    // Session management
    const checkSession = () => {
      const session = getSession();
      if (!session) {
        store.dispatch('logout');
      }
    };

    // Activity monitoring
    const resetSessionTimeout = () => {
      if (sessionTimeout.value) {
        clearTimeout(sessionTimeout.value);
      }
      sessionTimeout.value = setTimeout(() => {
        checkSession();
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Enhanced category management
    const addCategory = async (category) => {
      try {
        // Validate category data
        if (!category.name || typeof category.name !== 'string') {
          throw new Error('Invalid category data');
        }
        categories.value.push(category);
      } catch (error) {
        handleApiError(error);
      }
    };

    // Enhanced product management
    const addProduct = async (product) => {
      try {
        // Validate product data
        if (!product.name || !product.price || typeof product.price !== 'number') {
          throw new Error('Invalid product data');
        }
        products.value.push(product);
      } catch (error) {
        handleApiError(error);
      }
    };

    // Error handling
    const clearError = () => {
      error.value = null;
      store.commit('SET_ERROR', null);
    };

    // Lifecycle hooks
    onMounted(() => {
      // Set up activity listeners
      window.addEventListener('mousemove', resetSessionTimeout);
      window.addEventListener('keypress', resetSessionTimeout);
      resetSessionTimeout();
    });

    onUnmounted(() => {
      // Clean up listeners
      window.removeEventListener('mousemove', resetSessionTimeout);
      window.removeEventListener('keypress', resetSessionTimeout);
      if (sessionTimeout.value) {
        clearTimeout(sessionTimeout.value);
      }
    });

    // Provide data to child components
    provide("categories", categories);
    provide("addCategory", addCategory);
    provide("products", products);
    provide("addProduct", addProduct);

    return {
      categories,
      products,
      error,
      clearError
    };
  }
};


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.error-banner {
  background-color: #ff4444;
  color: white;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #42b983;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
