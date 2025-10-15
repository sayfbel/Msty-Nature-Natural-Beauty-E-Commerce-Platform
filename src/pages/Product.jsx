import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Product.css';
import ProductCard from '../components/ProductCard';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, clearCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    // Scroll to top only when user opens a new product
    window.scrollTo({ top: 0, behavior: "smooth" });

    const found = products.find(p => String(p.id) === String(id));
    if (found) {
      setProduct(found);
      setMainImg(prev => (prev && found.images?.includes(prev)) ? prev : found.image);
    }
    // 👇 only depend on 'id' (not 'products')
  }, [id]);

  if (!product) return <div className="container">⏳ Loading product...</div>;

  // ✅ Safe numeric conversions
  const price = Number(product.price) || 0;
  const offer = Number(product.offer) || 0; // e.g. 10 means 10% discount
  const tax = Number(product.tax) || 0;     // e.g. 5 means 5% tax

  // ✅ Step 1: base × qty
  const priceWithoutOffer = price * qty;

  // ✅ Step 2: calculate offer amount and subtract it
  const offerAmount = priceWithoutOffer * (offer / 100); // can be negative

  // ✅ Step 3: calculate tax amount and add it
  const taxAmount = (priceWithoutOffer + offerAmount) * (tax / 100); // can be negative
  const totalWithTax = priceWithoutOffer + (taxAmount + offerAmount);

  const handleMouseMove = (e) => {
    if (!zoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    e.currentTarget.querySelector('img').style.transformOrigin = `${x}% ${y}%`;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    const fullname = e.target.Name.value.trim();
    const phone = e.target.Phone.value.trim();
    const address = e.target.address.value.trim();

    if (!fullname || !phone || !address) {
      return alert("⚠️ Please fill in all required fields.");
    }

    const orderData = {
      fullname,
      phone,
      address,
      cart: [
        {
          ...product,
          qty,
          price,
          offer,
          tax,
          total: totalWithTax.toFixed(2),
        },
      ],
      offer: offer,
      tax: tax.toFixed(2),
      total: totalWithTax.toFixed(2),
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost/new-store/api/checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        setProduct(prev => ({ ...prev, offer: data.offer ?? prev.offer }));
        alert("✅ Your order has been placed successfully!");
        clearCart();
        navigate("/");
      } else {
        alert("❌ Failed to place your order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Unable to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const shortDesc = product.description?.slice(0, 255) || '';
  const images = product.images || [product.image];

  return (
    <div className="container product-page">
      <button className="back" onClick={() => window.history.back()}>← Back</button>

      <div className="product-grid">
        <div className="right-container">
          {/* --- Image Section --- */}
          <div className="images-side">
            <div className="gallery">
              <div
                className={`zoom-container ${zoomed ? "zoomed" : ""}`}
                onClick={() => setZoomed(!zoomed)}
                onMouseMove={handleMouseMove}
                onMouseLeave={(e) => e.currentTarget.querySelector('img').style.transform = "scale(1)"}
              >
                <img
                  src={mainImg}
                  alt={product.title}
                  className="main-image"
                  style={{
                    transform: zoomed ? "scale(2)" : "scale(1)",
                    transition: "transform 0.2s ease-out"
                  }}
                />
              </div>
            </div>
            <br />
            <div className="scroll-images">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className={mainImg === img ? "thumb active" : "thumb"}
                  onClick={() => setMainImg(img)}
                  alt={`Thumbnail ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* --- Description Section --- */}
          <div className="definition">
            <br />
            <hr />
            <br />
            <h1>Product Description</h1>
            <p>
              {showFullDesc ? product.description : shortDesc}
              {product.description?.length > 255 && (
                <span
                  className="show-more"
                  onClick={() => setShowFullDesc(prev => !prev)}
                >
                  {showFullDesc ? ' Show Less' : '... Show More'}
                </span>
              )}
            </p>

            <div className="info-details">
              <p><strong>Name:</strong> {product.title}</p>
              <p><strong>Category:</strong> {product.category || "Uncategorized"}</p>
              <p><strong>Date Added:</strong> {product.created_at
                ? new Date(product.created_at).toLocaleString()
                : "Not available"}</p>
              <p><strong>Response Time:</strong> {product.respond_time || "Usually within 24 hours"}</p>
              <p><strong>Seller:</strong> {product.seller || "Official Store"}</p>
            </div>
            <br />
            <hr />
            <br />
            <h1>How to Purchase</h1>
            <p>
              To purchase this product, simply fill in your details and proceed to checkout.
              Our team will confirm your order and deliver it promptly.
            </p>
          </div>
        </div>

        {/* --- Purchase Section --- */}
        <aside className="details">
          <h1>{product.title}</h1>
          <div className="price">${priceWithoutOffer.toFixed(2)}</div>

          <div className="tax-line">
            <span>Tax:{tax}% (${taxAmount.toFixed(2)})</span>
            <span
              className="info-icon"
              title="This is a delivery tax applied to your order."
            >
              !
            </span>
          </div>

          <div className="quantity">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            {qty}
            <button onClick={() => setQty(q => q + 1)}>+</button>
          </div>

          <form onSubmit={handleCheckout}>
            <h3>Order Summary</h3>
            <p>Price: <strong>${priceWithoutOffer.toFixed(2)}</strong></p>
            <p>Offer: <strong style={{ color: 'red' }}>{offer}% (${offerAmount.toFixed(2)})</strong></p>
            <p>Tax: <strong>{tax}% (${taxAmount.toFixed(2)})</strong></p>
            <p>Total: <strong>${totalWithTax.toFixed(2)}</strong></p>

            <label htmlFor="Name">Full Name:</label>
            <input type="text" name="Name" id="Name" placeholder="Your full name" required />

            <label htmlFor="Phone">Phone Number:</label>
            <input
              type="text"
              name="Phone"
              id="Phone"
              placeholder="06XXXXXXXX"
              maxLength={10}
              required
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) value = value.slice(0, 10);
                if (!/^0[567]/.test(value) && value.length >= 2) value = value.slice(0, 1);
                e.target.value = value;
              }}
            />

            <label htmlFor="address">Address:</label>
            <input type="text" name="address" id="address" placeholder="Your delivery address" required />

            <button type="submit" className="checkout-btn" disabled={loading}>
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </form>

          <button className="btn" onClick={() => addToCart(product, qty)}>
            Add to Cart
          </button>
        </aside>
      </div>
      <br />
      <br />
      <hr />
      <br />
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="products">
          {products.length > 0 ? (
            products.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
