<template>
  <div class="login-container">
    <div class="logo-container">
      <img src="@/assets/logo.png" alt="FarmXpress Logo" class="logo" />
      <h1 class="app-title">FarmXpress</h1>
      <h3 class="app-subtitle">MOBILE APP</h3>
    </div>

    <!-- Alert Box -->
    <div v-if="alertMessage" :class="['alert-box', alertType]">
      {{ alertMessage }}
    </div>

    <div class="login-box">
      <div class="input-container">
        <i class="fas fa-user icon"></i>
        <input type="email" v-model="email" placeholder="Email" />
      </div>
      <div class="input-container">
        <i class="fas fa-lock icon"></i>
        <input type="password" v-model="password" placeholder="Password" />
      </div>

      <div class="options">
        <label>
          <input type="checkbox" v-model="rememberMe" /> Remember Me
        </label>
        <a @click="forgotPassword" href="#">Forgot Password?</a>
      </div>

      <button class="login-button" @click="login">Login</button>

      <p>Don't have an account? <a href="/registration">Create an account</a></p>
    </div>
  </div>
</template>

<script>
import { auth, db } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      alertMessage: '',
      alertType: '',
    };
  },
  methods: {
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          this.showAlert('Please verify your email before logging in.', 'warning');
          return;
        }

        let userData = null;

        // Check if user is an admin
        const adminQuery = query(collection(db, 'admins'), where('email', '==', this.email), where('role', '==', 'admin'));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          userData = adminSnapshot.docs[0].data();
        } else {
          // Check if user is a customer or seller in the 'users' collection
          const userQuery = query(collection(db, 'users'), where('email', '==', this.email));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            userData = userSnapshot.docs[0].data();
          }
        }

        if (!userData) {
          this.showAlert('Invalid credentials or unauthorized access.', 'error');
          return;
        }

        if (!userData.isVerified) {
          this.showAlert('Your account is not verified. Please contact support.', 'warning');
          return;
        }

        // Only store minimal auth state, not user data
        if (this.rememberMe) {
          localStorage.setItem("authPersist", "true");
        } else {
          sessionStorage.setItem("authPersist", "true");
        }

        // Redirect based on role
        if (userData.role === 'admin') {
          this.$router.push('/admin');
        } else if (userData.role === 'customer') {
          this.$router.push('/');
        } else if (userData.role === 'seller') {
          this.$router.push('/seller-dashboard');
        } else {
          this.showAlert('Invalid role assigned to user.', 'error');
        }

        this.showAlert('Login Successful!', 'success');
      } catch (error) {
        console.error('Login Error:', error);
        this.showAlert('Login failed! Check your credentials.', 'error');
      }
    },

    // Removed saveUserData method as we're not storing user data anymore

    async checkStoredSession() {
      // Check if user is already authenticated via Firebase Auth
      const user = auth.currentUser;
      if (user) {
        // User is authenticated, fetch fresh data from server
        try {
          const userData = await this.fetchUserData(user.email);
          if (userData) {
            // Redirect based on role
            if (userData.role === 'admin') {
              this.$router.push('/admin');
            } else if (userData.role === 'customer') {
              this.$router.push('/');
            } else if (userData.role === 'seller') {
              this.$router.push('/seller-dashboard');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    },

    async fetchUserData(email) {
      try {
        // Check admin collection first
        const adminQuery = query(collection(db, 'admins'), where('email', '==', email));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          return adminSnapshot.docs[0].data();
        }

        // Check users collection
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          return userSnapshot.docs[0].data();
        }

        return null;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    },

    async logout() {
      try {
        await auth.signOut();
        localStorage.removeItem("authPersist");
        sessionStorage.removeItem("authPersist");
        this.$router.push("/login");
      } catch (error) {
        console.error('Logout error:', error);
      }
    },

    forgotPassword() {
      this.$router.push('/reset-password');
    },

    showAlert(message, type) {
      this.alertMessage = message;
      this.alertType = type;
      setTimeout(() => {
        this.alertMessage = '';
      }, 3000);
    },
  },
  mounted() {
    this.checkStoredSession();
  }
};
</script>




<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f2f2f2;
  padding: 20px;
}

.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 300px;
  margin-bottom: 2px;
}

.app-title {
  color: #2e5c31;
  font-size: 36px;
  font-weight: bold;
  margin: 0;
  letter-spacing: 2px;
}

.app-subtitle {
  color: #2e5c31;
  font-size: 18px;
  margin: 0;
  letter-spacing: 3px;
}

/* Alert Box */
.alert-box {
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  width: 90%;
  max-width: 350px;
}

.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.login-box {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-container {
  display: flex;
  align-items: center;
  background: #eaeaea;
  border-radius: 50px;
  padding: 12px;
  margin-bottom: 15px;
}

.icon {
  margin-right: 10px;
  color: #999;
  font-size: 18px;
}

input[type="email"],
input[type="password"] {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #333;
}

.options {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 15px;
}

.options a {
  color: #0056b3;
  text-decoration: none;
}

.login-button {
  background: #2e5c31;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover {
  background: #26492a;
}

p {
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
}

p a {
  color: #0056b3;
  text-decoration: none;
}
</style>
