<template>
    <div class="add-category">
        <!-- Header -->
        <div class="header">
            <h1 class="app-title">FarmXpress</h1>
            <div class="icons">
                <i class="fas fa-comments"></i>
                <i class="fas fa-user-circle"></i>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <h2>Manage Your Categories</h2>
            <p>You currently have {{ categories.length }} categories. Organize your products better by adding new categories.</p>

            <div class="category-section">
                <span class="category-label">Categories: {{ categories.length }}</span>
            </div>

            <!-- Display Categories -->
            <div class="category-list">
                <div v-for="(category, index) in categories" :key="index" class="category-item">
                    <img v-if="category.image" :src="category.image" alt="Category Image" class="category-image" />
                    <p>{{ category.categoryName }}</p> <!-- Updated field name -->
                </div>
            </div>

            <button class="add-category-btn" @click="goToAddCategory">Add Category</button>
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
            <router-link to="">
                <i class="fas fa-home"></i>
            </router-link>
            <router-link to="">
                <i class="fas fa-plus-circle"></i>
            </router-link>
            <router-link to="/orders">
                <i class="fas fa-shopping-cart"></i>
            </router-link>
            <router-link to="/sales">
                <i class="fas fa-chart-line"></i>
            </router-link>
            <router-link to="/notifications">
                <i class="fas fa-bell"></i>
            </router-link>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export default {
    name: 'CategoryManagement',
    setup() {
        const categories = ref([]);

        // Fetch all categories from Firestore
        const fetchCategories = () => {
            const categoryCollection = collection(db, 'categories');

            // Listen for real-time updates
            onSnapshot(categoryCollection, (snapshot) => {
                categories.value = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            });
        };

        onMounted(() => {
            fetchCategories(); // Fetch categories when the component is mounted
        });

        const goToAddCategory = () => {
            window.location.href = "/add-category";
        };

        return { categories, goToAddCategory };
    }
};
</script>

<style scoped>
.add-category {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    background: #f2f2f2;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #2e5c31;
    color: white;
}

.icons i {
    font-size: 24px;
    margin-left: 15px;
}

.main-content {
    text-align: center;
    padding: 20px;
}

.category-section {
    margin: 20px 0;
    font-size: 18px;
    font-weight: bold;
}

.add-category-btn {
    background: #2e5c31;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.add-category-btn:hover {
    background: #256127;
}

.category-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.category-item {
    background: white;
    padding: 10px;
    border-radius: 5px;
    margin: 5px;
    text-align: center;
}

.category-image {
    width: 100px;
    height: 100px;
    border-radius: 5px;
}

.bottom-nav {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    background: white;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.bottom-nav a {
    text-decoration: none;
}

.bottom-nav i {
    font-size: 24px;
    color: #2e5c31;
}
</style>