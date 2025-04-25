<!-- src/components/RecordSaleButton.vue -->
<template>
    <button @click="recordSale" class="record-btn">
      Record Sale
    </button>
    
    <div v-if="showForm" class="sale-form">
      <select v-model="selectedProduct">
        <option v-for="product in products" :key="product.id" :value="product">
          {{ product.name }} (₱{{ product.price }})
        </option>
      </select>
      <input type="number" v-model="quantity" min="1" placeholder="Quantity">
      <button @click="submitSale">Submit</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { recordSale } from '@/utils/salesRecorder';
  
  const props = defineProps({
    products: Array
  });
  
  const showForm = ref(false);
  const selectedProduct = ref(null);
  const quantity = ref(1);
  
  const recordSale = () => {
    showForm.value = true;
  };
  
  const submitSale = async () => {
    if (!selectedProduct.value || quantity.value < 1) return;
    
    try {
      await recordSale({
        productId: selectedProduct.value.id,
        productName: selectedProduct.value.name,
        category: selectedProduct.value.category,
        quantity: quantity.value,
        price: selectedProduct.value.price
      });
      
      // Reset form
      showForm.value = false;
      selectedProduct.value = null;
      quantity.value = 1;
      
      alert('Sale recorded successfully!');
    } catch (error) {
      console.error("Error recording sale:", error);
      alert('Failed to record sale');
    }
  };
  </script>
  
  <style scoped>
  .record-btn {
    padding: 8px 16px;
    background-color: #2e5c31;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .sale-form {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .sale-form select, 
  .sale-form input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  </style>