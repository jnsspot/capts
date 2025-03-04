<template>
    <div class="add-category-container">
        <div class="add-category-form">
            <h2>Add New Category</h2>
            <p>Fill in the details below to create a new category.</p>

            <div class="form-group">
                <label for="category-name">Category Name:</label>
                <input type="text" id="category-name" v-model="categoryName" placeholder="Enter category name" required>
            </div>

            <div class="form-group">
                <label for="category-image">Category Image:</label>
                <input type="file" id="category-image" @change="handleImageUpload">
            </div>

            <!-- Save & Cancel Buttons -->
            <div class="button-group">
                <button class="primary-btn" @click="submitCategory">Save</button>
                <button class="secondary-btn" @click="cancel">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default {
    setup() {
        const categoryName = ref('');
        const categoryImage = ref(null);
        const router = useRouter();

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    categoryImage.value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        const submitCategory = async () => {
            if (!categoryName.value) {
                alert('Please enter a category name.');
                return;
            }

            try {
                await addDoc(collection(db, 'categories'), {
                    categoryName: categoryName.value,
                    image: categoryImage.value || '',
                });

                alert('Category added successfully!');
                categoryName.value = '';
                categoryImage.value = null;
                router.push('/category');
            } catch (error) {
                console.error('Error adding category:', error);
                alert('Failed to add category.');
            }
        };

        const cancel = () => {
            router.push('/category');
        };

        return { categoryName, categoryImage, handleImageUpload, submitCategory, cancel };
    }
};
</script>


<style scoped>
/* Container Styles */
.add-category-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f4f4f4;
    min-height: 100vh;
}

/* Form Styles */
.add-category-form {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
}

/* Input Fields */
.form-group {
    margin-bottom: 20px;
    text-align: left;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

/* Save & Cancel Buttons */
.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.primary-btn, .secondary-btn {
    flex: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
}

.primary-btn {
    background: #2e5c31;
    color: white;
}

.primary-btn:hover {
    background: #256127;
}

.secondary-btn {
    background: #888;
    color: white;
}

.secondary-btn:hover {
    background: #666;
}

/* Additional Options Section */
.additional-options {
    margin-top: 20px;
    display: flex;
    gap: 15px;
}

.site-btn, .product-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
}

.site-btn {
    background: #1e90ff;
    color: white;
}

.site-btn:hover {
    background: #0c6cd0;
}

.product-btn {
    background: #ff8c00;
    color: white;
}

.product-btn:hover {
    background: #d37500;
}

/* Responsive Design */
@media (max-width: 450px) {
    .add-category-form {
        width: 90%;
    }
    .button-group {
        flex-direction: column;
        gap: 10px;
    }
    .additional-options {
        flex-direction: column;
        gap: 10px;
    }
}
</style>
