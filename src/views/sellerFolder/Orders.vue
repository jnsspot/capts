<template>
  <div class="dashboard-container">
    <Sidebar initialActiveItem="Orders" />
    
    <div class="main-content">
      <header class="header">
        <div class="page-title">
          <h1>Orders</h1>
          <p>Manage and track your customer orders</p>
        </div>
        <button class="theme-toggle" @click="toggleDarkMode">
          <i :class="isDarkMode ? 'i-lucide-sun' : 'i-lucide-moon'"></i>
        </button>
      </header>

      <!-- Order Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon pending-icon">
            <i class="i-lucide-clock"></i>
          </div>
          <div class="card-content">
            <h3>Pending</h3>
            <p class="card-value">{{ pendingOrdersCount }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon processing-icon">
            <i class="i-lucide-package"></i>
          </div>
          <div class="card-content">
            <h3>Processing</h3>
            <p class="card-value">{{ processingOrdersCount }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon shipped-icon">
            <i class="i-lucide-truck"></i>
          </div>
          <div class="card-content">
            <h3>Shipped</h3>
            <p class="card-value">{{ shippedOrdersCount }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon delivered-icon">
            <i class="i-lucide-check-circle"></i>
          </div>
          <div class="card-content">
            <h3>Delivered</h3>
            <p class="card-value">{{ deliveredOrdersCount }}</p>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="actions-bar">
        <div class="search-and-filter">
          <div class="search-box">
            <i class="i-lucide-search search-icon"></i>
            <input type="text" placeholder="Search orders..." v-model="searchQuery" />
            <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          
          <div class="date-filter-container">
            <div class="date-filter">
              <i class="i-lucide-calendar"></i>
              <input 
                type="date" 
                v-model="selectedDate" 
                @change="filterByDate"
                class="minimal-date-input"
              />
              <input 
                type="time" 
                v-model="selectedTime" 
                @change="filterByDate" 
                v-if="selectedDate"
                class="minimal-time-input"
              />
              <button 
                v-if="selectedDate || selectedTime" 
                @click="resetDateFilter" 
                class="minimal-reset-btn"
              >
                <i class="i-lucide-x"></i>
              </button>
            </div>
          </div>
        </div>
          <div class="filter-actions">
            <div class="filter-dropdown">
              <button class="filter-btn" @click="toggleFilterDropdown">
                <i class="i-lucide-filter"></i>
                {{ activeFilter }}
                <i class="i-lucide-chevron-down"></i>
              </button>
              <div v-show="showFilterDropdown" class="filter-options">
                <button v-for="filter in filterOptions" :key="filter" @click="setFilter(filter)">
                  {{ filter }}
                </button>
              </div>
            </div>
            <button class="export-btn" @click="exportOrders">
              <i class="i-lucide-download"></i>
              Export
            </button>
            <button class="new-order-btn" @click="createNewOrder">
              <i class="i-lucide-plus"></i>
              New Order
            </button>
          </div>
        </div>

        <table class="orders-table">
          <thead>
            <tr>
              <th>Order Code</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in paginatedOrders" :key="order.id">
              <td class="order-id" v-if="order.orderCode">#{{ order.orderCode }}</td>
              <td class="order-id" v-else>N/A</td>
              <td>{{ order.username }}</td>
              <td>
                <div class="location-cell">
                  <i class="i-lucide-map-pin location-icon"></i>
                  <span>{{ order.Location }}</span>
                </div>
              </td>
              <td>{{ formatDateTime(order.timestamp) }}</td>
              <td>₱{{ order.totalPrice.toFixed(2) }}</td>
              <td>
                <div class="status-cell">
                  <span v-if="!editingStatus[index]" :class="['status-badge', order.status.toLowerCase()]">
                    {{ order.status }}
                    <button class="edit-status-btn" @click="startEditingStatus(index)">
                      <i class="i-lucide-edit-2"></i>
                    </button>
                  </span>
                  <div v-else class="status-dropdown">
                    <select v-model="order.status" @change="finishEditingStatus(index, order)" class="status-select">
                      <option v-for="status in statusOptions" :key="status" :value="status">
                        {{ status }}
                      </option>
                    </select>
                  </div>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn view-btn" @click="viewOrderDetails(order)">
                    <i class="i-lucide-eye"></i>
                    View
                  </button>
                  <button class="action-btn edit-btn" @click="editOrder(order)">
                    <i class="i-lucide-edit"></i>
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button :disabled="currentPage === 1" @click="currentPage--">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="currentPage++">
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div v-if="showOrderModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Order {{ selectedOrder.orderCode ? `#${selectedOrder.orderCode}` : '' }}</h2>
            <button class="close-btn" @click="closeModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="order-info-section">
              <div class="info-group">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {{ selectedOrder.username }}</p>
                <p><strong>User ID:</strong> {{ selectedOrder.userId }}</p>
              </div>
              
              <div class="info-group">
                <h3>Delivery Information</h3>
                <p><strong>Address:</strong> {{ selectedOrder.Location }}</p>
              </div>
              
              <div class="info-group">
                <h3>Order Details</h3>
                <p><strong>Date:</strong> {{ formatDateTime(selectedOrder.timestamp) }}</p>
                <p><strong>Status:</strong> 
                  <span :class="['status-badge', selectedOrder.status.toLowerCase()]">
                    {{ selectedOrder.status }}
                  </span>
                </p>
              </div>
            </div>
            
            <div class="order-items-section">
              <h3>Order Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Weight</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ selectedOrder.productName }}</td>
                    <td>{{ selectedOrder.weight }} kg</td>
                    <td>₱{{ selectedOrder.totalPrice.toFixed(2) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" class="text-right"><strong>Total</strong></td>
                    <td class="total-cell">₱{{ selectedOrder.totalPrice.toFixed(2) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div class="order-actions-section">
              <h3>Update Order Status</h3>
              <div class="status-update-form">
                <select v-model="newStatus" class="status-select">
                  <option v-for="status in statusOptions" :key="status" :value="status">
                    {{ status }}
                  </option>
                </select>
                <button class="update-status-btn" @click="updateOrderStatus">
                  Update Status
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
import { ref, computed, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// UI State
const isDarkMode = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const showFilterDropdown = ref(false);
const activeFilter = ref('All Orders');
const editingStatus = ref({});
const showOrderModal = ref(false);
const selectedOrder = ref({});
const newStatus = ref('');
const orders = ref([]);
const selectedDate = ref('');
const selectedTime = ref('');
const currentSellerId = ref('');

// Initialize with empty orders
const initializeOrders = async () => {
  try {
    const auth = getAuth();
    currentSellerId.value = auth.currentUser?.uid;
    
    if (!currentSellerId.value) {
      console.error('No seller ID found');
      return;
    }

    const querySnapshot = await getDocs(collection(db, 'orders'));
    orders.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let timestamp = data.createdAt || data.timestamp; // Prefer createdAt if it exists
      
      // Convert to Date if it's a Firestore Timestamp
      if (timestamp && typeof timestamp.toDate === 'function') {
        timestamp = timestamp.toDate();
      }
      // Convert to Date if it's a string
      else if (typeof timestamp === 'string') {
        timestamp = new Date(timestamp);
      }
      // If it's missing, use current date
      else if (!timestamp) {
        timestamp = new Date();
      }
      
      return {
        id: doc.id,
        ...data,
        username: data.username || '',
        status: data.status || 'Pending',
        Location: data.Location || '',
        totalPrice: data.totalPrice || 0,
        timestamp: timestamp, // Now using createdAt if available
        sellerId: data.sellerId || '',
        orderCode: data.orderCode || ''
      };
    }).filter(order => order.sellerId === currentSellerId.value);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

onMounted(() => {
  initializeOrders();
});

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark', isDarkMode.value);
};

const filterOptions = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// Order summary stats
const pendingOrdersCount = computed(() => orders.value.filter(order => order.status === 'Pending').length);
const processingOrdersCount = computed(() => orders.value.filter(order => order.status === 'Processing').length);
const shippedOrdersCount = computed(() => orders.value.filter(order => order.status === 'Shipped').length);
const deliveredOrdersCount = computed(() => orders.value.filter(order => order.status === 'Delivered').length);

// Filter orders based on search query, active filter, and date
const filteredOrders = computed(() => {
  const searchTerm = searchQuery.value.toLowerCase();
  return orders.value.filter(order => {
    const matchesSearch = 
      (order.orderCode && order.orderCode.toLowerCase().includes(searchTerm)) ||
      (order.username && order.username.toLowerCase().includes(searchTerm));
    
    const matchesFilter = 
      activeFilter.value === 'All Orders' || 
      order.status === activeFilter.value;
    
    const matchesDate = filterByDateCondition(order.timestamp);
    
    return matchesSearch && matchesFilter && matchesDate;
  });
});

// Date filtering logic
const filterByDateCondition = (orderDate) => {
  if (!selectedDate.value) return true;
  
  const orderDateObj = new Date(orderDate);
  const selectedDateObj = new Date(selectedDate.value);
  
  // Compare dates (ignoring time)
  if (!isSameDate(orderDateObj, selectedDateObj)) {
    return false;
  }
  
  // If time is selected, compare hours and minutes
  if (selectedTime.value) {
    const [hours, minutes] = selectedTime.value.split(':').map(Number);
    selectedDateObj.setHours(hours, minutes, 0, 0);
    
    // Compare hours and minutes
    return (
      orderDateObj.getHours() === hours &&
      orderDateObj.getMinutes() === minutes
    );
  }
  
  return true;
};

const isSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const filterByDate = () => {
  currentPage.value = 1;
};

const resetDateFilter = () => {
  selectedDate.value = '';
  selectedTime.value = '';
  currentPage.value = 1;
};

// Calculate total pages for pagination
const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / itemsPerPage)));

// Get paginated orders for current page
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrders.value.slice(start, end);
});

