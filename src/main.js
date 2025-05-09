import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker'; // Service worker setup
import router from './router';
import store from './store'; // Import the store
import { auth, db } from './firebase/firebaseConfig'; // Import auth and db
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { onAuthStateChanged } from 'firebase/auth'; // Import auth functions
import '@fortawesome/fontawesome-free/css/all.min.css';
import { setupSecurityHeaders } from './utils/securityHeaders';
import { setupErrorHandling } from './utils/errorHandling';
import { setupRequestLogging } from './utils/requestLogging';

// Initialize security features
setupSecurityHeaders();
setupErrorHandling();
setupRequestLogging();

let app;

// Enhanced authentication state management
onAuthStateChanged(auth, async (user) => {
  try {
    if (user) {
      if (user.emailVerified) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          await updateDoc(userDocRef, { 
            isVerified: true,
            lastLogin: new Date().toISOString(),
            loginCount: (userDoc.data().loginCount || 0) + 1
          });
          console.log('User session updated successfully');
        }
      }

      // Enhanced user role management
      await store.dispatch('fetchUserRole', user.uid);
      store.commit('SET_USER', {
        ...user,
        lastActive: new Date().toISOString()
      });
    } else {
      store.commit('SET_USER', null);
      store.commit('SET_ROLE', null);
    }

    if (!app) {
      app = createApp(App)
        .use(store)
        .use(router)
        .mount('#app');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // Handle authentication errors appropriately
    store.commit('SET_ERROR', {
      message: 'Authentication failed. Please try again.',
      code: error.code
    });
  }
});