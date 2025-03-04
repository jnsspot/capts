// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import ResetPassword from '../views/ResetPassword.vue';
import ChangePassword from '../views/ChangePassword.vue';
import HomeView from '../views/HomeView.vue';


// admin folder
import Category from '../views/adminFolder/Category.vue';
import AddCategory from '../views/adminFolder/AddCategory.vue';
import AdminSeller from '../views/adminFolder/AdminSeller.vue';
import AdminCustomer from '../views/adminFolder/AdminCustomer.vue';
import AdminRegister from '../views/adminFolder/AdminRegister.vue';
import AdminDashboard from '../views/adminFolder/AdminDashboard.vue';
import Sellers from '../views/adminFolder/Sellers.vue';
import Customers from '../views/adminFolder/Customers.vue';
import Dashboard from '../views/adminFolder/Dashboard.vue';
import Products from '../views/adminFolder/Products.vue';
import ProductCategories from '../views/adminFolder/ProductCategories.vue';
import SellerDetails from '../views/adminFolder/SellerDetails.vue';


// customer folder
import Profile from '../views/customerFolder/Profile.vue';
import EditProfile from '../views/customerFolder/EditProfile.vue';
import CustomerDashboard from '../views/customerFolder/CustomerDashboard.vue';



// seller improt
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
    path: '/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/addproduct',
    name: 'AddProduct',
    component: AddEditProduct
  },
  {
    path: '/registration',
    name: 'registration',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reset-password',
    name: 'resetpassword',
    component: ResetPassword
  },
  {
    path: '/change-password',
    name: 'changepassword',
    component: ChangePassword
  },
  {
    path: '/',
    name: 'homeview',
    component: HomeView
  },
  {
    path: '/register-seller',
    name: 'sellerregister',
    component: SellerRegister
  },
  {
    path: '/admin-register',
    name: 'admin',
    component: AdminRegister
  },
  {
    path: '/admin-dashboard',
    name: 'admindashboard',
    component: AdminDashboard
  },
  {
    path: '/admin-customer',
    name: 'AdminCcustomer',
    component: AdminCustomer
  },
  {
    path: '/seller-dashboard',
    name: 'seller-dashboard',
    component: SellerDashboard
  },
  {
    path: '/customer-dashboard',
    name: 'CustomerDashboard',
    component: CustomerDashboard
  },
  {
    path: '/admin-seller',
    name: 'AdminSeller',
    component: AdminSeller
  },
  {
    path: '/product',
    name: 'product',
    component: Product
  },
  {
    path: '/add-product',
    name: 'addproduct',
    component: AddProduct
  },
  {
    path: '/product-category',
    name: 'productcategory',
    component: ProductCategory
  },
  {
    path: '/category',
    name: 'category',
    component: Category
  },
  {
    path: '/add-category',
    name: 'addcategory',
    component: AddCategory
  },
  {
    path: '/seller-home',
    name: 'sellerhome',
    component: SellerHome
  },
  {
    path: '/edit-profile',
    name: 'editprofile',
    component: EditProfile
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/products',
    name: 'productmanagement',
    component: ProductManagement
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
 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
