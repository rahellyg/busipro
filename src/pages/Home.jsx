import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { portfolioProjects } from '../data/portfolio'
import { blogPosts } from '../data/blogPosts'
import smartStartImage from '../components/smart-start.png'
import maayanessImage from '../components/maayaness.png'
import foodDictImage from '../components/foodDict.png'
import AIGeneratedWebsite from '../components/AIGeneratedWebsite'
import { generateWebsite, generateWebsiteImages } from '../services/aiService'
import './Home.css'

function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [aiPreview, setAiPreview] = useState({ images: [], video: null })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    const formData = new FormData(e.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const message = formData.get('message')

    // הגדרות EmailJS - יש להחליף בערכים שלך מ-EmailJS.com
    const SERVICE_ID = 'service_9ndbmvg' // יש להחליף
    const TEMPLATE_ID = 'template_q8uo95p' // יש להחליף
    const PUBLIC_KEY = 'tonKc3pdozyScs8nk' // יש להחליף

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          phone: phone || 'לא צוין',
          message: message,
          to_email: 'business.pro2999@gmail.com',
          subject: 'פנייה חדשה מאתר - בניית אתרים'
        },
        PUBLIC_KEY
      )

      // הצלחה
      setSubmitMessage('תודה על פנייתך! נחזור אליך בהקדם.')
      e.target.reset()
    } catch (error) {
      // שגיאה
      console.error('Error sending email:', error)
      setSubmitMessage('אירעה שגיאה בשליחת ההודעה. אנא נסה שוב או צור קשר ישירות.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIGenerate = async (businessType, businessName, businessDescription, isStore) => {
    setIsGenerating(true)
    setAiPreview({ images: [], video: null })
    setGeneratedWebsite(null)
    setSubmitMessage('')

    try {
      // בדיקה אם יש API key
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 
                     import.meta.env.VITE_ANTHROPIC_API_KEY || 
                     import.meta.env.VITE_GEMINI_API_KEY

      if (!apiKey) {
        // אם אין API key, נשתמש בנתונים בסיסיים (ללא AI)
        console.warn('לא נמצא API key - משתמש בנתונים בסיסיים')
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const websiteData = {
          businessName,
          businessType,
          businessDescription,
          isStore
        }
        
        setGeneratedWebsite(websiteData)
        setSubmitMessage('האתר נוצר עם נתונים בסיסיים. הוסף API key ל-.env כדי לקבל תוכן מותאם מ-AI.')
        return
      }

      // קריאה ל-AI חיצוני - יצירת תוכן האתר
      const aiGeneratedData = await generateWebsite(
        businessName,
        businessType,
        businessDescription,
        isStore
      )

      // יצירת תמונות של האתר באמצעות DALL-E
      let websiteImages = {}
      try {
        console.log('מתחיל ליצור תמונות...', { businessName, businessDescription, businessType, isStore })
        websiteImages = await generateWebsiteImages(businessName, businessDescription, businessType, isStore)
        console.log('תמונות נוצרו:', websiteImages)
        
        // בדיקה שהתמונות נוצרו
        if (!websiteImages || !websiteImages.catalog || !websiteImages.cart || !websiteImages.promotions) {
          console.error('חלק מהתמונות חסרות:', websiteImages)
          throw new Error('חלק מהתמונות לא נוצרו')
        }
        
        // הגדרת כותרות לפי סוג האתר
        const imageTitles = isStore ? {
          catalog: 'דף קטלוג מוצרים',
          cart: 'עגלת קניות',
          promotions: 'דף מבצעים והנחות'
        } : {
          catalog: 'דף השירותים שלנו',
          cart: 'דף אודותינו',
          promotions: 'דף צור קשר'
        }
        
        // הגדרת התמונות ב-state
        const previewImages = [
          { type: 'catalog', url: websiteImages.catalog, title: imageTitles.catalog },
          { type: 'cart', url: websiteImages.cart, title: imageTitles.cart },
          { type: 'promotions', url: websiteImages.promotions, title: imageTitles.promotions }
        ]
        
        setAiPreview({
          images: previewImages,
          video: null
        })
        
        console.log('תמונות הוגדרו ב-aiPreview:', previewImages)
      } catch (imageError) {
        console.error('שגיאה ביצירת תמונות:', imageError)
        // ממשיכים גם אם יצירת התמונות נכשלה
        // אבל נציג הודעה למשתמש
        setSubmitMessage('האתר נוצר בהצלחה, אבל יצירת התמונות נכשלה. ודא שיש לך API key תקין.')
      }

      // שילוב הנתונים מה-AI עם הנתונים הבסיסיים
      const websiteData = {
        businessName: aiGeneratedData.businessName || businessName,
        businessType: aiGeneratedData.businessType || businessType,
        businessDescription: aiGeneratedData.businessDescription || businessDescription,
        isStore: aiGeneratedData.isStore !== undefined ? aiGeneratedData.isStore : isStore,
        // נתונים נוספים מה-AI (אם יש)
        heroTitle: aiGeneratedData.heroTitle,
        heroSubtitle: aiGeneratedData.heroSubtitle,
        features: aiGeneratedData.features,
        products: aiGeneratedData.products,
        services: aiGeneratedData.services,
        aboutText: aiGeneratedData.aboutText,
        colorScheme: aiGeneratedData.colorScheme,
        // תמונות שנוצרו
        images: websiteImages
      }
      
      setGeneratedWebsite(websiteData)
      setSubmitMessage('האתר והתמונות נוצרו בהצלחה!')
      
    } catch (error) {
      console.error('Error generating website:', error)
      
      // אם יש שגיאה, נשתמש בנתונים הבסיסיים
      const fallbackData = {
        businessName,
        businessType,
        businessDescription,
        isStore
      }
      setGeneratedWebsite(fallbackData)
      
      setSubmitMessage(
        error.message?.includes('API Key') 
          ? 'לא נמצא API Key. האתר נוצר עם נתונים בסיסיים. הוסף API Key ל-.env כדי לקבל תוכן מותאם מ-AI.'
          : `שגיאה ביצירת האתר: ${error.message}. האתר נוצר עם נתונים בסיסיים.`
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              בניית אתרים מקצועית
              <span className="highlight"> לעסק שלך</span>
            </h1>
            <p className="hero-subtitle">
              אנו בונים אתרים מודרניים, מהירים וידידותיים למשתמש שיעזרו לעסק שלך לצמוח ולהצליח
            </p>
            <div className="hero-buttons">
              <a href="#blog" className="btn btn-primary">
                קרא את הבלוג שלנו
              </a>
              <a href="#contact" className="btn btn-secondary">
                צור קשר
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">
              <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#94a3b8', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                {/* Background */}
                <rect width="500" height="400" rx="16" fill="url(#grad1)"/>
                
                {/* Laptop/Computer Screen */}
                <rect x="100" y="80" width="300" height="200" rx="8" fill="rgba(255, 255, 255, 0.95)"/>
                <rect x="120" y="100" width="260" height="160" rx="4" fill="#1e293b"/>
                
                {/* Browser Window Elements */}
                <rect x="120" y="100" width="260" height="25" fill="#334155"/>
                <circle cx="135" cy="112.5" r="4" fill="#ef4444"/>
                <circle cx="150" cy="112.5" r="4" fill="#f59e0b"/>
                <circle cx="165" cy="112.5" r="4" fill="#10b981"/>
                
                {/* Code Lines */}
                <rect x="130" y="140" width="120" height="8" rx="2" fill="#2563eb" opacity="0.8"/>
                <rect x="130" y="155" width="100" height="8" rx="2" fill="#94a3b8" opacity="0.8"/>
                <rect x="130" y="170" width="140" height="8" rx="2" fill="#10b981" opacity="0.8"/>
                <rect x="130" y="185" width="90" height="8" rx="2" fill="#f59e0b" opacity="0.8"/>
                <rect x="130" y="200" width="110" height="8" rx="2" fill="#ef4444" opacity="0.8"/>
                
                {/* HTML Tag */}
                <text x="250" y="230" fontFamily="monospace" fontSize="14" fill="#2563eb" fontWeight="bold">&lt;/&gt;</text>
                
                {/* Laptop Base */}
                <rect x="80" y="280" width="340" height="20" rx="4" fill="rgba(255, 255, 255, 0.3)"/>
                <rect x="200" y="300" width="100" height="8" rx="2" fill="rgba(255, 255, 255, 0.2)"/>
                
                {/* Mobile Device */}
                <rect x="350" y="120" width="80" height="140" rx="12" fill="rgba(255, 255, 255, 0.9)"/>
                <rect x="360" y="130" width="60" height="120" rx="4" fill="#1e293b"/>
                <rect x="365" y="135" width="50" height="8" rx="2" fill="#3b82f6" opacity="0.6"/>
                <rect x="365" y="150" width="45" height="6" rx="1" fill="#8b5cf6" opacity="0.5"/>
                <rect x="365" y="160" width="40" height="6" rx="1" fill="#10b981" opacity="0.5"/>
                
                {/* Code Brackets */}
                <text x="420" y="180" fontFamily="monospace" fontSize="20" fill="rgba(255, 255, 255, 0.6)">{'{'}</text>
                <text x="420" y="200" fontFamily="monospace" fontSize="20" fill="rgba(255, 255, 255, 0.6)">{'}'}</text>
                
                {/* Floating Elements - Code Symbols */}
                <circle cx="450" cy="80" r="15" fill="rgba(255, 255, 255, 0.2)"/>
                <text x="445" y="86" fontFamily="monospace" fontSize="12" fill="rgba(255, 255, 255, 0.8)">&lt;</text>
                
                <circle cx="50" cy="150" r="12" fill="rgba(255, 255, 255, 0.2)"/>
                <text x="46" y="156" fontFamily="monospace" fontSize="10" fill="rgba(255, 255, 255, 0.8)">{'}'}</text>
                
                <circle cx="450" cy="320" r="12" fill="rgba(255, 255, 255, 0.2)"/>
                <text x="446" y="326" fontFamily="monospace" fontSize="10" fill="rgba(255, 255, 255, 0.8)">/</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">השירותים שלנו</h2>
          <p className="section-subtitle">
            אנו מציעים מגוון רחב של שירותי בניית אתרים מותאמים לצרכים שלך
          </p>
          <div className="services-container">
            <div className="services-row">
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <div className="service-icon">🚀</div>
                </div>
                <div className="service-content">
                  <h3>בניית דף נחיתה</h3>
                  <p>דף נחיתה מקצועי ומרשים שממיר מבקרים ללקוחות</p>
                  <div className="service-price">
                    <span className="price-amount">444</span>
                    <span className="price-currency">₪</span>
                  </div>
                </div>
              </div>
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <div className="service-icon">🛒</div>
                </div>
                <div className="service-content">
                  <h3>בניית חנות מקוונת</h3>
                  <p>חנות בסיסית עם תוסף קל לשימוש לניהול החנות, תמיכה והדרכה ראשונית</p>
                  <div className="service-price">
                    <span className="price-amount">999</span>
                    <span className="price-currency">₪</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="services-row">
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <div className="service-icon">💻</div>
                </div>
                <div className="service-content">
                  <h3>אתרי תדמית</h3>
                  <p>אתרים מקצועיים ומרשימים שמציגים את העסק שלך בצורה הטובה ביותר</p>
                  <div className="service-price">
                    <span className="price-amount">599</span>
                    <span className="price-currency">₪</span>
                  </div>
                </div>
              </div>
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <div className="service-icon">🛠️</div>
                </div>
                <div className="service-content">
                  <h3>תחזוקה ותמיכה</h3>
                  <p>שירותי תחזוקה שוטפת ותמיכה טכנית זמינה 24/7</p>
                  <div className="service-price">
                    <span className="price-amount">49</span>
                    <span className="price-currency">₪</span>
                    <span style={{ fontSize: '0.9em', marginLeft: '4px' }}>לחודש</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2>למה לבחור בנו?</h2>
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <div>
                    <h4>ניסיון רב שנים</h4>
                    <p>יותר מ-10 שנות ניסיון בבניית אתרים מקצועיים</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <div>
                    <h4>טכנולוגיות מתקדמות</h4>
                    <p>שימוש בטכנולוגיות העדכניות ביותר לבניית אתרים מהירים ואמינים</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <div>
                    <h4>שירות אישי</h4>
                    <p>ליווי צמוד לאורך כל התהליך מהתכנון ועד ההשקה</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <div>
                    <h4>מחירים הוגנים</h4>
                    <p>מחירים תחרותיים עם שקיפות מלאה ללא הפתעות</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="features-image">
              <div className="features-placeholder">
                <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="featuresGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 0.1}} />
                      <stop offset="100%" style={{stopColor: '#94a3b8', stopOpacity: 0.1}} />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="400" fill="url(#featuresGrad)" rx="8"/>
                  
                  {/* Website Browser */}
                  <rect x="50" y="60" width="300" height="200" rx="8" fill="white" stroke="#2563eb" strokeWidth="2"/>
                  <rect x="50" y="60" width="300" height="30" rx="8" fill="#1e293b"/>
                  <circle cx="65" cy="75" r="5" fill="#ef4444"/>
                  <circle cx="80" cy="75" r="5" fill="#f59e0b"/>
                  <circle cx="95" cy="75" r="5" fill="#10b981"/>
                  
                  {/* Code Lines */}
                  <rect x="70" y="110" width="120" height="8" rx="2" fill="#3b82f6" opacity="0.7"/>
                  <rect x="70" y="130" width="100" height="8" rx="2" fill="#8b5cf6" opacity="0.7"/>
                  <rect x="70" y="150" width="140" height="8" rx="2" fill="#10b981" opacity="0.7"/>
                  <rect x="70" y="170" width="90" height="8" rx="2" fill="#f59e0b" opacity="0.7"/>
                  <rect x="70" y="190" width="110" height="8" rx="2" fill="#ef4444" opacity="0.7"/>
                  
                  {/* HTML Tag */}
                  <text x="200" y="230" fontFamily="monospace" fontSize="16" fill="#2563eb" fontWeight="bold">&lt;/&gt;</text>
                  
                  {/* Mobile Device */}
                  <rect x="250" y="120" width="60" height="100" rx="8" fill="white" stroke="#94a3b8" strokeWidth="2"/>
                  <rect x="260" y="130" width="40" height="80" rx="4" fill="#1e293b"/>
                  <rect x="265" y="135" width="30" height="6" rx="1" fill="#3b82f6" opacity="0.6"/>
                  <rect x="265" y="145" width="25" height="4" rx="1" fill="#8b5cf6" opacity="0.5"/>
                  
                  {/* Code Brackets */}
                  <text x="320" y="160" fontFamily="monospace" fontSize="24" fill="#2563eb" opacity="0.6">{'{'}</text>
                  <text x="320" y="190" fontFamily="monospace" fontSize="24" fill="#94a3b8" opacity="0.6">{'}'}</text>
                  
                  {/* Server/Cloud Icon */}
                  <circle cx="100" cy="320" r="25" fill="#2563eb" opacity="0.2"/>
                  <circle cx="100" cy="320" r="15" fill="#2563eb" opacity="0.4"/>
                  <circle cx="100" cy="320" r="8" fill="#2563eb"/>
                  
                  {/* Database Icon */}
                  <ellipse cx="200" cy="320" rx="30" ry="20" fill="#94a3b8" opacity="0.2"/>
                  <ellipse cx="200" cy="320" rx="20" ry="12" fill="#94a3b8" opacity="0.4"/>
                  <ellipse cx="200" cy="320" rx="10" ry="6" fill="#94a3b8"/>
                  
                  {/* Gear/Settings Icon */}
                  <circle cx="300" cy="320" r="20" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6"/>
                  <circle cx="300" cy="320" r="12" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.6"/>
                  <circle cx="300" cy="320" r="4" fill="#2563eb" opacity="0.8"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">אתרים שעשינו</h2>
          <p className="section-subtitle">
            הנה כמה מהפרויקטים המקצועיים שבנינו עבור לקוחותינו
          </p>
          <div className="portfolio-grid">
            {portfolioProjects.map((project) => (
              <div key={project.id} className="portfolio-card">
                <div className={`portfolio-image portfolio-bg-${project.background || 'default'}`}>
                  {project.previewImage === 'smart-start' ? (
                    <div className="portfolio-preview-image-container">
                      <img 
                        src={smartStartImage} 
                        alt={project.title}
                        className="portfolio-preview-image"
                      />
                    </div>
                  ) : project.previewImage === 'maayaness' ? (
                    <div className="portfolio-preview-image-container">
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', width: '100%', height: '100%' }}
                      >
                        <img 
                          src={maayanessImage} 
                          alt={project.title}
                          className="portfolio-preview-image"
                        />
                      </a>
                    </div>
                  ) : project.previewImage === 'foodDict' ? (
                    <div className="portfolio-preview-image-container">
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', width: '100%', height: '100%' }}
                      >
                        <img 
                          src={foodDictImage} 
                          alt={project.title}
                          className="portfolio-preview-image"
                        />
                      </a>
                    </div>
                  ) : project.logo === 'migdal' ? (
                    <div className="portfolio-preview">
                      <div className="portfolio-preview-header">
                        <div className="portfolio-browser-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="portfolio-preview-logo">
                          <svg className="portfolio-logo-small" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="migdalGradSmall" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{stopColor: '#4a90e2', stopOpacity: 1}} />
                                <stop offset="100%" style={{stopColor: '#357abd', stopOpacity: 1}} />
                              </linearGradient>
                            </defs>
                            <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="url(#migdalGradSmall)">
                              מגדל
                            </text>
                            <circle cx="95" cy="20" r="7" fill="#4a90e2" opacity="0.8"/>
                            <path d="M92 20 L95 16 L98 20 L95 24 Z" fill="white"/>
                          </svg>
                        </div>
                      </div>
                      <div className="portfolio-preview-content">
                        <div className="preview-navbar"></div>
                        <div className="preview-hero">
                          <div className="preview-hero-title"></div>
                          <div className="preview-hero-subtitle"></div>
                        </div>
                        <div className="preview-sections">
                          <div className="preview-section"></div>
                          <div className="preview-section"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="portfolio-image-placeholder">
                      {project.image}
                    </div>
                  )}
                </div>
                <div className="portfolio-content">
                  <div className="portfolio-category">{project.category}</div>
                  <h3 className="portfolio-title">{project.title}</h3>
                  <p className="portfolio-description">{project.description}</p>
                  <div className="portfolio-technologies">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="portfolio-link"
                  >
                    צפה באתר →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog-section">
        <div className="container">
          <h2 className="section-title">הבלוג שלנו</h2>
          <p className="section-subtitle">
            טיפים, מדריכים וחדשות מעולם בניית האתרים
          </p>
          <div className="blog-grid-home">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.id} className="blog-card-home">
                <div className="blog-card-image-home">
                  <div className="blog-image-placeholder-home">
                    {post.emoji}
                  </div>
                </div>
                <div className="blog-card-content-home">
                  <div className="blog-meta-home">
                    <span className="blog-date-home">{post.date}</span>
                    <span className="blog-category-home">{post.category}</span>
                  </div>
                  <h3 className="blog-card-title-home">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="blog-card-excerpt-home">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="blog-read-more-home">
                    קרא עוד →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/blog" className="btn btn-primary">
              צפה בכל הפוסטים
            </Link>
          </div>
        </div>
      </section>

      {/* AI Website Builder Section */}
      <section id="ai-builder" className="ai-builder-section">
        <div className="container">
          <h2 className="section-title">בונה אתרים AI</h2>
          <p className="section-subtitle">
            ספר לנו על העסק שלך ואנחנו נציג לך איך האתר שלך יכול להיראות
          </p>
          
          <div className="ai-builder-container">
            <div className="ai-form-section">
              <form className="ai-builder-form" onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const businessType = formData.get('businessType')
                const businessName = formData.get('businessName')
                const businessDescription = formData.get('businessDescription')
                const isStore = formData.get('isStore') === 'yes'
                
                // כאן נוסיף לוגיקה ליצירת תמונות ווידאו
                handleAIGenerate(businessType, businessName, businessDescription, isStore)
              }}>
                <div className="form-group">
                  <label htmlFor="businessName">שם העסק</label>
                  <input 
                    type="text" 
                    id="businessName" 
                    name="businessName" 
                    placeholder="לדוגמה: חנות הבגדים שלי"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessType">סוג העסק</label>
                  <select id="businessType" name="businessType" required>
                    <option value="">בחר סוג עסק</option>
                    <option value="retail">חנות/קמעונאות</option>
                    <option value="restaurant">מסעדה/בית קפה</option>
                    <option value="service">שירותים</option>
                    <option value="professional">מקצועי/ייעוץ</option>
                    <option value="beauty">יופי וטיפוח</option>
                    <option value="fitness">כושר ובריאות</option>
                    <option value="education">חינוך והדרכה</option>
                    <option value="other">אחר</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>האם זה חנות מקוונת?</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="isStore" value="yes" />
                      כן, אני רוצה למכור מוצרים
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="isStore" value="no" />
                      לא, אתר תדמית בלבד
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessDescription">תאר את העסק שלך</label>
                  <textarea 
                    id="businessDescription" 
                    name="businessDescription" 
                    rows="4"
                    placeholder="ספר לנו על העסק שלך, מה אתה מציע, מה הייחודיות שלך..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'יוצר תצוגה מקדימה...' : 'צור תצוגה מקדימה של האתר'}
                </button>
              </form>
            </div>
            
            <div className="ai-preview-section">
              {isGenerating ? (
                <div className="ai-preview-placeholder">
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>🤖</div>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>יוצר את האתר שלך...</p>
                    <p>זה יכול לקחת כמה רגעים</p>
                  </div>
                </div>
              ) : generatedWebsite ? (
                <div className="ai-preview-content">
                  {/* תמונות שנוצרו על ידי AI */}
                  {aiPreview.images && aiPreview.images.length > 0 ? (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-dark)', fontSize: '1.5rem' }}>
                        תמונות האתר שנוצרו על ידי AI
                      </h3>
                      <div className="ai-images-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: '1.5rem',
                        marginBottom: '2rem'
                      }}>
                        {aiPreview.images.map((img, index) => (
                          <div key={index} style={{
                            border: '2px solid var(--border-color)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            background: 'white',
                            minHeight: '300px'
                          }}>
                            {img.url ? (
                              <img 
                                src={img.url} 
                                alt={img.title}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  display: 'block',
                                  minHeight: '250px',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  console.error('שגיאה בטעינת תמונה:', img.url)
                                  e.target.style.display = 'none'
                                  const errorDiv = document.createElement('div')
                                  errorDiv.style.cssText = 'padding: 2rem; text-align: center; color: var(--text-light);'
                                  errorDiv.textContent = 'תמונה לא נטענה'
                                  e.target.parentElement.appendChild(errorDiv)
                                }}
                                onLoad={() => console.log('תמונה נטענה בהצלחה:', img.url)}
                              />
                            ) : (
                              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                תמונה לא זמינה
                              </div>
                            )}
                            <div style={{
                              padding: '1rem',
                              textAlign: 'center',
                              background: 'var(--bg-section)',
                              fontWeight: '600',
                              color: 'var(--text-dark)'
                            }}>
                              {img.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ color: '#856404', margin: 0 }}>
                        תמונות לא נוצרו. ודא שיש לך API key תקין של OpenAI ב-.env
                      </p>
                    </div>
                  )}
                  
                  <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-dark)' }}>
                    האתר שלך מוכן! נסה אותו עכשיו
                  </h3>
                  <div style={{ 
                    border: '2px solid var(--border-color)', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}>
                    <AIGeneratedWebsite businessData={generatedWebsite} />
                  </div>
                  <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="#contact" className="btn btn-primary">
                      רוצה אתר כזה? צור קשר
                    </a>
                  </div>
                </div>
              ) : (
                <div className="ai-preview-placeholder">
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
                    <p>מלא את הפרטים למעלה ואנחנו נבנה לך אתר לדוגמה</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      תוכל לנסות את האתר, לעיין במוצרים, להוסיף לעגלה ולהזמין
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">בואו נתחיל לעבוד יחד</h2>
          <p className="section-subtitle">
            מוכנים לבנות את האתר המושלם לעסק שלכם? צרו איתנו קשר עוד היום
          </p>
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">שם מלא</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">אימייל</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">טלפון</label>
                <input type="tel" id="phone" name="phone" />
              </div>
              <div className="form-group">
                <label htmlFor="message">הודעה</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'שולח...' : 'שלח הודעה'}
              </button>
              {submitMessage && (
                <div 
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: submitMessage.includes('תודה') ? '#d1fae5' : '#fee2e2',
                    color: submitMessage.includes('תודה') ? '#065f46' : '#991b1b',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  {submitMessage}
                </div>
              )}
            </form>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a 
                href="https://wa.me/972549329225?text=שלום!%20אני%20מעוניין/ת%20בשירותי%20בניית%20אתרים%20לעסק%20שלי.%20אשמח%20לקבל%20פרטים%20נוספים%20על%20השירותים%20והמחירים." 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '0.5rem' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                שלח הודעה בוואטסאפ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

