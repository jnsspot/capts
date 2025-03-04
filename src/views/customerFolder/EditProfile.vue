<template>
    <div class="profile-container">
      <h2>My Profile</h2>
  
      <!-- Alert Box -->
      <div v-if="alertMessage" :class="['alert-box', alertType]">
        {{ alertMessage }}
      </div>
  
      <div class="profile-box">
        <input type="text" v-model="firstName" placeholder="First Name" />
        <input type="text" v-model="lastName" placeholder="Last Name" />
        <input type="text" v-model="username" placeholder="Username" />
        <input type="email" v-model="email" placeholder="Email" disabled />
        <input type="text" v-model="contactNumber" placeholder="Contact Number" />
        <input type="text" v-model="address" placeholder="Address" />
  
        <button class="update-button" @click="updateProfile">Update Profile</button>
  
        <h3>Change Password</h3>
        <input type="password" v-model="currentPassword" placeholder="Current Password" />
        <input type="password" v-model="newPassword" placeholder="New Password" />
        <input type="password" v-model="confirmNewPassword" placeholder="Confirm New Password" />
  
        <button class="update-button" @click="changePassword">Change Password</button>
      </div>
    </div>
  </template>
  
  <script>
  import { auth, db } from "../../firebase/firebaseConfig";
  import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  
  export default {
    data() {
      return {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNumber: "",
        address: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        alertMessage: "",
        alertType: "",
      };
    },
    async mounted() {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const userData = userSnap.data();
            this.firstName = userData.firstName;
            this.lastName = userData.lastName;
            this.username = userData.username;
            this.email = userData.email;
            this.contactNumber = userData.contactNumber;
            this.address = userData.address;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    },
    methods: {
      showAlert(message, type) {
        this.alertMessage = message;
        this.alertType = type;
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      },
      async updateProfile() {
        const user = auth.currentUser;
        if (!user) return;
  
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            contactNumber: this.contactNumber,
            address: this.address,
          });
  
          this.showAlert("Profile updated successfully!", "success");
        } catch (error) {
          console.error("Error updating profile:", error);
          this.showAlert("Failed to update profile.", "error");
        }
      },
      async changePassword() {
        const user = auth.currentUser;
        if (!user) return;
  
        if (this.newPassword !== this.confirmNewPassword) {
          this.showAlert("New passwords do not match!", "error");
          return;
        }
  
        try {
          // Re-authenticate user
          const credential = EmailAuthProvider.credential(user.email, this.currentPassword);
          await reauthenticateWithCredential(user, credential);
  
          // Update password
          await updatePassword(user, this.newPassword);
          this.showAlert("Password changed successfully!", "success");
  
          // Clear fields after successful update
          this.currentPassword = "";
          this.newPassword = "";
          this.confirmNewPassword = "";
        } catch (error) {
          console.error("Error changing password:", error);
          this.showAlert("Failed to change password. Check your current password.", "error");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f4f4f9;
    padding: 20px;
  }
  
  h2 {
    color: #333;
    font-size: 24px;
  }
  
  .alert-box {
    width: 100%;
    max-width: 380px;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .profile-box {
    background: white;
    border-radius: 20px;
    padding: 20px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
  }
  
  input[type="email"],
  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 10px 15px;
    margin: 8px 0;
    border-radius: 25px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 14px;
    box-sizing: border-box;
  }
  
  .update-button {
    background: #2e5c31;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 10px;
    width: 100%;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 10px;
  }
  
  .update-button:hover {
    background: #26492a;
  }
  </style>
  