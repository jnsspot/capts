<template>
    <div class="dashboard-container">
      <Sidebar initialActiveItem="Orders" />
      
      <div class="main-content">
        <header class="header">
          <div class="page-title">
            <h1>Orders</h1>
            <p>Manage and track your customer orders</p>
          </div>
        </header>
  
        <div class="content-wrapper">
          <div class="actions-bar">
            <div class="search-container">
              <div class="search-box">
                <Search size="18" class="search-icon" />
                <input type="text" placeholder="Search orders..." v-model="searchQuery" />
              </div>
            </div>
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
          </div>
  
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.customer }}</td>
                <td>{{ order.date }}</td>
                <td>${{ order.total.toFixed(2) }}</td>
                <td>
                  <span :class="['status-badge', order.status.toLowerCase()]">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <button class="action-btn view-btn">
                    <Eye size="14" />
                    View
                  </button>
                  <button class="action-btn edit-btn">
                    <Edit size="14" />
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div class="pagination">
            <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">&lt; Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">Next &gt;</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import Sidebar from '@/components/Sidebar.vue';
  import { Search, Filter, ChevronDown, Eye, Edit } from 'lucide-vue-next';
  
  const searchQuery = ref('');
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const showFilterDropdown = ref(false);
  const activeFilter = ref('All Orders');
  
  const filterOptions = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  const orders = [
    { id: 1001, customer: 'John Doe', date: '2023-05-01', total: 125.50, status: 'Delivered' },
    { id: 1002, customer: 'Jane Smith', date: '2023-05-02', total: 75.25, status: 'Processing' },
    { id: 1003, customer: 'Bob Johnson', date: '2023-05-03', total: 200.00, status: 'Pending' },
    { id: 1004, customer: 'Alice Brown', date: '2023-05-04', total: 150.75, status: 'Shipped' },
    { id: 1005, customer: 'Charlie Wilson', date: '2023-05-05', total: 95.50, status: 'Cancelled' },
    // Add more order data here...
  ];
  
  const filteredOrders = computed(() => {
    return orders.filter(order => 
      (order.id.toString().includes(searchQuery.value) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.date.includes(searchQuery.value)) &&
      (activeFilter.value === 'All Orders' || order.status === activeFilter.value)
    );
  });
  
  const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage));
  
  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.value.slice(start, end);
  });
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  
  const toggleFilterDropdown = () => {
    showFilterDropdown.value = !showFilterDropdown.value;
  };
  
  const setFilter = (filter) => {
    activeFilter.value = filter;
    showFilterDropdown.value = false;
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
    margin-bottom: 20px;
  }
  
  .search-container {
    flex: 1;
    max-width: 300px;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #f3f4f6;
    border-radius: 20px;
    padding: 8px 16px;
    width: 100%;
  }
  
  .search-icon {
    color: #9ca3af;
    margin-right: 8px;
  }
  
  .search-box input {
    border: none;
    outline: none;
    background-color: transparent;
    width: 100%;
    font-size: 0.9rem;
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
  
  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
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
  
  .page-btn {
    padding: 6px 12px;
    background-color: #f3f4f6;
    color: #4b5563;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .page-btn:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
  
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Dark mode styles */
  :global(.dark) .main-content {
    background-color: #111827;
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
  
  :global(.dark) .search-box,
  :global(.dark) .filter-btn,
  :global(.dark) .orders-table th,
  :global(.dark) .action-btn.edit-btn,
  :global(.dark) .page-btn {
    background-color: #374151;
  }
  
  :global(.dark) .search-box input,
  :global(.dark) .filter-btn,
  :global(.dark) .orders-table th,
  :global(.dark) .orders-table td {
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
  
  :global(.dark) .orders-table td {
    border-color: #4b5563;
  }
  
  :global(.dark) .action-btn.view-btn {
    background-color: #1e40af;
    color: #bfdbfe;
  }
  
  :global(.dark) .action-btn.view-btn:hover {
    background-color: #1e3a8a;
  }
  
  :global(.dark) .action-btn.edit-btn:hover,
  :global(.dark) .page-btn:hover:not(:disabled) {
    background-color: #4b5563;
  }
  </style>
  
  