import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Only show offer if product.offer exists and is less than original price
  const hasOffer = product.offer && product.offer < product.price;

  return (
    <article className="card">
      {hasOffer && (
        <div className="offer-name">
          %{product.offer}
        </div>
      )}
      <Link to={`/product/${product.id}`} className="card-media">
        <img src={product.image} alt={product.title} />
      </Link>
      <div className="card-body">
        <h3>{product.title}</h3>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="small">
            {hasOffer ? (
              <>
                <span className="old-price">${product.price}</span>
                <span className='newPrice'>
                  {' '}
                {`$${(product.price - -(product.price * product.offer / 100)).toFixed(2)}`}
                </span>
              </>
            ) : (
              `$${product.price}`
            )}
          </div>
          <button className="btn" onClick={() => addToCart(product, 1, null)}>Add</button>
        </div>
      </div>
    </article>
  );
}