// Filter dropdown functions
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

const setFilter = (filter) => {
  activeFilter.value = filter;
  currentPage.value = 1;
  showFilterDropdown.value = false;
};

// Status editing functions
const startEditingStatus = (index) => {
  editingStatus.value = { ...editingStatus.value, [index]: true };
};

const finishEditingStatus = async (index, order) => {
  editingStatus.value = { ...editingStatus.value, [index]: false };
  try {
    const orderRef = doc(db, 'orders', order.id);
    await updateDoc(orderRef, {
      status: order.status
    });
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

// Format date and time for display
const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  let dateObj;
  
  // If it's already a Date object
  if (timestamp instanceof Date) {
    dateObj = timestamp;
  }
  // If it's a Firestore Timestamp
  else if (typeof timestamp.toDate === 'function') {
    dateObj = timestamp.toDate();
  }
  // If it's a string that can be converted to a date
  else if (typeof timestamp === 'string') {
    dateObj = new Date(timestamp);
    if (isNaN(dateObj.getTime())) return 'N/A';
  }
  // If it's a number (milliseconds since epoch)
  else if (typeof timestamp === 'number') {
    dateObj = new Date(timestamp);
  }
  else {
    return 'N/A';
  }
  
  return dateObj.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Order detail modal functions
const viewOrderDetails = (order) => {
  selectedOrder.value = { ...order };
  newStatus.value = order.status;
  showOrderModal.value = true;
};

const closeModal = () => {
  showOrderModal.value = false;
};

const editOrder = (order) => {
  alert(`Edit order ${order.orderCode ? `#${order.orderCode}` : ''}`);
};

const updateOrderStatus = async () => {
  try {
    const orderRef = doc(db, 'orders', selectedOrder.value.id);
    await updateDoc(orderRef, {
      status: newStatus.value
    });
    
    // Update local state
    const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value.id);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus.value;
      selectedOrder.value.status = newStatus.value;
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

// Additional action functions
const exportOrders = () => {
  alert('Exporting orders to CSV');
};

const createNewOrder = () => {
  alert('Creating new order');
};
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
  margin-left: 230px; /* Match the sidebar width */
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

.theme-toggle {
  background: none;
  border: none;
  color: #111827;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.theme-toggle:hover {
  background: rgba(0,0,0,0.05);
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.summary-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.card-icon {
  padding: 12px;
  border-radius: 8px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.pending-icon {
  background-color: #fef3c7;
  color: #d97706;
}

.processing-icon {
  background-color: #e0f2fe;
  color: #0284c7;
}

.shipped-icon {
  background-color: #dbeafe;
  color: #2563eb;
}

.delivered-icon {
  background-color: #d1fae5;
  color: #059669;
}

.card-content h3 {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 5px 0;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.content-wrapper {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.search-and-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: #f9f9f9;
}

.search-box input:focus {
  outline: none;
  border-color: #888;
  background-color: white;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #888;
}

.clear-search {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0;
}

/* Date Filter Styles */
.date-filter-container {
  display: flex;
  align-items: center;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  height: 40px;
}

.date-filter i {
  color: #888;
  font-size: 16px;
}

.minimal-date-input,
.minimal-time-input {
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 14px;
  color: #333;
  outline: none;
  width: 120px;
  appearance: none;
  -webkit-appearance: none;
}

.minimal-time-input {
  width: 80px;
}

.minimal-reset-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.minimal-reset-btn:hover {
  background-color: #f0f0f0;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-dropdown {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4b5563;
  cursor: pointer;
}

.filter-options {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  min-width: 150px;
}

.filter-options button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #4b5563;
  cursor: pointer;
}

.filter-options button:hover {
  background-color: #f3f4f6;
}

.export-btn, .new-order-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
}

.export-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}

.new-order-btn {
  background-color: #2e5c31;
  color: white;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.orders-table th {
  font-weight: 600;
  color: #4b5563;
  background-color: #f9fafb;
}

.order-id {
  font-weight: 600;
  color: #2e5c31;
}

.location-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-icon {
  color: #2e5c31;
}

.status-cell {
  position: relative;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.edit-status-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.status-badge:hover .edit-status-btn {
  opacity: 1;
}

.status-dropdown {
  display: inline-block;
}

.status-select {
  padding: 4px 8px;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: white;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.processing {
  background-color: #e0f2fe;
  color: #0284c7;
}

.status-badge.shipped {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-badge.delivered {
  background-color: #d1fae5;
  color: #059669;
}

.status-badge.cancelled {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: #e0f2fe;
  color: #0284c7;
}

.view-btn:hover {
  background-color: #bae6fd;
}

.edit-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}

.edit-btn:hover {
  background-color: #e5e7eb;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.order-info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-group h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.info-group p {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #4b5563;
}

.order-items-section {
  margin-bottom: 30px;
}

.order-items-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 15px 0;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.items-table th {
  font-weight: 600;
  color: #4b5563;
  background-color: #f9fafb;
}

.items-table tfoot td {
  padding: 10px;
  text-align: right;
}

.text-right {
  text-align: right;
}

.total-cell {
  font-weight: 700;
  color: #2e5c31;
  font-size: 1.1rem;
}

.order-actions-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 15px 0;
}

.status-update-form {
  display: flex;
  gap: 10px;
}

.status-update-form .status-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
}

.update-status-btn {
  padding: 8px 16px;
  background-color: #2e5c31;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.update-status-btn:hover {
  background-color: #234425;
}

/* Dark mode styles */
:global(.dark) .main-content {
  background-color: #111827;
}

:global(.dark) .theme-toggle {
  color: #f9fafb;
}

:global(.dark) .theme-toggle:hover {
  background: rgba(255,255,255,0.1);
}

:global(.dark) .content-wrapper {
  background-color: #1f2937;
}

:global(.dark) .page-title h1 {
  color: #f9fafb;
}

:global(.dark) .page-title p {
  color: #9ca3af;
}

:global(.dark) .summary-card {
  background-color: #1f2937;
}

:global(.dark) .card-value {
  color: #f9fafb;
}

:global(.dark) .search-box,
:global(.dark) .filter-btn,
:global(.dark) .export-btn,
:global(.dark) .date-filter {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

:global(.dark) .search-box input,
:global(.dark) .minimal-date-input,
:global(.dark) .minimal-time-input {
  color: #e5e7eb;
}

:global(.dark) .filter-options {
  background-color: #1f2937;
  border-color: #4b5563;
}

:global(.dark) .filter-options button {
  color: #e5e7eb;
}

:global(.dark) .filter-options button:hover {
  background-color: #374151;
}

:global(.dark) .orders-table th {
  background-color: #374151;
  color: #e5e7eb;
}

:global(.dark) .orders-table td {
  border-color: #4b5563;
  color: #e5e7eb;
}

:global(.dark) .order-id {
  color: #6abe6e;
}

:global(.dark) .location-icon {
  color: #6abe6e;
}

:global(.dark) .pagination button {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

:global(.dark) .modal-content {
  background-color: #1f2937;
}

:global(.dark) .modal-header {
  border-bottom-color: #4b5563;
}

:global(.dark) .modal-header h2 {
  color: #f9fafb;
}

:global(.dark) .close-btn {
  color: #9ca3af;
}

:global(.dark) .info-group h3 {
  color: #f9fafb;
  border-bottom-color: #4b5563;
}

:global(.dark) .info-group p {
  color: #9ca3af;
}

:global(.dark) .items-table th {
  background-color: #374151;
  color: #e5e7eb;
}

:global(.dark) .items-table td,
:global(.dark) .items-table th {
  border-color: #4b5563;
}

:global(.dark) .total-cell {
  color: #6abe6e;
}

:global(.dark) .order-actions-section h3 {
  color: #f9fafb;
}

:global(.dark) .status-update-form .status-select {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

:global(.dark) .update-status-btn {
  background-color: #6abe6e;
  color: #111827;
}

:global(.dark) .update-status-btn:hover {
  background-color: #58a85c;
}

/* Responsive styles */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 15px;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-and-filter {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-box {
    max-width: none;
  }
  
  .date-filter {
    width: 100%;
    justify-content: space-between;
  }
  
  .minimal-date-input,
  .minimal-time-input {
    width: 100%;
  }
  
  .filter-actions {
    justify-content: space-between;
    width: 100%;
  }
  
  .order-info-section {
    grid-template-columns: 1fr;
  }
  
  .status-update-form {
    flex-direction: column;
  }
}
</style>