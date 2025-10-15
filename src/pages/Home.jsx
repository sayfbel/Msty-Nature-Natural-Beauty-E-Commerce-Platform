import React from "react";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home({ products }) {
  return (
    <div className="home-page">
      <h1>products</h1>
      <br />
      <hr />
      <br />
      <div className="products">
        {products.length > 0 ? (
          products.map(p => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
