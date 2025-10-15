import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

import './Footer.css'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="brand">Msty Nature 🌿</h2>
        <p className="tagline">منتجات طبيعية 100% للعناية بالشعر والبشرة</p>

        <div className="social-icons">
          <a href="https://instagram.com/msty_nature" target="_blank" rel="noopener noreferrer">
            <Instagram size={20} />
          </a>
          <a href="mailto:mstynature@gmail.com">
            <Mail size={20} />
          </a>
          <a href="https://www.tiktok.com/@mstynature" target="_blank" rel="noopener noreferrer">
            <FaTiktok size={20} />
          </a>
          <a href="tel:+21277543157">
            <Phone size={20} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} <span>Msty_Nature</span> | All Rights Reserved 🌸</p>
      </div>
    </footer>
  );
}
