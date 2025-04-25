// src/utils/salesRecorder.js
import { db } from '@/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const recordSale = async (saleData) => {
  try {
    const salesCollection = collection(db, 'sales');
    
    const saleRecord = {
      productId: saleData.productId,
      productName: saleData.productName,
      category: saleData.category,
      quantity: saleData.quantity,
      price: saleData.price,
      totalPrice: saleData.quantity * saleData.price,
      cost: saleData.cost || null, // Optional
      sellerId: saleData.sellerId, // If you have multiple sellers
      timestamp: serverTimestamp(), // Critical for forecasting
      season: getCurrentSeason(), // Optional but helpful
      weather: null // Can be populated with weather API later
    };
    
    const docRef = await addDoc(salesCollection, saleRecord);
    return docRef.id;
  } catch (error) {
    console.error("Error recording sale:", error);
    throw error;
  }
};

// Helper function to determine season (optional)
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}