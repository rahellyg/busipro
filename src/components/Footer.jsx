import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <svg className="footer-logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#94a3b8', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#64748b', stopOpacity: 1}} />
                  </linearGradient>
                  <filter id="footerGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect x="8" y="8" width="24" height="24" rx="4" fill="url(#footerLogoGrad)" filter="url(#footerGlow)"/>
                <path d="M16 20L18 22L24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="28" cy="12" r="3" fill="#3b82f6" filter="url(#footerGlow)"/>
              </svg>
              <h3>ביזנס פרו</h3>
            </div>
            <p>פתרונות בניית אתרים מקצועיים ומודרניים לעסקים קטנים וגדולים</p>
          </div>
          
          <div className="footer-section">
            <h4>קישורים מהירים</h4>
            <ul>
              <li><Link to="/">בית</Link></li>
              <li><Link to="/blog">בלוג</Link></li>
              <li><a href="#services">שירותים</a></li>
              <li><a href="#contact">צור קשר</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>יצירת קשר</h4>
            <ul>
              <li>
                <a 
                  href="mailto:business.pro2999@gmail.com"
                  style={{ 
                    color: '#2563eb', 
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#1e40af';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#2563eb';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  📧 business.pro2999@gmail.com
                </a>
              </li>
              <li>🇮🇱 054-932-9225</li>
              <li>📍 לבנים, ישראל</li>
              <li>
                <a 
                  href="https://wa.me/972549329225?text=שלום!%20אני%20מעוניין/ת%20בשירותי%20בניית%20אתרים%20לעסק%20שלי.%20אשמח%20לקבל%20פרטים%20נוספים%20על%20השירותים%20והמחירים." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#25D366', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#20BA5A';
                    e.target.style.transform = 'translateX(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#25D366';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  שלח הודעה בוואטסאפ
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ביזנס פרו. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

