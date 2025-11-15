import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import AdminSummary from "./AdminSummary";

function App() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  const backendURL = "https://loyalty-backend-zhzw.onrender.com/api";

  const handleFetch = async () => {
    try {
      const res = await axios.get(`${backendURL}/customer/${phone}`);
    if (res.data) {
      setCustomer(res.data);
      setMessage("");
    } else {
      setCustomer(null);
      setMessage("Customer not found");
    }
  } catch {
    setCustomer(null);
    setMessage("Error fetching customer");
  }
  };

  const handleAddPoints = async () => {
    try {
      await axios.post(`${backendURL}/add-points`, {
        phone,
        amount: Number(amount),
      });
      setMessage("✅ Points added successfully!");
      handleFetch();
      setAmount("");
    } catch {
      setMessage("Error adding points");
    }
  };

  const handleRedeem = async () => {
    try {
      await axios.post(`${backendURL}/redeem`, {
        phone,
        points: Number(amount),
      });
      setMessage("🎁 Points redeemed successfully!");
      handleFetch();
      setAmount("");
    } catch {
      setMessage("Error redeeming points");
    }
  };

  const handleCreateCustomer = async () => {
    try {
      await axios.post(`${backendURL}/customers`, {
        name: newName,
        phone: newPhone,
      });
      setMessage(`🎉 New customer added: ${newName}`);
      setNewName("");
      setNewPhone("");
      setShowModal(false);
    } catch {
      setMessage("Error creating customer");
    }
  };

  return (
  <div className="container">
    <div className="card">
      {/* toggle button always visible */}
      <button
        className="secondary-btn"
        onClick={() => setShowAdmin(!showAdmin)}
        style={{ marginBottom: "10px" }}
      >
        {showAdmin ? "🏠 Back to Loyalty App" : "📊 View Admin Summary"}
      </button>

      {/* conditional rendering for admin vs loyalty view */}
      {showAdmin ? (
        <AdminSummary />
      ) : (
        <>
          <div className="header">
            <h1 className="shop-name">Gupta Showroom</h1>
            <p className="tagline">A complete gift shop</p>
          </div>

          <div className="input-group">
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
            <button className="primary-btn" onClick={handleFetch}>
              Check Balance
            </button>
          </div>

          <button className="secondary-btn" onClick={() => setShowModal(true)}>
            ➕ Add New Customer
          </button>

          {customer && (
            <div className="customer-card">
              <h2>{customer.name}</h2>
              <p>📞 {customer.phone}</p>
              <h3>{customer.points} Points</h3>
            </div>
          )}

          <div className="input-group">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Enter amount / points"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="btn-group">
            <button className="success-btn" onClick={handleAddPoints}>
              ➕ Add Points
            </button>
            <button className="danger-btn" onClick={handleRedeem}>
              🎁 Redeem
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </>
      )}
    </div>

    {/* modal for new customer */}
    {showModal && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Add New Customer</h2>
          <input
            type="text"
            placeholder="Customer Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <div className="modal-buttons">
            <button className="success-btn" onClick={handleCreateCustomer}>
              Save
            </button>
            <button className="danger-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default App;
