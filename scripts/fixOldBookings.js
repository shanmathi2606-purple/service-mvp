// Script to update old bookings: if service is a string, convert to object with price from business menu
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixOldBookings() {
  const bookingsSnap = await getDocs(collection(db, 'bookings'));
  for (const bookingDoc of bookingsSnap.docs) {
    const data = bookingDoc.data();
    // Fix service if it's a string
    if (typeof data.service === 'string' && data.businessId) {
      // Fetch business profile
      const profileRef = doc(db, 'businessProfiles', data.businessId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const menu = profileSnap.data().menu || [];
        const svc = menu.find(m => m.name && m.name.toLowerCase() === data.service.toLowerCase());
        if (svc) {
          await updateDoc(bookingDoc.ref, { service: svc });
          console.log(`Updated booking ${bookingDoc.id}: service set to`, svc);
        }
      }
    }
    // Add menu field if missing and service exists
    if (!data.menu && data.service) {
      await updateDoc(bookingDoc.ref, { menu: data.service });
      console.log(`Updated booking ${bookingDoc.id}: menu set to`, data.service);
    }
  }
  console.log('Done updating old bookings.');
}

fixOldBookings().catch(console.error);