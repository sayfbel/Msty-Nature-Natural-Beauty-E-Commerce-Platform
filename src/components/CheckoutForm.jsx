import React, { useState } from 'react';

export default function CheckoutForm({ total, cart, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullname = e.target.Name.value.trim();
    const phone = e.target.Phone.value.trim();
    const address = e.target.adress.value.trim();

    if (!fullname || !phone) {
      alert("⚠️ Name and phone are required!");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ fullname, phone, address, cart, total });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Order Summary</h3>
      <p>Price: <strong>${total.toFixed(2)}</strong></p>
      <p>Tax: <strong>$0</strong></p>
      <p>Total: <strong>${total.toFixed(2)}</strong></p>

      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" id="Name" placeholder="Enter your name" required />

      <label htmlFor="Phone">Phone</label>
      <input
        type="text"
        name="Phone"
        id="Phone"
        required
        maxLength={10}
        placeholder="06XXXXXXXX"
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length > 10) value = value.slice(0, 10);
          if (!/^0[567]/.test(value) && value.length >= 2) value = value.slice(0, 1);
          e.target.value = value;
        }}
      />

      <label htmlFor="adress">Address</label>
      <input type="text" name="adress" id="adress" placeholder="Enter your address" />

      <button type="submit" className="checkout-btn" disabled={loading}>
        {loading ? "Processing..." : "Proceed to Checkout"}
      </button>
    </form>
  );
}
