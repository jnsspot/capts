<template>
  <div class="register-container">
    <h1 class="app-title">FarmXpress</h1>

    <div class="register-box">
      <h2 class="text-xl font-semibold text-gray-700">Seller Registration</h2>

      <form @submit.prevent="registerSeller">
        <!-- Step 1: Personal Information -->
        <div v-if="step === 1">
          <h3 class="section-title">Personal Information</h3>
          <div v-for="(label, key) in personalInfo" :key="key" class="input-container">
            <input type="text" v-model="seller[key]" :placeholder="label" required />
          </div>
        </div>

        <!-- Step 2: Farm/Business Details -->
        <div v-if="step === 2">
          <h3 class="section-title">Farm/Business Details</h3>
          <div v-for="(label, key) in farmDetails" :key="key" class="input-container">
            <input type="text" v-model="seller[key]" :placeholder="label" required />
          </div>
        </div>

        <!-- Step 3: Payment & Banking Information -->
        <div v-if="step === 3">
          <h3 class="section-title">Payment & Banking Information</h3>
          <div v-for="(label, key) in paymentInfo" :key="key" class="input-container">
            <input type="text" v-model="seller[key]" :placeholder="label" required />
          </div>
        </div>

        <!-- Step 4: Verification Documents -->
        <div v-if="step === 4">
          <h3 class="section-title">Verification Documents</h3>
          <div v-for="(label, key) in verificationDocs" :key="key" class="input-container">
            <input type="file" @change="handleFileUpload($event, key)" />
          </div>
        </div>

        <!-- Step 5: Delivery & Logistics -->
        <div v-if="step === 5">
          <h3 class="section-title">Delivery & Logistics</h3>
          <div v-for="(label, key) in deliveryInfo" :key="key" class="input-container">
            <input type="text" v-model="seller[key]" :placeholder="label" required />
          </div>
        </div>

        <!-- Step 6: Additional Details -->
        <div v-if="step === 6">
          <h3 class="section-title">Additional Details</h3>
          <div v-for="(label, key) in additionalDetails" :key="key" class="input-container">
            <input type="text" v-model="seller[key]" :placeholder="label" />
          </div>
        </div>

        <!-- Step 7: Terms & Agreement -->
        <div v-if="step === 7">
          <h3 class="section-title">Terms & Agreement</h3>
          <div class="checkbox-container">
            <label v-for="(label, key) in termsAgreement" :key="key">
              <input type="checkbox" v-model="seller[key]" required /> {{ label }}
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="button-group">
          <button v-if="step > 1" @click="step--" type="button" class="back-button">Back</button>
          <button v-if="step < 7" @click="step++" type="button" class="next-button">Next</button>
          <button v-if="step === 7" type="submit" class="submit-button">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  name: "SellerRegister",
  data() {
    return {
      step: 1,
      seller: {
        userId: "", // Will be set dynamically
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address: "",
        isAvail: false,
        isVerified: true,
        wholesaleAvailability: false,
        createdAt: new Date().toISOString(),
      },
      personalInfo: {
        firstName: "First Name",
        lastName: "Last Name",
        contact: "Contact Number",
        email: "Email",
        address: "Address",
      },
      farmDetails: {
        farmName: "Farm Name",
        farmAddress: "Farm Address",
        farmType: "Farm Type",
        products: "Products to Sell",
        yearInFarming: "Years in Farming",
      },
      paymentInfo: {
        paymentMethod: "Payment Method",
        accountName: "Account Name",
        accountNumber: "Account Number",
      },
      verificationDocs: {
        validID: "Valid ID",
        businessPermit: "Business Permit",
        farmCert: "Farm Certification",
      },
      deliveryInfo: {
        deliveryMethod: "Delivery Method",
        operatingHours: "Operating Hours",
        areasCovered: "Areas Covered",
      },
      additionalDetails: {
        socialMedia: "Social Media Links",
        wholesaleAvailability: "Wholesale Availability",
      },
      termsAgreement: {
        agreeTerms: "Agree to Terms & Conditions",
        consentData: "Consent to Data Privacy Policy",
      },
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("No authenticated user found");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.seller = {
            ...this.seller,
            userId: user.uid,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            contact: userData.contactNumber || "",
            address: userData.address || "",
          };
        } else {
          console.error("User document not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async registerSeller() {
      try {

        

        await addDoc(collection(db, "sellers"), this.seller);
        alert("Registration successful!");
        this.$router.push("/");
      } catch (error) {
        console.error("Error registering seller: ", error);
        alert("Registration failed. Please try again.");
      }
    },
    handleFileUpload(event, key) {
      const file = event.target.files[0];
      if (!file) return;

      const storage = getStorage();
      const storageRef = ref(storage, `sellers/${file.name}`);

      uploadBytes(storageRef, file)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((downloadURL) => {
          this.seller[key] = downloadURL;
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          alert("Failed to upload file. Please try again.");
        });
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f2f2f2;
  padding: 20px;
}

.app-title {
  color: #2e5c31;
  font-size: 36px;
  font-weight: bold;
  margin: 0;
  letter-spacing: 2px;
  padding-bottom: 20px;
}

.register-box {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-button {
  background: #0056b3;
  color: white;
}
</style>
