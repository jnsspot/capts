<template>
  <div v-if="visible">
    <div class="modal-overlay" @click.self="close"></div>
    
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">{{ productName }}</h3>
        <img :src="productImage" :alt="productName" class="product-image">
      </div>

      <div class="modal-body">
        <div class="detail-row">
          <span class="detail-label">Category:</span>
          <span class="detail-value">{{ category }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">Weight (kg)</label>
          <input 
            type="number" 
            v-model="weight" 
            min="0.1" 
            max="20" 
            step="0.1" 
            @input="validateWeight"
            class="form-input"
            :class="{ 'error': weightError }"
          >
          <span v-if="weightError" class="error-message">{{ weightError }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">Packaging</label>
          <select v-model="packagingType" class="form-select">
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="box">Box</option>
          </select>
        </div>

        <div class="price-summary">
          <div class="price-row">
            <span>Price per kg:</span>
            <span class="price-value">₱{{ pricePerKg }}</span>
          </div>
          <div class="price-row">
            <span>Total Price:</span>
            <span class="price-value">₱{{ computedPrice }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">Cancel</button>
        <button 
          class="btn btn-primary" 
          @click="confirm" 
          :disabled="!isValid"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  visible: Boolean,
  productName: String,
  productImage: String,
  category: String,
  pricePerKg: {
    type: Number,
    required: true
  },
  initialWeight: {
    type: Number,
    default: 1
  },
  initialPackagingType: {
    type: String,
    default: 'plastic'
  }
});

const emit = defineEmits(['close', 'confirm']);

const weight = ref(props.initialWeight);
const packagingType = ref(props.initialPackagingType);
const weightError = ref('');

const computedPrice = computed(() => {
  return (weight.value * props.pricePerKg).toFixed(2);
});

const isValid = computed(() => {
  return weight.value > 0 && weight.value <= 20 && !weightError.value;
});

const validateWeight = () => {
  if (weight.value <= 0) {
    weightError.value = 'Weight must be greater than 0';
  } else if (weight.value > 20) {
    weightError.value = 'Weight cannot exceed 20 kg';
  } else {
    weightError.value = '';
  }
};

const close = () => {
  emit('close');
};

const confirm = () => {
  if (!isValid.value) return;
  
  emit('confirm', {
    weight: weight.value,
    packagingType: packagingType.value,
    totalPrice: parseFloat(computedPrice.value)
  });
  
  close();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.modal-title {
  margin: 0 0 15px 0;
  color: #2e5c31;
  font-size: 1.2rem;
}

.product-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
}

.modal-body {
  padding: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-input.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 4px;
  display: block;
}

.price-summary {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.price-row:last-child {
  margin-bottom: 0;
  font-weight: 600;
  color: #2e5c31;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.btn-primary {
  background-color: #2e5c31;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #26492a;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  .modal-footer {
    padding: 15px;
  }
}
</style>