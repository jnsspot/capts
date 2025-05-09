import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'; // Import the store

// Import all your components
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import ResetPassword from '../views/ResetPassword.vue';
import ChangePassword from '../views/ChangePassword.vue';
import HomeView from '../views/HomeView.vue';

// Admin components
import Category from '../views/adminFolder/Category.vue';
import AddCategory from '../views/adminFolder/AddCategory.vue';
import AdminSeller from '../views/adminFolder/AdminSeller.vue';
import AdminCustomer from '../views/adminFolder/AdminCustomer.vue';
import AdminRegister from '../views/adminFolder/AdminRegister.vue';
import AdminDashboard from '../views/adminFolder/AdminDashboard.vue';
import Dashboard from '../views/adminFolder/Dashboard.vue'; 
import Sellers from '../views/adminFolder/Sellers.vue';
import Customers from '../views/adminFolder/Customers.vue';
import Products from '../views/adminFolder/Products.vue';
import ProductCategories from '../views/adminFolder/ProductCategories.vue';
import SellerDetails from '../views/adminFolder/SellerDetails.vue';
// New Admin components from the other code
import AdminEditProfile from '../views/adminFolder/AdminEditProfile.vue';
import PriceMonitoring from '../views/adminFolder/PriceMonitoring.vue';

// Customer components
import Profile from '../views/customerFolder/Profile.vue';
import EditProfile from '../views/customerFolder/EditProfile.vue';
import CustomerDashboard from '../views/customerFolder/CustomerDashboard.vue';
import CustomerOrders from '../views/customerFolder/CustomerOrders.vue';
import ProductDetails from '../views/customerFolder/ProductDetails.vue';
import Cart from '../views/customerFolder/Cart.vue';
import Checkout from '@/views/customerFolder/Checkout.vue';
// New Customer components from the other code
import Messages from '../views/customerFolder/Messages.vue';

// Seller components
import ProductManagement from '../views/sellerFolder/ProductManagement.vue';
import SellerDashboard from '../views/sellerFolder/SellerDashboard.vue';
import ProductCategory from '../views/sellerFolder/ProductCategory.vue';
import RegisterSeller from '../views/sellerFolder/RegisterSeller.vue';
import AddEditProduct from '@/views/sellerFolder/AddEditProduct.vue';
import Chat from '@/views/sellerFolder/Chat.vue';
import Orders from '../views/sellerFolder/Orders.vue';
// New Seller components from the other code
import SellerHome from '@/views/sellerFolder/SellerHome.vue';
import SellerEditProfile from '@/views/sellerFolder/SellerEditProfile.vue';
import SellerChat from '@/views/sellerFolder/SellerChat.vue';
import Forecasting from '@/views/sellerFolder/Forecasting.vue';
import CropForecasting from '@/views/sellerFolder/CropForecasting.vue';
import CustomersTable from '@/views/sellerFolder/CustomersTable.vue';
import Analytics from '@/views/sellerFolder/Analytics.vue';
import HarvestCalendarPage from '@/views/sellerFolder/HarvestCalendarPage.vue';

const routes = [
  // Your existing routes (unchanged)
  {
    path: '/customer-order',
    name: 'CustomerOrders',
    component: CustomerOrders
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    props: (route) => ({
      orderData: {
        productId: route.query.productId,
        productName: route.query.productName,
        productImage: route.query.productImage,
        weight: parseFloat(route.query.weight),
        packagingType: route.query.packagingType,
        totalPrice: parseFloat(route.query.totalPrice),
        sellerId: route.query.sellerId
      }
    })
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/edit-product/:productId',
    name: 'EditProduct',
    component: AddEditProduct
  },
  {
    path: '/addproduct',
    name: 'AddProduct',
    component: AddEditProduct
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/admin/sellers',
    name: 'Sellers',
    component: Sellers
  },
  {
    path: '/admin/customers',
    name: 'Customers',
    component: Customers
  },
  {
    path: '/admin/categories',
    name: 'ProductCategories',
    component: ProductCategories
  },
  {
    path: '/admin/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/admin/sellers/:id',
    name: 'SellerDetails',
    component: SellerDetails
  },
  {
    path: '/product-details',
    name: 'ProductDetails',
    component: ProductDetails,
    meta: { requiresAuth: false },
  },
  {
    path: '/product/:productId', // Your dynamic route (unchanged)
    component: ProductDetails,
    props: true // Your props: true (unchanged)
  },
  
  {
    path: '/',
    name: 'homeview',
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/registration',
    name: 'registration',
    component: Register,
    meta: { requiresAuth: false },
  },
  {
    path: '/reset-password',
    name: 'resetpassword',
    component: ResetPassword,
    meta: { requiresAuth: false },
  },
  {
    path: '/change-password',
    name: 'changepassword',
    component: ChangePassword,
    meta: { requiresAuth: true },
  },
  {
    path: '/register-seller',
    name: 'registerseller',
    component: RegisterSeller,
    meta: { requiresAuth: false },
  },
  {
    path: '/admin-register',
    name: 'admin',
    component: AdminRegister,
    meta: { requiresAuth: false },
  },
  {
    path: '/admin-dashboard',
    name: 'admindashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin-customer',
    name: 'AdminCcustomer',
    component: AdminCustomer,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin-seller',
    name: 'AdminSeller',
    component: AdminSeller,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/seller-dashboard',
    name: 'seller-dashboard',
    component: SellerDashboard,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/harvest-calendar',
    name: 'HarvestCalendar',
    component: HarvestCalendarPage,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/customer-dashboard',
    name: 'CustomerDashboard',
    component: CustomerDashboard,
    meta: { requiresAuth: true, allowedRoles: ['customer'] },
  },
  {
    path: '/product-category',
    name: 'productcategory',
    component: ProductCategory,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/category',
    name: 'category',
    component: Category,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/add-category',
    name: 'addcategory',
    component: AddCategory,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/edit-profile',
    name: 'editprofile',
    component: EditProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'productmanagement',
    component: ProductManagement
  },
  {
    path: '/seller-home',
    name: 'sellerhome',
    component: SellerHome,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/seller/edit-profile',
    name: 'sellereditprofile',
    component: SellerEditProfile,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/admin/edit-profile',
    name: 'admineditprofile',
    component: AdminEditProfile,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/seller/forecasting',
    name: 'forecasting',
    component: Forecasting,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/admin/price-monitoring',
    name: 'pricemonitoring',
    component: PriceMonitoring,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/seller/chat',
    name: 'sellerchat',
    component: SellerChat,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/messages',
    name: 'messages',
    component: Messages,
    meta: { requiresAuth: true, allowedRoles: ['customer'] },
  },
  {
    path: '/seller/crop-forecast',
    name: 'cropforecasting',
    component: CropForecasting,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/seller/customer',
    name: 'customerstable',
    component: CustomersTable,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/seller/analytics',
    name: 'analytics',
    component: Analytics,
    meta: { requiresAuth: true, allowedRoles: ['seller'] },
  },
  {
    path: '/customer/orders',
    name: 'customerorders',
    component: CustomerOrders,
    meta: { requiresAuth: true, allowedRoles: ['customer'] },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard (unchanged)
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const allowedRoles = to.meta.allowedRoles;

  const user = store.state.user;
  const role = store.state.role;

  if (requiresAuth && !user) {
    next('/login');
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(role)) {
    next('/');
  } else {
    next();
  }
});

export default router;