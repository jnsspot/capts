<template>
    <div class="dashboard-container">
      <Sidebar :initialActiveItem="isEditing ? 'Farm Products' : 'Add Product'" />
      
      <div class="main-content">
        <header class="header">
          <div class="page-title">
            <h1>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h1>
            <p>{{ isEditing ? 'Update product details' : 'Create a new farm product' }}</p>
          </div>
        </header>
        
        <form @submit.prevent="saveProduct" class="product-form">
          <div class="form-grid">
            <div class="form-section">
              <h2>Basic Information</h2>
              <div class="form-group">
                <label for="productName">Product Name</label>
                <input type="text" id="productName" v-model="product.productName" required>
              </div>
              
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="product.description" rows="3"></textarea>
              </div>
              
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" v-model="product.category">
                  <option value="All Products">All Products</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Herbs & Spices">Herbs & Spices</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="code">Product Code</label>
                <input type="text" id="code" v-model="product.code">
              </div>
            </div>
            
            <div class="form-section">
              <h2>Pricing & Stock</h2>
              <div class="form-group">
                <label for="price">Price</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" id="price" v-model="product.price" step="0.01" @input="calculateProfit">
                </div>
              </div>
              
              <div class="form-group">
                <label for="cost">Cost</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" id="cost" v-model="product.cost" step="0.01" @input="calculateProfit">
                </div>
              </div>
              
              <div class="form-group">
                <label for="profit">Profit</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" id="profit" v-model="product.profit" step="0.01" readonly>
                </div>
              </div>
              
              <div class="form-group">
                <label for="stock">Stock</label>
                <input type="number" id="stock" v-model="product.stock">
              </div>
            </div>
            
            <div class="form-section">
              <h2>Product Details</h2>
              <div class="form-group">
                <label for="weight">Weight</label>
                <div class="input-group">
                  <input type="number" id="weight" v-model="product.weight" step="0.01">
                  <select id="unit" v-model="product.unit">
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="packagingType">Packaging Type</label>
                <select id="packagingType" v-model="product.packagingType">
                  <option value="box">Box</option>
                  <option value="bag">Bag</option>
                  <option value="crate">Crate</option>
                  <option value="bunch">Bunch</option>
                  <option value="piece">Piece</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="quantityPerPackage">Quantity per Package</label>
                <input type="number" id="quantityPerPackage" v-model="product.quantityPerPackage">
              </div>
            </div>
            
            <div class="form-section">
              <h2>Images</h2>
              <div class="form-group">
                <label for="productImages">Product Images</label>
                <input type="file" id="productImages" @change="handleImageUpload" multiple accept="image/*">
              </div>
              <div class="image-preview" v-if="product.images.length > 0">
                <div v-for="(image, index) in product.images" :key="index" class="image-item">
                  <img :src="image" :alt="`Product image ${index + 1}`">
                  <button type="button" @click="removeImage(index)" class="remove-image">×</button>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h2>Marketing & Availability</h2>
              <div class="form-group">
                <label for="ribbon">Ribbon</label>
                <input type="text" id="ribbon" v-model="product.ribbon">
              </div>
              
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" v-model="product.status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
              
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="preorder" v-model="product.preorder">
                  Preorder
                </label>
              </div>
              
              <div class="form-group" v-if="product.preorder">
                <label for="preorderLimit">Preorder Limit</label>
                <input type="number" id="preorderLimit" v-model="product.preorderLimit">
              </div>
              
              <div class="form-group" v-if="product.preorder">
                <label for="preorderMessage">Preorder Message</label>
                <textarea id="preorderMessage" v-model="product.preorderMessage" rows="2"></textarea>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="cancelEdit">Cancel</button>
            <button type="submit" class="save-btn">{{ isEditing ? 'Update' : 'Save' }} Product</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase/firebaseConfig'; // Import Firebase Firestore
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import Sidebar from '@/components/Sidebar.vue';

const route = useRoute();
const router = useRouter();
const auth = getAuth(); // Initialize Firebase Auth

const isEditing = computed(() => route.name === 'EditProduct');

