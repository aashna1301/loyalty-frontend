import { database } from "./firebaseConfig";
import { ref, get, set, update } from "firebase/database";

// Create or fetch customer
export const createOrFetchCustomer = async (name, phone) => {
  try {
    const customerRef = ref(database, `customers/${phone}`);
    const snapshot = await get(customerRef);
    
    if (snapshot.exists()) {
      // Customer exists, return it
      return snapshot.val();
    } else {
      // Create new customer
      const newCustomer = {
        name,
        phone,
        points: 0,
        createdAt: new Date().toISOString()
      };
      await set(customerRef, newCustomer);
      return newCustomer;
    }
  } catch (error) {
    console.error("Error creating/fetching customer:", error);
    throw error;
  }
};

// Get customer details
export const getCustomer = async (phone) => {
  try {
    const customerRef = ref(database, `customers/${phone}`);
    const snapshot = await get(customerRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

// Add points based on purchase amount
export const addPoints = async (phone, amount) => {
  try {
    const customer = await getCustomer(phone);
    
    if (!customer) {
      throw new Error("Customer not found");
    }

    const points = Math.floor(amount / 50); // 1 point = ₹50
    const newPoints = (customer.points || 0) + points;

    // Update customer points
    const customerRef = ref(database, `customers/${phone}`);
    await update(customerRef, { points: newPoints });

    // Record transaction
    const transactionRef = ref(database, `transactions/${phone}/${Date.now()}`);
    await set(transactionRef, {
      type: "earn",
      amount,
      points,
      timestamp: new Date().toISOString()
    });

    return {
      ...customer,
      points: newPoints
    };
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

// Redeem points
export const redeemPoints = async (phone, pointsToRedeem) => {
  try {
    const customer = await getCustomer(phone);
    
    if (!customer) {
      throw new Error("Customer not found");
    }

    if ((customer.points || 0) < pointsToRedeem) {
      throw new Error("Not enough points");
    }

    const newPoints = customer.points - pointsToRedeem;

    // Update customer points
    const customerRef = ref(database, `customers/${phone}`);
    await update(customerRef, { points: newPoints });

    // Record transaction
    const transactionRef = ref(database, `transactions/${phone}/${Date.now()}`);
    await set(transactionRef, {
      type: "redeem",
      points: pointsToRedeem,
      timestamp: new Date().toISOString()
    });

    return {
      ...customer,
      points: newPoints
    };
  } catch (error) {
    console.error("Error redeeming points:", error);
    throw error;
  }
};

// Get admin summary
export const getSummary = async () => {
  try {
    const customersRef = ref(database, "customers");
    const snapshot = await get(customersRef);
    
    if (!snapshot.exists()) {
      return {
        totalCustomers: 0,
        totalPoints: 0,
        customers: []
      };
    }

    const customersData = snapshot.val();
    const customers = [];
    let totalPoints = 0;

    for (const [phone, customer] of Object.entries(customersData)) {
      if (customer.points > 0) {
        customers.push({
          name: customer.name,
          phone: customer.phone,
          points: customer.points || 0,
          totalPurchase: (customer.points || 0) * 50
        });
        totalPoints += customer.points || 0;
      }
    }

    // Sort by points descending
    customers.sort((a, b) => b.points - a.points);

    return {
      totalCustomers: customers.length,
      totalPoints,
      customers
    };
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error;
  }
};
