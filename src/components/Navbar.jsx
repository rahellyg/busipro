import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isBlogPage = location.pathname.startsWith('/busiparo/blog')
  const isHomePage = location.pathname === '/busipro' || location.pathname === '/'

  return (
    <nav className={`navbar ${isHomePage ? 'navbar-home' : ''}`}>
      <div className="navbar-container">
        <Link to="/busipro" className="navbar-logo">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradientNav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#d946ef', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path
                d="M7 4 L7 20 M7 4 L12 4 Q14 4 14 6 Q14 8 12 8 L7 8 M7 12 L12 12 Q15 12 15 14.5 Q15 17 12 17 L7 17 L7 20"
                stroke="url(#logoGradientNav)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="17" cy="6" r="1.5" fill="url(#logoGradientNav)" />
            </svg>
            <span className="logo-text">BusiPro</span>
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
            <Link to="/busipro" onClick={() => setIsMenuOpen(false)}>בית</Link>
          </li>
          {!isBlogPage && (
            <>
              <li>
                <a href="#services" onClick={() => setIsMenuOpen(false)}>שירותים</a>
              </li>
              <li>
                <a href="#portfolio" onClick={() => setIsMenuOpen(false)}>תיק עבודות</a>
              </li>
              <li>
                <a href="#ai-builder" onClick={() => setIsMenuOpen(false)}>בונה AI</a>
              </li>
              <li>
                <a href="#contact" onClick={() => setIsMenuOpen(false)}>צור קשר</a>
              </li>
              <li>
                <Link to="/busiparo/blog" onClick={() => setIsMenuOpen(false)}>בלוג</Link>
              </li>
            </>
          )}
        </ul>
        {!isBlogPage && (
          <a href="#contact" className="navbar-cta" onClick={() => setIsMenuOpen(false)}>
            בואו נדבר
          </a>
        )}
      </div>
    </nav>
  )
}

export default Navbar