const product = ref({
    productName: '',
    description: '',
    ribbon: '',
    category: 'All Products',
    price: null,
    cost: null,
    profit: null,
    stock: null,
    code: '',
    weight: null,
    unit: 'kg',
    packagingType: 'box',
    quantityPerPackage: null,
    images: [],
    preorder: false,
    preorderLimit: null,
    preorderMessage: '',
    status: 'Active',
});

const calculateProfit = () => {
    if (product.value.price && product.value.cost) {
        product.value.profit = (product.value.price - product.value.cost).toFixed(2);
    } else {
        product.value.profit = null;
    }
};

watch(() => [product.value.price, product.value.cost], calculateProfit);

const handleImageUpload = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
            product.value.images.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
    }
};

const removeImage = (index) => {
    product.value.images.splice(index, 1);
};

const fetchProduct = async (productId) => {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
        product.value = { ...productSnap.data(), id: productSnap.id };
    } else {
        alert('Product not found');
        router.push('/products');
    }
};

const saveProduct = async () => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
        alert('You must be logged in to add a product.');
        return;
    }

    try {
        if (isEditing.value) {
            // Update the product in Firestore
            const productRef = doc(db, 'products', product.value.id);
            await updateDoc(productRef, {
                ...product.value,
                userId: user.uid, // Include the userId in the product data
            });
            alert('Product updated successfully!');
        } else {
            // Add the product to Firestore with the userId
            await addDoc(collection(db, 'products'), {
                ...product.value,
                userId: user.uid, // Include the userId in the product data
            });
            alert('Product saved successfully!');
        }
        router.push('/products'); // Redirect to the products page
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product.');
    }
};

const cancelEdit = () => {
    router.push('/farm-products');
};

// Fetch product data if in edit mode
onMounted(() => {
    if (isEditing.value && route.params.productId) {
        fetchProduct(route.params.productId);
    }
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
  
  .product-form {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .form-section {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 20px;
  }
  
  .form-section h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin-top: 0;
    margin-bottom: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  
  .form-group label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 5px;
  }
  
  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group input[type="file"],
  .form-group select,
  .form-group textarea {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #111827;
  }
  
  .input-group {
    display: flex;
    align-items: center;
  }
  
  .input-group-text {
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-right: none;
    padding: 8px 12px;
    border-radius: 4px 0 0 4px;
    color: #6b7280;
  }
  
  .input-group input {
    border-radius: 0 4px 4px 0;
    flex-grow: 1;
  }
  
  .checkbox-group {
    flex-direction: row;
    align-items: center;
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  
  .image-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  
  .image-item {
    position: relative;
    width: 100px;
    height: 100px;
  }
  
  .image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .remove-image {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ef4444;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-btn,
  .save-btn {
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .save-btn {
    background-color: #2e5c31;
    color: #fff;
    border: none;
  }
  
  .save-btn:hover {
    background-color: #26492a;
  }
  
  /* Dark mode styles */
  :global(.dark) .main-content {
    background-color: #111827;
  }
  
  :global(.dark) .product-form {
    background-color: #1f2937;
  }
  
  :global(.dark) .form-section {
    background-color: #374151;
  }
  
  :global(.dark) .page-title h1 {
    color: #f9fafb;
  }
  
  :global(.dark) .page-title p {
    color: #9ca3af;
  }
  
  :global(.dark) .form-section h2,
  :global(.dark) .form-group label {
    color: #e5e7eb;
  }
  
  :global(.dark) .form-group input[type="text"],
  :global(.dark) .form-group input[type="number"],
  :global(.dark) .form-group input[type="file"],
  :global(.dark) .form-group select,
  :global(.dark) .form-group textarea {
    background-color: #4b5563;
    border-color: #6b7280;
    color: #f9fafb;
  }
  
  :global(.dark) .input-group-text {
    background-color: #4b5563;
    border-color: #6b7280;
    color: #e5e7eb;
  }
  
  :global(.dark) .cancel-btn {
    background-color: #374151;
    color: #e5e7eb;
    border-color: #4b5563;
  }
  
  :global(.dark) .save-btn {
    background-color: #4a8f4d;
  }
  
  :global(.dark) .save-btn:hover {
    background-color: #3e7b40;
  }
  </style>
  
  