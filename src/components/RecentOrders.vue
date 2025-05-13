<template>
    <div class="orders-container">
      <div class="orders-header">
        <h3>Recent Orders</h3>
        <div class="status-filter">
          <span>Status:</span>
          <button class="status-btn">
            All Status
            <ChevronDown size="16" />
          </button>
        </div>
      </div>
      
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Product</th>
            <th>Invoice</th>
            <th>Price</th>
            <th>Sold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td>
              <div class="order-date">
                <div>{{ order.date }}</div>
                <div class="order-time">{{ order.time }}</div>
              </div>
            </td>
            <td>
              <div class="product-cell">
                <div class="product-icon" :class="order.category.toLowerCase()">
                  <img :src="getProductIcon(order.category)" alt="Product icon" />
                </div>
                <div class="product-info">
                  <div>{{ order.productName }}</div>
                  <div class="product-category">{{ order.category }}</div>
                </div>
              </div>
            </td>
            <td>{{ order.invoice }}</td>
            <td>${{ order.price }}</td>
            <td>{{ order.sold }}</td>
            <td>
              <div class="status-badge" :class="order.status.toLowerCase().replace(' ', '-')">
                <span v-if="order.status === 'New Order'" class="status-dot new"></span>
                <span v-else-if="order.status === 'Cancelled'" class="status-dot cancelled"></span>
                <span v-else-if="order.status === 'On Deliver'" class="status-dot on-deliver"></span>
                {{ order.status }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <div class="pagination-info">{{ paginationInfo }}</div>
        <div class="pagination-controls">
          <button 
            v-for="page in visiblePages" 
            :key="page" 
            class="page-btn" 
            :class="{ active: currentPage === page }"
            @click="setPage(page)">
            {{ page }}
          </button>
          <span v-if="showEllipsis" class="ellipsis">...</span>
          <button 
            v-for="page in lastPages" 
            :key="`last-${page}`" 
            class="page-btn"
            @click="setPage(page)">
            {{ page }}
          </button>
          <button class="next-btn" @click="nextPage">
            <ChevronRight size="16" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, defineProps } from 'vue';
  import { ChevronDown, ChevronRight } from 'lucide-vue-next';
  
  const props = defineProps({
    orders: {
      type: Array,
      default: () => [
        {
          date: 'Sep, 05 2023',
          time: '14:23 AM',
          productName: 'Savior Koil Part 2',
          category: 'Shoes',
          invoice: 'INV-0293',
          price: '122.00',
          sold: '1100',
          status: 'New Order'
        },
        {
          date: 'Sep, 05 2023',
          time: '10:07 AM',
          productName: 'Estruct Destructhrone',
          category: 'T-Shirt',
          invoice: 'INV-0293',
          price: '120.00',
          sold: '728',
          status: 'Cancelled'
        },
        {
          date: 'Sep, 05 2023',
          time: '08:23 AM',
          productName: 'Superstar Shoes',
          category: 'Shoes',
          invoice: 'INV-0293',
          price: '135.00',
          sold: '1054',
          status: 'On Deliver'
        }
      ]
    },
    totalOrders: {
      type: Number,
      default: 1025
    }
  });
  
  const currentPage = ref(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(props.totalOrders / itemsPerPage);
  
  // Pagination
  const visiblePages = computed(() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3];
  });
  
  const lastPages = computed(() => {
    if (totalPages <= 3) return [];
    return [totalPages - 1, totalPages];
  });
  
  const showEllipsis = computed(() => {
    return totalPages > 3;
  });
  
  const paginationInfo = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, props.totalOrders);
    return `${start} - ${end} of ${props.totalOrders}`;
  });
  
  const setPage = (page) => {
    currentPage.value = page;
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages) {
      currentPage.value++;
    }
  };
  
  // Get product icon
  const getProductIcon = (category) => {
    const icons = {
      'Shoes': 'https://cdn-icons-png.flaticon.com/512/2589/2589903.png',
      'T-Shirt': 'https://cdn-icons-png.flaticon.com/512/2503/2503380.png'
    };
    
    return icons[category] || 'https://cdn-icons-png.flaticon.com/512/1250/1250680.png';
  };
  </script>
  
  <style scoped>
  .orders-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .orders-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .orders-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
  
  .status-filter {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .status-filter span {
    font-size: 0.9rem;
    color: #6b7280;
  }
  
  .status-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #111827;
    cursor: pointer;
  }
  
  .orders-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .orders-table th {
    text-align: left;
    padding: 12px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }
  
  .orders-table tr:hover td {
    background-color: #f3f4f6;
  }
  
  .orders-table td {
    padding: 16px;
    font-size: 0.9rem;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .order-date {
    font-weight: 500;
  }
  
  .order-time {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .product-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .product-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
  }
  
  .product-icon img {
    width: 24px;
    height: 24px;
  }
  
  .product-icon.shoes {
    background-color: #e6f4e8;
  }
  
  .product-icon.t-shirt {
    background-color: #d1e7d3;
  }
  
  .product-info {
    font-weight: 500;
  }
  
  .product-category {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .status-badge.new-order {
    background-color: #e6f4e8;
    color: #2e5c31;
  }
  
  .status-badge.cancelled {
    background-color: #fef2f2;
    color: #dc2626;
  }
  
  .status-badge.on-deliver {
    background-color: #fff7ed;
    color: #ea580c;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }
  
  .status-dot.new {
    background-color: #2e5c31;
  }
  
  .status-dot.cancelled {
    background-color: #dc2626;
  }
  
  .status-dot.on-deliver {
    background-color: #ea580c;
  }
  
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  
  .pagination-info {
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .page-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: #fff;
    font-size: 0.85rem;
    color: #6b7280;
    cursor: pointer;
  }
  
  .page-btn.active {
    background-color: #2e5c31;
    color: #fff;
    border-color: #2e5c31;
  }
  
  .ellipsis {
    padding: 0 5px;
    color: #6b7280;
  }
  
  .next-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: #fff;
    color: #6b7280;
    cursor: pointer;
  }
  
  /* Dark mode styles */
  :global(.dark) .orders-container {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  :global(.dark) .orders-header h3 {
    color: #f9fafb;
  }
  
  :global(.dark) .status-filter span,
  :global(.dark) .pagination-info {
    color: #9ca3af;
  }
  
  :global(.dark) .status-btn,
  :global(.dark) .page-btn,
  :global(.dark) .next-btn {
    background-color: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  :global(.dark) .orders-table th,
  :global(.dark) .orders-table td {
    border-color: #374151;
  }
  
  :global(.dark) .orders-table th {
    background-color: #111827;
    color: #9ca3af;
  }
  
  :global(.dark) .orders-table td {
    color: #f9fafb;
  }
  
  :global(.dark) .order-time,
  :global(.dark) .product-category {
    color: #9ca3af;
  }
  
  :global(.dark) .product-icon {
    background-color: #374151;
  }
  </style>
  
  