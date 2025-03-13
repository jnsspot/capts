<template>
  <div class="add-product">
    <div class="header">
      <i class="fas fa-arrow-left" @click="cancel"></i>
      <h1>Add Product</h1>
    </div>

    <div class="form-container">
      <div class="section">
        <h2>Product Info</h2>
        <input type="text" placeholder="Product Name" v-model="product.productName" />
        <input type="file" @change="uploadImage" />
        <textarea placeholder="Description" v-model="product.description"></textarea>
        <input type="text" placeholder="Ribbon (e.g., Best Seller)" v-model="product.ribbon" />
      </div>
  
      <div class="section">
        <h2>Category</h2>
        <select v-model="product.category">
          <option value="All Products">All Products</option>
          <option v-for="(category, index) in categories" :key="index" :value="category.categoryName">
            {{ category.categoryName }}
          </option>
        </select>
        <div class="checkbox-container">
          <input type="checkbox" id="showOnline" v-model="product.showOnline" />
          <label for="showOnline">Show in online store</label>
        </div>
      </div>
  
      <div class="section">
        <h2>Price Info</h2>
        <input type="number" placeholder="Price" v-model="product.price" />
        <div class="toggle-button">
          <span>On Sale:</span>
          <button @click="toggleSale" :class="{ active: product.onSale }">{{ product.onSale ? 'ON' : 'OFF' }}</button>
        </div>
        <input type="number" placeholder="Cost" v-model="product.cost" />
        <input type="number" placeholder="Profit" v-model="product.profit" />
      </div>
  
      <div class="section">
        <h2>Inventory & Shipping</h2>
        <input type="number" placeholder="Stock" v-model="product.stock" />
        <input type="text" placeholder="Code" v-model="product.code" />
        <input type="number" placeholder="Shipping Weight (kg)" v-model="product.weight" />
      </div>
  
      <div class="section">
        <h2>Pre-order</h2>
        <div class="toggle-button">
          <span>Enable Pre-order:</span>
          <button @click="togglePreorder" :class="{ active: product.preorder }">{{ product.preorder ? 'ON' : 'OFF' }}</button>
        </div>
        <div v-if="product.preorder">
          <input type="text" placeholder="Pre-order Message" v-model="product.preorderMessage" />
          <input type="number" placeholder="Pre-order Limit" v-model="product.preorderLimit" />
        </div>
      </div>
    </div>
  
    <div class="buttons">
      <button class="cancel" @click="cancel">Cancel</button>
      <button class="save" @click="saveProduct">Save</button>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db, auth } from "@/firebase/firebaseConfig"; // Import Firebase Storage
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export default {
  setup() {
    const router = useRouter();
    const categories = ref([]);
    const product = ref({
      productName: "",
      description: "",
      ribbon: "",
      category: "All Products",
      price: null,
      cost: null,
      profit: null,
      stock: null,
      code: "",
      weight: null,
      image: "",
      showOnline: false,
      onSale: false,
      preorder: false,
      preorderLimit: null,
      preorderMessage: "",
      userId: "", // Add userId field
      productId: "", // Add productId field
      imageUrl: "", // Add imageUrl field
    });

    const auth = getAuth(); // Initialize Firebase Auth

    const uploadImage = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          product.value.image = e.target.result; // Base64 image for preview
        };
        reader.readAsDataURL(file);
      }
    };

    const toggleSale = () => {
      product.value.onSale = !product.value.onSale;
    };

    const togglePreorder = () => {
      product.value.preorder = !product.value.preorder;
    };

    const saveProduct = async () => {
      if (!product.value.productName || !product.value.price) {
        alert("Product Name and Price are required.");
        return;
      }

      const user = auth.currentUser; // Get the currently logged-in user
      if (!user) {
        alert("You must be logged in to add a product.");
        return;
      }

      try {
        // Generate a unique productId
        const productId = uuidv4();
        product.value.productId = productId;

        // Upload the image to Firebase Storage
        if (product.value.image) {
          const file = await fetch(product.value.image)
            .then((res) => res.blob())
            .then((blob) => new File([blob], `${productId}.jpg`, { type: 'image/jpeg' }));

          const imageRef = storageRef(storage, `sellersproducts/${productId}.jpg`);
          await uploadBytes(imageRef, file);

          // Get the download URL of the uploaded image
          const imageUrl = await getDownloadURL(imageRef);
          product.value.imageUrl = imageUrl; // Save the image URL
        }

        // Add the product data to Firestore
        await addDoc(collection(db, "products"), {
          ...product.value, // Spread all product fields
          productId: productId, // Explicitly include the productId
          userId: user.uid, // Include the userId
          imageUrl: product.value.imageUrl, // Save the image URL
        });

        alert("Product added successfully!");
        router.push("/product");
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product.");
      }
    };

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        categories.value = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    onMounted(fetchCategories);

    const cancel = () => {
      router.push("/product");
    };

    return { categories, product, uploadImage, toggleSale, togglePreorder, saveProduct, cancel };
  },
};
</script>


<style scoped>
.add-product {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2e5c31;
  color: white;
  padding: 15px;
  border-radius: 10px 10px 0 0;
}

.header i {
  font-size: 20px;
  cursor: pointer;
}

.form-container {
  display: flex;
flex-direction: column;
gap: 15px;
padding: 10px;
max-width: 100%;
box-sizing: border-box;
}

.section {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2e5c31;
  margin-bottom: 10px;
}

input, textarea, select {
  width: calc(100% - 20px); 
max-width: 100%; 
padding: 10px;
margin-top: 5px;
border: 1px solid #ccc;
border-radius: 5px;
font-size: 16px;
box-sizing: border-box; 
}

.toggle-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eee;
  padding: 10px;
  border-radius: 5px;
}

.toggle-button button {
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.toggle-button .active {
  background: #2e5c31;
  color: white;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

button {
  width: 48%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.cancel {
  background: #ccc;
}

.save {
  background: #2e5c31;
  color: white;
}

@media (max-width: 480px) {
  .add-product {
    width: 90%;
    padding: 15px;
  }
  .buttons {
    flex-direction: column;
  }
  button {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
