import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCbey2lJD8po-Qm1YemNNi448Y5bmk-x4o",
  authDomain: "loyalty-app-84ecd.firebaseapp.com",
  databaseURL: "https://loyalty-app-84ecd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loyalty-app-84ecd",
  storageBucket: "loyalty-app-84ecd.firebasestorage.app",
  messagingSenderId: "1001220700220",
  appId: "1:1001220700220:web:09a154ce010145558c2b39",
  measurementId: "G-4N426NREYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get reference to the database
export const database = getDatabase(app);
