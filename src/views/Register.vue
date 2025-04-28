<template>
  <div class="register-container">
    <div class="logo-container">
      <img src="@/assets/logo.png" alt="FarmXpress Logo" class="logo" />
      <h1 class="app-title">FarmXpress</h1>
      <h3 class="app-subtitle">MOBILE APP</h3>
    </div>

    <!-- Alert Box -->
    <div v-if="alertMessage" :class="['alert-box', alertType]">
      {{ alertMessage }}
    </div>

    <div class="register-box">
      <h2 class="register-title">Create Account</h2>
      
      <div class="input-container">
        <i class="fas fa-user icon"></i>
        <input type="text" v-model="firstName" placeholder="First Name" required />
      </div>
      
      <div class="input-container">
        <i class="fas fa-user icon"></i>
        <input type="text" v-model="lastName" placeholder="Last Name" required />
      </div>
      
      <div class="input-container">
        <i class="fas fa-at icon"></i>
        <input type="text" v-model="username" placeholder="Username" required />
      </div>
      
      <div class="input-container">
        <i class="fas fa-envelope icon"></i>
        <input type="email" v-model="email" placeholder="Email" required />
      </div>
      
      <div class="input-container">
        <i class="fas fa-phone icon"></i>
        <input type="text" v-model="contactNumber" placeholder="Contact Number" required />
      </div>
      
      <!-- Location Selection -->
      <div class="input-container location-select">
        <i class="fas fa-map-marker-alt icon"></i>
        <select v-model="selectedProvince" disabled>
          <option value="Oriental Mindoro">Oriental Mindoro</option>
        </select>
      </div>
      
      <div class="input-container location-select">
        <i class="fas fa-city icon"></i>
        <select v-model="selectedMunicipality" @change="updateBarangays" required>
          <option value="" disabled selected>Select Municipality/City</option>
          <option v-for="municipality in municipalities" :value="municipality" :key="municipality">
            {{ municipality }}
          </option>
        </select>
      </div>
      
      <div class="input-container location-select">
        <i class="fas fa-map-pin icon"></i>
        <select v-model="selectedBarangay" required>
          <option value="" disabled selected>Select Barangay</option>
          <option v-for="barangay in barangays" :value="barangay" :key="barangay">
            {{ barangay }}
          </option>
        </select>
      </div>
      
      <div class="input-container">
        <i class="fas fa-lock icon"></i>
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required />
        <span class="eye-icon" @click="togglePassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>
      
      <div class="input-container">
        <i class="fas fa-lock icon"></i>
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirm Password" required />
        <span class="eye-icon" @click="toggleConfirmPassword">
          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>

      <button class="register-button" @click="register">Create Account</button>

      <p class="login-link">Already have an account? <a href="/login">Login here</a></p>
    </div>
  </div>
</template>

