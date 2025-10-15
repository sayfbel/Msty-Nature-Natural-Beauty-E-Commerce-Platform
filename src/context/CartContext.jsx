// context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Products state
  const [products, setProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost/new-store/api/fetch_products.php");
        const data = await res.json();

        // Ensure images is an array
        const formatted = data.map(p => ({
          ...p,
          images: p.images && Array.isArray(p.images) ? p.images : [p.image]
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Fetch Products Error:", err);
      }
    };

    fetchProducts();

    // Optional: refresh every 5s
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync cart with localStorage
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  // Helper: calculate final price for an item
  const calculateFinalPrice = (price, offer = 0, tax = 0, qty = 1) => {
    // Apply discount (always subtract)
    const discountedPrice = Number(price) * (1 - Math.abs(offer) / 100);
    // Apply tax (can be negative or positive)
    const priceWithTax = discountedPrice * (1 + tax / 100);
    // Multiply by quantity and round
    return Number((priceWithTax * qty).toFixed(2));
  };

  // Add product to cart
const addToCart = (product, qty = 1, size = null) => {
  setCart(prev => {
    const found = prev.find(item => item.id === product.id && item.size === size);

    const offer = Number(product.offer) || 0; // discount %
    const tax = Number(product.tax) || 0;     // tax %

    // Calculate amounts
    const offerAmount = Number(product.price * Math.abs(offer) / 100);
    const discountedPrice = Number(product.price - offerAmount);
    const taxAmount = Number(discountedPrice * Math.abs(tax) / 100 * (tax < 0 ? -1 : 1));
    const finalPrice = Number((discountedPrice + taxAmount) * qty).toFixed(2);

    if (found) {
      const newQty = found.qty + qty;
      const newFinalPrice = Number((discountedPrice + taxAmount) * newQty).toFixed(2);

      return prev.map(item =>
        item.id === product.id && item.size === size
          ? { 
              ...item, 
              qty: newQty, 
              finalPrice: newFinalPrice,
              offerAmount: Number(offerAmount.toFixed(2)),
              taxAmount: Number(taxAmount.toFixed(2))
            }
          : item
      );
    }

    return [
      ...prev,
      {
        ...product,
        qty,
        size,
        offer,
        tax,
        offerAmount: Number(offerAmount.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        finalPrice: Number(finalPrice)
      }
    ];
  });
};


  // Remove product from cart
  const removeFromCart = (id, size = null) =>
    setCart(prev => prev.filter(item => item.id !== id || item.size !== size));

  // Clear cart
  const clearCart = () => setCart([]);

  // Update quantity of a cart item
  const updateQty = (id, qty, size = null) =>
    setCart(prev =>
      prev.map(item => {
        if (item.id === id && item.size === size) {
          const finalPrice = calculateFinalPrice(item.price, item.offer, item.tax, qty);
          return { ...item, qty: Number(qty), finalPrice };
        }
        return item;
      })
    );

  // Total cart value
  const total = cart.reduce((sum, item) => sum + (item.finalPrice || 0), 0);

  return (
    <CartContext.Provider
      value={{
        products,
        cart,
        total: Number(total.toFixed(2)),
        addToCart,
        removeFromCart,
        clearCart,
        updateQty
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
