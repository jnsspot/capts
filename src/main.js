import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';  // Now it simply imports the service worker setup
import router from './router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase/firebaseConfig'; 
import { doc, updateDoc } from 'firebase/firestore';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Initialize Firebase Authentication
const auth = getAuth();

// Check if the user is logged in and email is verified
onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (user.emailVerified) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, { isVerified: true });
        console.log('User email is verified, updated Firestore');
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    }
  }
});

createApp(App).use(router).mount('#app');
