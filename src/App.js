import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Product from "./pages/Product";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

function AppContent() {
  const { products } = useCart();      {/* get products from context */}
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header onSearch={setSearchTerm} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home products={filteredProducts} />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
