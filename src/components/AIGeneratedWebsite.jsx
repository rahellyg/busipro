import React, { useState } from 'react'
import './AIGeneratedWebsite.css'

function AIGeneratedWebsite({ businessData }) {
  const [cart, setCart] = useState([])
  const [activeTab, setActiveTab] = useState('home')
  const { 
    businessName, 
    businessType, 
    businessDescription, 
    isStore,
    heroTitle,
    heroSubtitle,
    features,
    products: aiProducts,
    services: aiServices,
    aboutText
  } = businessData

  // פונקציה לקבלת תמונה רלוונטית לפי התיאור
  const getRelevantImage = (keyword, type = 'product') => {
    // שילוב שם העסק, תיאור העסק והמילה הנוכחית
    const searchText = `${businessName} ${businessDescription} ${keyword}`.toLowerCase()
    
    // מיפוי מילות מפתח לתמונות Unsplash (עם עדיפות גבוהה יותר)
    const imageMap = {
      // אלקטרוניקה וטכנולוגיה (עדיפות גבוהה)
      'טלפון': 'smartphone',
      'טלפונים': 'smartphone',
      'סמארטפון': 'smartphone',
      'סמארטפונים': 'smartphone',
      'אייפון': 'iphone',
      'אנדרואיד': 'android',
      'מכשיר': 'smartphone',
      'מכשירים': 'smartphone',
      'מחשב': 'computer',
      'מחשבים': 'computer',
      'לפטופ': 'laptop',
      'מחשב נייד': 'laptop',
      'טאבלט': 'tablet',
      'אייפד': 'ipad',
      'מסך': 'monitor',
      'מקלדת': 'keyboard',
      'עכבר': 'mouse',
      'אוזניות': 'headphones',
      'טכנולוגיה': 'technology',
      'אלקטרוניקה': 'electronics',
      'גאדג\'ט': 'gadget',
      'גאדג\'טים': 'gadgets',
      'מובייל': 'mobile',
      'סלולר': 'mobile',
      'סלולרי': 'mobile',
      
      // אוכל ומסעדות
      'אוכל': 'food',
      'מסעדה': 'restaurant',
      'בית קפה': 'coffee',
      'פיצה': 'pizza',
      'המבורגר': 'burger',
      'סלט': 'salad',
      'קינוח': 'dessert',
      
      // אופנה
      'בגד': 'fashion',
      'נעל': 'shoes',
      'תיק': 'bag',
      'שמלה': 'dress',
      'חולצה': 'shirt',
      
      // יופי וטיפוח
      'יופי': 'beauty',
      'טיפול': 'spa',
      'קוסמטיקה': 'cosmetics',
      'שיער': 'hair',
      'עור': 'skincare',
      
      // כושר
      'כושר': 'fitness',
      'אימון': 'workout',
      'יוגה': 'yoga',
      'ריצה': 'running',
      
      // שירותים
      'שירות': 'service',
      'ייעוץ': 'consulting',
      'עיצוב': 'design',
      'תכנות': 'coding',
      
      // כללי
      'מוצר': 'product',
      'חנות': 'shop'
    }
    
    // חיפוש מילת מפתח בטקסט המלא (שם העסק + תיאור + מילה נוכחית)
    let imageKeyword = null
    let priority = 0
    
    // חיפוש לפי סדר עדיפות - מילים ספציפיות קודם
    for (const [key, value] of Object.entries(imageMap)) {
      if (searchText.includes(key)) {
        // מילים טכנולוגיות מקבלות עדיפות
        const techPriority = ['טלפון', 'טלפונים', 'מחשב', 'מחשבים', 'סמארטפון', 'סמארטפונים', 'לפטופ', 'מכשיר', 'מכשירים', 'סלולר', 'סלולרי'].includes(key) ? 10 : 1
        if (techPriority > priority) {
          imageKeyword = value
          priority = techPriority
        }
      }
    }
    
    // אם לא נמצא, נשתמש בסוג העסק
    if (!imageKeyword) {
      const typeMap = {
        'retail': 'shopping',
        'restaurant': 'food',
        'beauty': 'beauty',
        'fitness': 'fitness',
        'service': 'business',
        'professional': 'office',
        'education': 'education'
      }
      imageKeyword = typeMap[businessType] || 'product'
    }
    
    // אם עדיין לא נמצא, נבדוק אם יש מילות מפתח בטקסט
    if (!imageKeyword || imageKeyword === 'product') {
      if (searchText.includes('טלפון') || searchText.includes('מכשיר') || searchText.includes('סלולר') || searchText.includes('מובייל')) {
        imageKeyword = 'smartphone'
      } else if (searchText.includes('מחשב') || searchText.includes('לפטופ')) {
        imageKeyword = 'laptop'
      }
    }
    
    // החזרת URL של תמונה מ-Unsplash עם מילות מפתח משופרות
    const unsplashUrl = `https://source.unsplash.com/featured/400x300/?${imageKeyword}&sig=${Math.random()}`
    console.log('חיפוש תמונה:', { searchText, imageKeyword, unsplashUrl })
    return unsplashUrl
  }

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price || 0), 0)
  }

  // דף בית
  const HomePage = () => (
    <div className={`ai-website-page ai-page-full`}>
      <div className="ai-hero-section" style={{ 
        backgroundImage: `url(${getRelevantImage(businessName + ' ' + businessDescription, 'hero')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1>{heroTitle || businessName}</h1>
          <p>{heroSubtitle || businessDescription}</p>
          {isStore && (
            <button className="ai-btn-primary" onClick={() => setActiveTab('products')}>
              צפה במוצרים שלנו
            </button>
          )}
        </div>
      </div>
      
      <div className="ai-content-section">
        <h2>ברוכים הבאים ל-{businessName}</h2>
        <p>{businessDescription}</p>
        
        <div className="ai-features-grid">
          {features && features.length > 0 ? (
            features.map((feature, index) => (
              <div key={index} className="ai-feature-card">
                <div className="ai-feature-icon">{feature.icon || '⭐'}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))
          ) : businessType === 'retail' && (
            <>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">🛍️</div>
                <h3>מגוון רחב</h3>
                <p>מבחר גדול של מוצרים איכותיים</p>
              </div>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">🚚</div>
                <h3>משלוח מהיר</h3>
                <p>משלוח מהיר עד הבית</p>
              </div>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">💳</div>
                <h3>תשלום בטוח</h3>
                <p>אמצעי תשלום מגוונים ובטוחים</p>
              </div>
            </>
          )}
          {businessType === 'restaurant' && (
            <>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">🍽️</div>
                <h3>מנות טעימות</h3>
                <p>מנות טריות וטעימות מדי יום</p>
              </div>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">🚚</div>
                <h3>משלוחים</h3>
                <p>משלוח מהיר עד הבית</p>
              </div>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">⭐</div>
                <h3>ביקורות מעולות</h3>
                <p>לקוחות מרוצים וממליצים</p>
              </div>
            </>
          )}
          {!isStore && businessType !== 'retail' && businessType !== 'restaurant' && (
            <>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">⭐</div>
                <h3>שירות מקצועי</h3>
                <p>אנחנו מתמחים במתן שירות איכותי ומקצועי</p>
              </div>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">🚀</div>
                <h3>מהיר ויעיל</h3>
                <p>שירות מהיר ויעיל עם תוצאות מעולות</p>
              </div>
              <div className="ai-feature-card">
                <div className="ai-feature-icon">💎</div>
                <h3>איכות גבוהה</h3>
                <p>אנחנו מתחייבים לאיכות הגבוהה ביותר</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  // דף מוצרים (אם זה חנות)
  const ProductsPage = () => {
    // אם יש מוצרים מה-AI, נשתמש בהם
    if (aiProducts && aiProducts.length > 0) {
      return (
        <div className={`ai-website-page ai-page-full`}>
          <div className="ai-page-header">
            <h1>המוצרים שלנו</h1>
          </div>
          
          <div className="ai-products-grid">
            {aiProducts.map((product) => (
              <div key={product.id} className="ai-product-card">
                <div className="ai-product-image">
                  <img 
                    src={getRelevantImage(product.name + ' ' + product.description + ' ' + businessDescription, 'product')}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      console.error('שגיאה בטעינת תמונת מוצר:', product.name, e.target.src)
                      e.target.style.display = 'none'
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex'
                      }
                    }}
                    onLoad={() => console.log('תמונת מוצר נטענה:', product.name)}
                  />
                  <div className="ai-product-placeholder" style={{ display: 'none' }}>🛍️</div>
                </div>
                <div className="ai-product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="ai-product-footer">
                    <span className="ai-product-price">{product.price}₪</span>
                    <button 
                      className="ai-btn-add-cart"
                      onClick={() => addToCart(product)}
                    >
                      הוסף לעגלה
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {cart.length > 0 && (
            <div className="ai-cart-badge" onClick={() => setActiveTab('cart')}>
              עגלת קניות ({cart.length}) - לחץ כאן לראות את העגלה
            </div>
          )}
        </div>
      )
    }
    
    // אחרת, נשתמש במוצרים ברירת מחדל
    const getProductsByType = () => {
      const productTypes = {
        retail: [
          { id: 1, name: 'מוצר איכותי', price: 99, description: 'מוצר איכותי ומעוצב' },
          { id: 2, name: 'מוצר מומלץ', price: 149, description: 'מוצר מודרני ונוח' },
          { id: 3, name: 'מוצר פרימיום', price: 199, description: 'מוצר יוקרתי ואיכותי' },
          { id: 4, name: 'מוצר מיוחד', price: 249, description: 'מוצר מיוחד וייחודי' },
        ],
        restaurant: [
          { id: 1, name: 'מנה ראשונה', price: 45, description: 'מנה טעימה ומשביעה' },
          { id: 2, name: 'מנה עיקרית', price: 89, description: 'מנה עשירה וטעימה' },
          { id: 3, name: 'קינוח', price: 35, description: 'קינוח מתוק ומפנק' },
          { id: 4, name: 'משקה', price: 25, description: 'משקה מרענן' },
        ],
        beauty: [
          { id: 1, name: 'טיפול פנים', price: 199, description: 'טיפול פנים מקצועי ומפנק' },
          { id: 2, name: 'טיפול שיער', price: 149, description: 'טיפול שיער מקצועי' },
          { id: 3, name: 'טיפול גוף', price: 249, description: 'טיפול גוף מרגיע' },
          { id: 4, name: 'טיפול מיוחד', price: 299, description: 'טיפול יוקרתי' },
        ],
        fitness: [
          { id: 1, name: 'חבילת כושר חודשית', price: 199, description: 'גישה מלאה למתקנים' },
          { id: 2, name: 'שיעור פרטי', price: 150, description: 'שיעור כושר אישי' },
          { id: 3, name: 'חבילת תזונה', price: 299, description: 'תוכנית תזונה מותאמת' },
          { id: 4, name: 'חבילת VIP', price: 499, description: 'חבילה מלאה כולל הכל' },
        ],
        default: [
          { id: 1, name: 'שירות בסיסי', price: 299, description: 'שירות מקצועי ואיכותי' },
          { id: 2, name: 'שירות מתקדם', price: 499, description: 'שירות מקיף ומקצועי' },
          { id: 3, name: 'שירות פרימיום', price: 799, description: 'שירות מלא ויוקרתי' },
          { id: 4, name: 'שירות VIP', price: 1299, description: 'שירות יוקרתי עם ליווי אישי' },
        ]
      }
      
      return productTypes[businessType] || productTypes.default
    }
    
    const products = getProductsByType()

    return (
      <div className={`ai-website-page ai-page-full`}>
        <div className="ai-page-header">
          <h1>המוצרים שלנו</h1>
        </div>
        
        <div className="ai-products-grid">
          {products.map((product) => (
            <div key={product.id} className="ai-product-card">
              <div className="ai-product-image">
                <img 
                  src={getRelevantImage(product.name + ' ' + product.description + ' ' + businessDescription, 'product')}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    console.error('שגיאה בטעינת תמונת מוצר:', product.name, e.target.src)
                    e.target.style.display = 'none'
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex'
                    }
                  }}
                  onLoad={() => console.log('תמונת מוצר נטענה:', product.name)}
                />
                <div className="ai-product-placeholder" style={{ display: 'none' }}>🛍️</div>
              </div>
              <div className="ai-product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="ai-product-footer">
                  <span className="ai-product-price">{product.price}₪</span>
                  <button 
                    className="ai-btn-add-cart"
                    onClick={() => addToCart(product)}
                  >
                    הוסף לעגלה
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {cart.length > 0 && (
          <div className="ai-cart-badge" onClick={() => setActiveTab('cart')}>
            עגלת קניות ({cart.length}) - לחץ כאן לראות את העגלה
          </div>
        )}
      </div>
    )
  }

  // דף שירותים (אם זה אתר תדמית)
  const ServicesPage = () => {
    // אם יש שירותים מה-AI, נשתמש בהם
    if (aiServices && aiServices.length > 0) {
      return (
        <div className={`ai-website-page ai-page-full`}>
          <div className="ai-page-header">
            <h1>השירותים שלנו</h1>
          </div>
          
          <div className="ai-products-grid">
            {aiServices.map((service) => (
              <div key={service.id} className="ai-product-card">
                <div className="ai-product-image">
                  <img 
                    src={getRelevantImage(service.name + ' ' + service.description + ' ' + businessDescription, 'service')}
                    alt={service.name}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="ai-product-placeholder" style={{ display: 'none' }}>💼</div>
                </div>
                <div className="ai-product-info">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="ai-product-footer">
                    <button className="ai-btn-add-cart">
                      צור קשר
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    // אחרת, נשתמש בנתונים ברירת מחדל
    return (
      <div className={`ai-website-page ai-page-full`}>
        <div className="ai-page-header">
          <h1>השירותים שלנו</h1>
        </div>
        <div className="ai-content-section">
          <p>אנחנו מציעים מגוון שירותים מקצועיים מותאמים לצרכים שלך.</p>
          {aboutText && (
            <div style={{ marginTop: '2rem' }}>
              <h3>אודותינו</h3>
              <p>{aboutText}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // דף עגלת קניות
  const CartPage = () => (
    <div className={`ai-website-page ai-page-full`}>
      <div className="ai-page-header">
        <h1>עגלת הקניות</h1>
      </div>
      
      {cart.length === 0 ? (
        <div className="ai-empty-cart">
          <p>העגלה שלך ריקה</p>
          <button className="ai-btn-primary" onClick={() => setActiveTab('products')}>
            המשך לקניות
          </button>
        </div>
      ) : (
        <>
          <div className="ai-cart-items">
            {cart.map((item, index) => (
              <div key={index} className="ai-cart-item">
                <div className="ai-cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.price}₪</p>
                </div>
                <button 
                  className="ai-btn-remove"
                  onClick={() => removeFromCart(index)}
                >
                  הסר
                </button>
              </div>
            ))}
          </div>
          
          <div className="ai-cart-summary">
            <div className="ai-cart-total">
              <span>סה"כ: {getTotalPrice()}₪</span>
            </div>
            <button className="ai-btn-checkout">
              המשך לתשלום
            </button>
          </div>
        </>
      )}
    </div>
  )

  const pages = [
    { id: 'home', name: 'דף בית', component: <HomePage /> },
    ...(isStore ? [
      { id: 'products', name: 'דף מוצרים', component: <ProductsPage /> },
      { id: 'cart', name: 'עגלת קניות', component: <CartPage /> }
    ] : [
      { id: 'services', name: 'השירותים שלנו', component: <ServicesPage /> }
    ])
  ]

  // קביעת עיצוב לפי סוג העסק
  const getThemeClass = () => {
    const themes = {
      retail: 'theme-retail',
      restaurant: 'theme-restaurant',
      beauty: 'theme-beauty',
      fitness: 'theme-fitness',
      service: 'theme-service',
      professional: 'theme-professional',
      education: 'theme-education',
      other: 'theme-default'
    }
    return themes[businessType] || themes.other
  }

  return (
    <div className={`ai-generated-website ${getThemeClass()}`}>
      <div className="ai-website-header">
        <h2 className="ai-website-title">{businessName}</h2>
        <p className="ai-website-subtitle">תצוגה מקדימה של האתר שלך - כל דף בנפרד</p>
      </div>
      
      <div className="ai-pages-tabs">
        {pages.map((page) => (
          <button
            key={page.id}
            className={`ai-tab-button ${activeTab === page.id ? 'active' : ''}`}
            onClick={() => setActiveTab(page.id)}
          >
            {page.name}
            {page.id === 'cart' && cart.length > 0 && (
              <span className="ai-cart-count">{cart.length}</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="ai-website-content">
        <div className="ai-page-container">
          {pages.find(p => p.id === activeTab)?.component}
        </div>
      </div>
    </div>
  )
}

export default AIGeneratedWebsite

