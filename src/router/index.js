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



// Customer components
import Profile from '../views/customerFolder/Profile.vue';
import EditProfile from '../views/customerFolder/EditProfile.vue';
import CustomerDashboard from '../views/customerFolder/CustomerDashboard.vue';
import ProductDetails from '../views/customerFolder/ProductDetails.vue';

// Seller components
import ProductManagement from '../views/sellerFolder/ProductManagement.vue';
import Product from '../views/sellerFolder/Product.vue';
import AddProduct from '../views/sellerFolder/AddProduct.vue';
import SellerDashboard from '../views/sellerFolder/SellerDashboard.vue';
import ProductCategory from '../views/sellerFolder/ProductCategory.vue';
import SellerRegister from '../views/sellerFolder/SellerRegister.vue';
import AddEditProduct from '@/views/sellerFolder/AddEditProduct.vue';
import Chat from '@/views/sellerFolder/Chat.vue';
import Orders from '../views/sellerFolder/Orders.vue';
import SellerHome from '@/views/sellerFolder/SellerHome.vue';

const routes = [
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
    meta: { requiresAuth: false }, // Public route
  },
  {
    path: '/product/:productId', // Use a dynamic route parameter
    component: ProductDetails,
    props: true // Pass route params as props
  },

  {
    path: '/',
    name: 'homeview',
    component: HomeView,
    meta: { requiresAuth: false }, // Public route
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }, // Public route
  },
  {
    path: '/registration',
    name: 'registration',
    component: Register,
    meta: { requiresAuth: false }, // Public route
  },
  {
    path: '/reset-password',
    name: 'resetpassword',
    component: ResetPassword,
    meta: { requiresAuth: false }, // Public route
  },
  {
    path: '/change-password',
    name: 'changepassword',
    component: ChangePassword,
    meta: { requiresAuth: true }, // Requires authentication
  },
  {
    path: '/register-seller',
    name: 'sellerregister',
    component: SellerRegister,
    meta: { requiresAuth: false }, // Public route
  },
  {
    path: '/admin-register',
    name: 'admin',
    component: AdminRegister,
    meta: { requiresAuth: false }, // Public route
  },
  {
    path: '/admin-dashboard',
    name: 'admindashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, allowedRoles: ['admin'] }, // Only admins can access
  },
  {
    path: '/admin-customer',
    name: 'AdminCcustomer',
    component: AdminCustomer,
    meta: { requiresAuth: true, allowedRoles: ['admin'] }, // Only admins can access
  },
  {
    path: '/admin-seller',
    name: 'AdminSeller',
    component: AdminSeller,
    meta: { requiresAuth: true, allowedRoles: ['admin'] }, // Only admins can access
  },
  {
    path: '/seller-dashboard',
    name: 'seller-dashboard',
    component: SellerDashboard,
    meta: { requiresAuth: true, allowedRoles: ['seller'] }, // Only sellers can access
  },
  {
    path: '/customer-dashboard',
    name: 'CustomerDashboard',
    component: CustomerDashboard,
    meta: { requiresAuth: true, allowedRoles: ['customer'] }, // Only customers can access
  },
  {
    path: '/product',
    name: 'product',
    component: Product,
    meta: { requiresAuth: true, allowedRoles: ['seller'] }, // Only sellers can access
  },
  {
    path: '/add-product',
    name: 'addproduct',
    component: AddProduct,
    meta: { requiresAuth: true, allowedRoles: ['seller'] }, // Only sellers can access
  },
  {
    path: '/product-category',
    name: 'productcategory',
    component: ProductCategory,
    meta: { requiresAuth: true, allowedRoles: ['seller'] }, // Only sellers can access
  },
  {
    path: '/category',
    name: 'category',
    component: Category,
    meta: { requiresAuth: true, allowedRoles: ['admin'] }, // Only admins can access
  },
  {
    path: '/add-category',
    name: 'addcategory',
    component: AddCategory,
    meta: { requiresAuth: true, allowedRoles: ['admin'] }, // Only admins can access
  },
  {
    path: '/seller-home',
    name: 'sellerhome',
    component: SellerHome,
    meta: { requiresAuth: true, allowedRoles: ['seller'] }, // Only sellers can access
  },
  {
    path: '/edit-profile',
    name: 'editprofile',
    component: EditProfile,
    meta: { requiresAuth: true }, // Requires authentication
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }, // Requires authentication
  },
  {
    path: '/products',
    name: 'productmanagement',
    component: ProductManagement
  },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard to check authentication and roles
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const allowedRoles = to.meta.allowedRoles;

  const user = store.state.user;
  const role = store.state.role;

  if (requiresAuth && !user) {
    // Redirect to login if the route requires authentication and the user is not logged in
    next('/login');
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to home or a "not authorized" page if the user's role is not allowed
    next('/');
  } else {
    // Proceed to the route
    next();
  }
});

export default router;