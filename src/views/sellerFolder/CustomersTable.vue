<template>
    <div class="dashboard-container">
      <Sidebar />
      
      <div class="main-content">
        <header class="header">
          <div class="page-title">
            <h1>Customers</h1>
            <p>Manage your customer information</p>
          </div>
        </header>
  
        <div class="content-wrapper">
          <div class="actions-bar">
            <div class="search-container">
              <div class="search-box">
                <i class="i-lucide-search search-icon"></i>
                <input type="text" placeholder="Search customers..." />
              </div>
            </div>
            <button class="add-btn">
              <i class="i-lucide-user-plus"></i>
              Add Customer
            </button>
          </div>
  
          <table class="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in customers" :key="customer.id">
                <td>
                  <div class="customer-cell">
                    <div class="customer-avatar">
                      {{ getInitials(customer.name) }}
                    </div>
                    <div class="customer-info">
                      <div class="customer-name">{{ customer.name }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="contact-cell">
                    <div>{{ customer.email }}</div>
                    <div>{{ customer.phone }}</div>
                  </div>
                </td>
                <td>{{ customer.location }}</td>
                <td>{{ customer.orders }}</td>
                <td>₱{{ customer.totalSpent.toFixed(2) }}</td>
                <td>
                  <span :class="['status-badge', customer.status.toLowerCase()]">
                    {{ customer.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '@/components/Sidebar.vue';
  
  // Sample customer data
  const customers = [
    {
      id: 1,
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@example.com',
      phone: '+63 912 345 6789',
      location: 'Quezon City',
      orders: 12,
      totalSpent: 8750.50,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@example.com',
      phone: '+63 917 876 5432',
      location: 'Makati',
      orders: 8,
      totalSpent: 5200.75,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Pedro Reyes',
      email: 'pedro.reyes@example.com',
      phone: '+63 918 765 4321',
      location: 'Pasig',
      orders: 5,
      totalSpent: 3150.25,
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Ana Gonzales',
      email: 'ana.gonzales@example.com',
      phone: '+63 919 234 5678',
      location: 'Caloocan',
      orders: 2,
      totalSpent: 950.50,
      status: 'New'
    }
  ];
  
  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
    margin-left: 250px; /* Match sidebar width */
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  .page-title h1 {
    font-size: 1.5rem;
    font-weight: 700;
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
    padding: 20px;
  }
  
  .actions-bar {
    display: flex;
    justify-content: space-between;
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
  }
  
  .search-icon {
    color: #9ca3af;
    margin-right: 8px;
  }
  
  .search-box input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
  }
  
  .add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #2e5c31;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  
  .customers-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .customers-table th {
    text-align: left;
    padding: 12px;
    font-weight: 600;
    background-color: #f9fafb;
  }
  
  .customers-table td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .customer-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .customer-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #2e5c31;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  
  .customer-name {
    font-weight: 500;
  }
  
  .contact-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.9rem;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-badge.active {
    background-color: #d1fae5;
    color: #059669;
  }
  
  .status-badge.inactive {
    background-color: #f3f4f6;
    color: #6b7280;
  }
  
  .status-badge.new {
    background-color: #e0f2fe;
    color: #0284c7;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      padding-top: 60px;
    }
    
    .actions-bar {
      flex-direction: column;
      gap: 10px;
    }
    
    .search-container {
      max-width: 100%;
    }
  }
  </style>