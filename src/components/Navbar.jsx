import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isBlogPage = location.pathname.startsWith('/blog')

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: '#94a3b8', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#64748b', stopOpacity: 1}} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect x="8" y="8" width="24" height="24" rx="4" fill="url(#logoGrad)" filter="url(#glow)"/>
              <path d="M16 20L18 22L24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="28" cy="12" r="3" fill="#3b82f6" filter="url(#glow)"/>
            </svg>
            <span className="logo-text">ביזנס פרו</span>
          </div>
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="תפריט"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>בית</Link>
          </li>
          {!isBlogPage && (
            <>
              <li>
                <Link to="/blog" onClick={() => setIsMenuOpen(false)}>בלוג</Link>
              </li>
              <li>
                <a href="#services" onClick={() => setIsMenuOpen(false)}>שירותים</a>
              </li>
              <li>
                <a href="#portfolio" onClick={() => setIsMenuOpen(false)}>אתרים שעשינו</a>
              </li>
              <li>
                <a href="#ai-builder" onClick={() => setIsMenuOpen(false)}>בונה AI</a>
              </li>
              <li>
                <a href="#contact" onClick={() => setIsMenuOpen(false)}>צור קשר</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

