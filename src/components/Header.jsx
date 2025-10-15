import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Header.css";

export default function Header({ onSearch }) {
  const { cart } = useCart();
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <header className="site-header">
      <div className="Logoname">MSTY NATURE</div>
      <div className="container header-inner">
        <div className="brand">
          <Link to="/" className="logo">Msty Nature 🌿</Link>
          <div className="search">
            <input
              placeholder="Search"
              onChange={e => onSearch(e.target.value)}
            />
          </div>
        </div>
        <nav className="nav-right">
          <Link to="/cart" className="nav-item">Cart ({totalQty})</Link>
        </nav>
      </div>
    </header>
  );
}