<script>
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Sample data for Oriental Mindoro municipalities and barangays
const orientalMindoroData = {
  "Baco": ["Alag", "Bangkatan", "Burbuli", "Catwiran I", "Catwiran II", "Dulangan I", "Dulangan II", "Lumangbayan", "Malapad", "Mangangan I", "Mangangan II", "Mayabig", "Pambisan", "Poblacion", "Pulang-Tubig", "Putican-Cabulo", "San Andres", "San Ignacio", "Santa Cruz", "Santa Rosa I", "Santa Rosa II", "Tabon-Tabon", "Tagumpay", "Water"],
  "Bansud": ["Alcate", "Bato", "Buenavista", "Burgos", "Cambunang", "Canaan", "Daguit", "Marfrancisco", "Pag-asa", "Poblacion", "Proper Bansud", "Proper Tiguisan", "Rosacara", "Salcedo", "Sumagui", "Villa Pag-asa"],
  "Bongabong": ["Anilao", "Aplaya", "Bagong Bayan I", "Bagong Bayan II", "Batangan", "Bukal", "Camantigue", "Carmen", "Cawayan", "Dayhagan", "Formon", "Hagan", "Hagupit", "Ilasan", "Kaligtasan", "Labasan", "Mag-asawang Tubig", "Malitbog", "Mapang", "Masaguisi", "Morente", "Ogbot", "Orconuma", "Poblacion", "Polusahi", "Sagana", "San Isidro", "San Jose", "San Juan", "Santa Cruz", "Sinanlaban", "Tawas", "Villa M. Principe"],
  "Bulalacao": ["Bagong Sikat", "Balatasan", "Benli", "Cabugao", "Cambunang", "Camilmil", "Giagan", "Maasin", "Maujao", "Milagrosa", "Nasukob", "Poblacion", "San Francisco", "San Isidro", "San Juan", "San Roque", "Siguian"],
  "Calapan": ["Balingayan", "Balite", "Baruyan", "Batino", "Bayanan I", "Bayanan II", "Bulusan", "Comunal", "Guinobatan", "Gutad", "Ibaba East", "Ibaba West", "Ilaya", "Lalud", "Lazareto", "Libis", "Lumangbayan", "Mahabang Parang", "Maidlang", "Malad", "Malamig", "Managpi", "Masipit", "Nag-Iba I", "Nag-Iba II", "Navotas", "Pachoca", "Palhi", "Panggalaan", "Parang", "Patas", "Puting Tubig", "San Antonio", "San Vicente Central", "San Vicente East", "San Vicente North", "San Vicente South", "San Vicente West", "Sta. Cruz", "Sta. Isabel", "Sta. Maria Village", "Sto. Niño", "Sapul", "Silonay", "Sta. Rita", "Sucol", "Suqui", "Tawagan", "Tawiran", "Tibag", "Wawa"],
  "Gloria": ["Agos", "Agustin", "Andres Bonifacio", "Balete", "Banus", "Banutan", "Buong Lupa", "Bulaklakan", "Gaudencio Antonio", "Guimbonan", "Kawit", "Lucio Laurel", "Macario Adriatico", "Malabo", "Maligaya", "Malubay", "Manguyang", "Maragooc", "Mirayan", "Narra", "Papandungin", "San Antonio", "Santa Maria", "Santo Niño", "Talaban", "Tambong", "Tigbao", "Villa Hermosa", "Villahermosa", "Villarico"],
  "Mansalay": ["B. Del Mundo", "Balugo", "Bonbon", "Budburan", "Cabdangan", "Caflanan", "Don Pedro", "Maliwanag", "Manaul", "Panaytayan", "Poblacion", "Roma", "Santa Brigida", "Santa Maria", "Villa Celestial", "Wasig"],
  "Naujan": ["Adrialuna", "Antipolo", "Apitong", "Arangin", "Aurora", "Bacungan", "Bagong Buhay", "Bancuro", "Barcenaga", "Bayani", "Buhangin", "Concepcion", "Dao", "Del Pilar", "Estrella", "Evangelista", "Gamao", "General Esco", "Herera", "Inarawan", "Kalinisan", "Laguna", "Andres Ilagan", "Mabini", "Andres Bonifacio", "Maharika", "Malaya", "Malinao", "Malvar", "Masagana", "Masaguing", "Melgar A", "Melgar B", "Metolza", "Montelago", "Montemayor", "Motoderazo", "Mulawin", "Nag-Iba I", "Nag-Iba II", "Pagkakaisa", "Paniquian", "Pinagsabangan I", "Pinagsabangan II", "Poblacion I", "Poblacion II", "Poblacion III", "Sampaguita", "San Agustin I", "San Agustin II", "San Andres", "San Antonio", "San Carlos", "San Isidro", "San Jose", "San Luis", "San Nicolas", "San Pedro", "Santa Cruz", "Santa Isabel", "Santa Maria", "Santiago", "Santo Niño", "Tagumpay", "Tigkan"],
  "Pinamalayan": ["Anoling", "Bacungan", "Bangbang", "Banus", "Buli", "Caguray", "Calingag", "Del Razon", "Guinhawa", "Inclanay", "Lumambayan", "Malaya", "Maliangcog", "Maningcol", "Marayos", "Marfrancisco", "Nabuslot", "Pagalagala", "Palayan", "Pambisan", "Panikihan", "Pili", "Quinabigan", "Ranzo", "Rosario", "Sabang", "Santa Isabel", "Santa Maria", "Santa Rita", "Santo Niño", "Wawa"],
  "Pola": ["Bacawan", "Bacungan", "Batuhan", "Bayanan", "Biga", "Buhay Na Tubig", "Calima", "Casiligan", "Malibago", "Maluanluan", "Matulatula", "Munting Mapino", "Pahilahan", "Panikihan", "Poblacion", "Pula", "Puting Cacao", "Tagbakin", "Tiguihan"],
  "Puerto Galera": ["Aninuan", "Balanoy", "Balatero", "Dulangan", "Palangan", "Sabang", "San Antonio", "San Isidro", "Santo Niño", "Tabinay", "Villaflor"],
  "Roxas": ["Bagumbayan", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI", "Barangay VII", "Barangay VIII", "Barangay IX", "Barangay X", "Barangay XI", "Barangay XII", "Cantil", "Dangay", "Happy Valley", "Libertad", "Libtong", "Lumangbayan", "Malaga", "Maraska", "Odiong", "Paclasan", "San Aquilino", "San Isidro", "San Jose", "San Mariano", "San Miguel", "San Rafael", "San Vicente", "Sta. Cruz", "Sta. Elena", "Sta. Maria", "Sto. Niño", "Wawa"],
  "San Teodoro": ["Bigaan", "Caagutayan", "Calangatan", "Calsapa", "Ilag", "Lumangbayan", "Poblacion", "Tacligan"],
  "Socorro": ["Bato", "Bayuin", "Bugtong Na Tuog", "Calocmay", "Catiningan", "F. Tantoco", "Happy Valley", "Leuteboro", "Lumangbayan", "Matungao", "Monteverde", "Poblacion I", "Poblacion II", "Poblacion III", "Poblacion IV", "Poblacion V", "Poblacion VI", "Poblacion VII", "Poblacion VIII", "Santo Domingo", "Villaflor"],
  "Victoria": ["Alcate", "Antipolo", "Bacungan", "Bagong Buhay", "Bambanin", "Bethel", "Canaan", "Concepcion", "Duongan", "Loyal", "Mabini", "Macatoc", "Malabo", "Mercedes", "Ogbot", "Orion", "San Antonio", "San Cristobal", "San Gabriel", "San Gelacio", "San Isidro", "San Juan", "San Narciso", "Urdaneta"]
};

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      contactNumber: '',
      selectedProvince: 'Oriental Mindoro',
      selectedMunicipality: '',
      selectedBarangay: '',
      municipalities: Object.keys(orientalMindoroData),
      barangays: [],
      role: 'customer',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      alertMessage: '',
      alertType: ''
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    updateBarangays() {
      this.barangays = orientalMindoroData[this.selectedMunicipality] || [];
      this.selectedBarangay = '';
    },
    showAlert(message, type) {
      this.alertMessage = message;
      this.alertType = type;
      setTimeout(() => {
        this.alertMessage = '';
      }, 3000);
    },
    async register() {
      if (this.password !== this.confirmPassword) {
        this.showAlert('Passwords do not match!', 'error');
        return;
      }
      if (!this.firstName || !this.lastName || !this.username || !this.email || !this.contactNumber || !this.selectedMunicipality || !this.selectedBarangay) {
        this.showAlert('Please fill out all fields.', 'error');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        await sendEmailVerification(user);
        this.showAlert('Verification email sent! Please check your inbox.', 'success');

        await setDoc(doc(db, 'users', user.uid), {
          userId: user.uid,
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
          contactNumber: this.contactNumber,
          address: `${this.selectedBarangay}, ${this.selectedMunicipality}, Oriental Mindoro`,
          province: 'Oriental Mindoro',
          municipality: this.selectedMunicipality,
          barangay: this.selectedBarangay,
          role: this.role,
          isVerified: false,
          isSeller: false 
        });

        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Error during registration:', error);
        this.showAlert('Registration failed! Check console for details.', 'error');
      }
    }
  }
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

.logo-container {
  text-align: center;
  margin-bottom: 20px;
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

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.register-box {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.register-title {
  color: #2e5c31;
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
}

.input-container {
  display: flex;
  align-items: center;
  background: #eaeaea;
  border-radius: 50px;
  padding: 12px;
  margin-bottom: 15px;
  position: relative;
}

.icon {
  margin-right: 10px;
  color: #999;
  font-size: 18px;
}

input[type="email"],
input[type="text"],
input[type="password"] {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #333;
}

.eye-icon {
  position: absolute;
  right: 15px;
  color: #999;
  cursor: pointer;
  font-size: 18px;
}

.register-button {
  background: #2e5c31;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.register-button:hover {
  background: #26492a;
}

.login-link {
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
  color: #666;
}

.login-link a {
  color: #2e5c31;
  text-decoration: none;
  font-weight: bold;
}

.location-select {
  position: relative;
}

.location-select select {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 30px;
}

.location-select::after {
  content: '\f078';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

</style>