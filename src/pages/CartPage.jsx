import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import cih from '../images/cashplus.jpeg';
import cashplus from '../images/cih-logo.jpg';
import attijari from '../images/LOGO-ATTIJARI-NEW.gif';
import ProductCard from '../components/ProductCard'; // 👈 needed for related section

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQty, products } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();

    const fullname = e.target.Name.value.trim();
    const phone = e.target.Phone.value.trim();
    const address = e.target.address.value.trim();

    if (!fullname || !phone || !address)
      return alert("⚠️ Please fill in all fields.");

    // Recalculate totals for safety
    const calculated = cart.map(item => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      const offer = Number(item.offer) || 0; // %
      const tax = Number(item.tax) || 0;     // %

      const base = price * qty;
      const offerAmount = base * (offer / 100);
      const taxAmount = base * (tax / 100);
      const totalWithTax = base - offerAmount + taxAmount;

      return {
        ...item,
        base,
        offerAmount,
        taxAmount,
        totalWithTax,
      };
    });

    const grandTotal = calculated.reduce((sum, i) => sum + i.totalWithTax, 0);

    setLoading(true);

    try {
      const res = await fetch("http://localhost/new-store/api/checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          phone,
          address,
          cart: calculated,
          total: grandTotal.toFixed(2),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Order placed successfully!");
        clearCart();
        navigate("/");
      } else {
        alert("❌ Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  // 🛒 If empty
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <p>Your cart is empty 🛒</p>
          <button onClick={() => navigate("/")}>Go Shopping</button>
        </div>
      </div>
    );
  }

  // 💰 Calculate totals for display
  const totalBase = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalOffer = cart.reduce(
    (sum, item) => sum + (item.price * item.qty * (item.offer || 0)) / 100,
    0
  );
  const totalTax = cart.reduce(
    (sum, item) => sum + (item.price * item.qty * (item.tax || 0)) / 100,
    0
  );
  const totalFinal = totalBase - totalOffer + totalTax;

  return (
    <>
      <div className="cart-page">
        <div className="cart-header">
          <h2>Your Cart</h2>
          {cart.length > 0 && (
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          )}
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => {
              const base = item.price * item.qty;
              const offerAmount = base * ((item.offer || 0) / 100);
              const taxAmount = base * ((item.tax || 0) / 100);
              const totalItem = base - offerAmount + taxAmount;

              return (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <div className="quantity-selector">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <span className="cart-price">${totalItem.toFixed(2)}</span>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <form onSubmit={handleCheckout}>
              <h3>Order Summary</h3>
              <p>Subtotal: <strong>${totalBase.toFixed(2)}</strong></p>
              <p>Offer: <strong style={{ color: 'red' }}>-${totalOffer.toFixed(2)}</strong></p>
              <p>Tax: <strong>+${totalTax.toFixed(2)}</strong></p>
              <p className="final-total">
                Total: <strong>${totalFinal.toFixed(2)}</strong>
              </p>

              <label htmlFor="Name">Name:</label>
              <input type="text" placeholder="Your Name" name="Name" id="Name" required />

              <label htmlFor="Phone">Phone:</label>
              <input
                type="text"
                required
                name="Phone"
                id="Phone"
                maxLength={10}
                placeholder="06XXXXXXXX"
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 10) value = value.slice(0, 10);
                  if (!/^0[567]/.test(value) && value.length >= 2)
                    value = value.slice(0, 1);
                  e.target.value = value;
                }}
              />

              <label htmlFor="address">Address:</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Enter your address"
                required
              />

              <button type="submit" className="checkout-btn" disabled={loading}>
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              <br /><hr /><br />
              <h3>Payment Methods</h3>
              <p>You’ll receive a WhatsApp message to confirm your payment method.</p>
              <div className='paydiv'>
                <img className='imgpay' src={cih} alt="cih" />
                <img className='imgpay' src={cashplus} alt="cashplus" />
                <img className='imgpay' src={attijari} alt="attijari" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <br /><hr /><br />
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="products">
          {products?.length > 0 ? (
            products.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>
    </>
  );
}
