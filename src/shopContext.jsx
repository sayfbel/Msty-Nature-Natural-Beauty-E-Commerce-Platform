import React, { createContext, useContext, useEffect, useState } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try { const raw = localStorage.getItem('products'); return raw ? JSON.parse(raw) : sampleProducts(); }
    catch { return sampleProducts(); }
  });

  const [cart, setCart] = useState(() => {
    try { const raw = localStorage.getItem('cart'); return raw ? JSON.parse(raw) : []; }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);

  function addToCart(product, qty = 1, selectedSize = null) {
    setCart(prev => {
      // treat same product+size as same line
      const found = prev.find(p => p.id === product.id && p.size === selectedSize);
      if(found) return prev.map(p => p.id === product.id && p.size === selectedSize ? {...p, qty: p.qty + qty} : p);
      return [...prev, {...product, qty, size: selectedSize}];
    });
  }
  function removeFromCart(id){ setCart(prev => prev.filter(p => p.uniqueId !== id && p.id !== id)); }
  function clearCart(){ setCart([]); }
  function updateQty(id, qty){ setCart(prev => prev.map(p => p.id === id ? {...p, qty} : p)); }

  return (
    <ShopContext.Provider value={{ products, cart, addToCart, removeFromCart, clearCart, updateQty }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);

function sampleProducts(){
  return [
    {
      id:'p1',
      title:'Solid Le Doublure Puffer Jacket',
      price:160,
      retailPrice:1410,
      image:'https://images.unsplash.com/photo-1549989479-9b0d9c9b4f08?w=1400&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1549989479-9b0d9c9b4f08?w=1400&q=80',
        'https://images.unsplash.com/photo-1520975912772-18d6b9f0b0b9?w=1400&q=80',
        'https://images.unsplash.com/photo-1520975971198-6a2f0ad7a7f2?w=1400&q=80'
      ],
      description: 'Red jacket featuring side pockets, elastic cuff, and slightly oversized fit.',
      sizes: ['XS','S','M','L','XL']
    },
    {
      id:'p2',
      title:'Cozy Knit Sweater',
      price:85,
      retailPrice:240,
      image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1400&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1400&q=80',
        'https://images.unsplash.com/photo-1520975971198-6a2f0ad7a7f2?w=1400&q=80'
      ],
      description: 'Warm, comfortable knit sweater for everyday wear.',
      sizes: ['S','M','L']
    },
    {
      id:'p3',
      title:'Minimalist Table Lamp',
      price:45,
      retailPrice:120,
      image:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1400&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1400&q=80'
      ],
      description: 'Modern lamp with adjustable head — perfect for desks.',
      sizes: []
    }
  ]
}
