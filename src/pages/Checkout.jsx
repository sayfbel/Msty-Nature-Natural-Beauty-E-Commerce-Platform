import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [form, setForm] = useState({ fullname: "", email: "", phone: "", address: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/new-store/api/place_order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, cart, total }),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ Commande envoyée avec succès!");
      clearCart();
    } else {
      alert("Erreur!");
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullname" placeholder="Nom complet" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Téléphone" onChange={handleChange} required />
        <textarea name="address" placeholder="Adresse" onChange={handleChange} required />
        <button type="submit">Confirmer la commande ({total.toFixed(2)} MAD)</button>
      </form>
    </div>
  );
}
