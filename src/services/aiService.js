// שירות ליצירת אתרים באמצעות AI חיצוני
// תמיכה ב-OpenAI, Anthropic Claude, או Google Gemini

/**
 * יצירת אתר באמצעות OpenAI API
 * @param {string} businessName - שם העסק
 * @param {string} businessType - סוג העסק
 * @param {string} businessDescription - תיאור העסק
 * @param {boolean} isStore - האם זה חנות מקוונת
 * @returns {Promise<Object>} נתוני האתר שנוצר
 */
export async function generateWebsiteWithOpenAI(businessName, businessType, businessDescription, isStore) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenAI API Key לא נמצא. אנא הוסף VITE_OPENAI_API_KEY ל-.env')
  }

  // יצירת prompt מותאם לפי סוג העסק
  const getBusinessTypeDescription = (type) => {
    const types = {
      'retail': 'חנות/קמעונאות - מכירת מוצרים פיזיים',
      'restaurant': 'מסעדה/בית קפה - שירותי אוכל ומשקאות',
      'service': 'שירותים - מתן שירותים מקצועיים',
      'professional': 'מקצועי/ייעוץ - שירותי ייעוץ מקצועיים',
      'beauty': 'יופי וטיפוח - שירותי יופי, טיפוח וקוסמטיקה',
      'fitness': 'כושר ובריאות - שירותי כושר, אימונים ובריאות',
      'education': 'חינוך והדרכה - שירותי חינוך, קורסים והדרכות',
      'other': 'עסק כללי'
    }
    return types[type] || types['other']
  }

  const businessTypeDesc = getBusinessTypeDescription(businessType)
  
  const prompt = `אתה מומחה בבניית אתרים בעברית. צור תוכן מקצועי ומותאם לאתר עבור העסק הבא:

שם העסק: ${businessName}
סוג עסק: ${businessTypeDesc} (${businessType})
תיאור העסק: ${businessDescription}
חנות מקוונת: ${isStore ? 'כן - יש למכור מוצרים באתר' : 'לא - אתר תדמית בלבד'}

צור JSON עם המבנה הבא (חובה להחזיר JSON תקף בלבד):
{
  "businessName": "${businessName}",
  "businessType": "${businessType}",
  "businessDescription": "${businessDescription}",
  "isStore": ${isStore},
  "heroTitle": "כותרת ראשית מקצועית וקולעת (2-5 מילים)",
  "heroSubtitle": "תת-כותרת מפורטת יותר שמסבירה את הערך המוצע (10-20 מילים)",
  "features": [
    {"icon": "emoji רלוונטי", "title": "כותרת תכונה מקצועית", "description": "תיאור תכונה מפורט ורלוונטי לעסק"},
    {"icon": "emoji רלוונטי", "title": "כותרת תכונה מקצועית", "description": "תיאור תכונה מפורט ורלוונטי לעסק"},
    {"icon": "emoji רלוונטי", "title": "כותרת תכונה מקצועית", "description": "תיאור תכונה מפורט ורלוונטי לעסק"}
  ],
  "products": ${isStore ? `[
    {"id": 1, "name": "שם מוצר רלוונטי", "price": מספר מחיר ריאלי, "description": "תיאור מוצר מפורט"},
    {"id": 2, "name": "שם מוצר רלוונטי", "price": מספר מחיר ריאלי, "description": "תיאור מוצר מפורט"},
    {"id": 3, "name": "שם מוצר רלוונטי", "price": מספר מחיר ריאלי, "description": "תיאור מוצר מפורט"},
    {"id": 4, "name": "שם מוצר רלוונטי", "price": מספר מחיר ריאלי, "description": "תיאור מוצר מפורט"}
  ]` : '[]'},
  "services": ${!isStore ? `[
    {"id": 1, "name": "שם שירות רלוונטי", "description": "תיאור שירות מפורט"},
    {"id": 2, "name": "שם שירות רלוונטי", "description": "תיאור שירות מפורט"},
    {"id": 3, "name": "שם שירות רלוונטי", "description": "תיאור שירות מפורט"}
  ]` : '[]'},
  "aboutText": "טקסט אודות העסק - 2-3 משפטים מפורטים שמסבירים על העסק, הייחודיות שלו, הניסיון והערך שהוא מביא ללקוחות",
  "colorScheme": {
    "primary": "#hex - צבע ראשי מותאם לסוג העסק",
    "secondary": "#hex - צבע משני משלים",
    "accent": "#hex - צבע דגש"
  }
}

חשוב מאוד:
- השתמש בעברית בלבד
- התאם את התוכן בדיוק לסוג העסק ולתיאור שניתן
- אם זה חנות - צור מוצרים רלוונטיים ומחירים ריאליים
- אם זה שירות - צור שירותים רלוונטיים ומפורטים
- הכותרות והתיאורים צריכים להיות מקצועיים, משכנעים ורלוונטיים
- הצבעים צריכים להתאים לסוג העסק (למשל: מסעדה - אדום/כתום, יופי - ורוד/סגול, כושר - כחול/ירוק)`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // או 'gpt-4' ליותר איכות
        messages: [
          {
            role: 'system',
            content: 'אתה מומחה בבניית אתרים בעברית. תמיד החזר JSON תקף בלבד.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'שגיאה ב-OpenAI API')
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    
    // ניקוי ופענוח JSON
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const websiteData = JSON.parse(cleanContent)
    
    return websiteData
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    throw error
  }
}

/**
 * יצירת אתר באמצעות Anthropic Claude API
 */
export async function generateWebsiteWithClaude(businessName, businessType, businessDescription, isStore) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  
  if (!apiKey) {
    throw new Error('Anthropic API Key לא נמצא. אנא הוסף VITE_ANTHROPIC_API_KEY ל-.env')
  }

  const prompt = `אתה מומחה בבניית אתרים. צור תוכן לאתר עבור העסק הבא:

שם העסק: ${businessName}
סוג עסק: ${businessType}
תיאור: ${businessDescription}
חנות מקוונת: ${isStore ? 'כן' : 'לא'}

צור JSON עם המבנה הבא:
{
  "businessName": "${businessName}",
  "businessType": "${businessType}",
  "businessDescription": "${businessDescription}",
  "isStore": ${isStore},
  "heroTitle": "כותרת ראשית מותאמת",
  "heroSubtitle": "תת-כותרת מותאמת",
  "features": [...],
  "products": ${isStore ? '[...]' : '[]'},
  "aboutText": "טקסט אודות העסק",
  "colorScheme": {"primary": "#hex", "secondary": "#hex", "accent": "#hex"}
}

השתמש בעברית בלבד.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'שגיאה ב-Anthropic API')
    }

    const data = await response.json()
    const content = data.content[0].text
    
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const websiteData = JSON.parse(cleanContent)
    
    return websiteData
  } catch (error) {
    console.error('Error calling Anthropic:', error)
    throw error
  }
}

/**
 * יצירת אתר באמצעות Google Gemini API
 */
export async function generateWebsiteWithGemini(businessName, businessType, businessDescription, isStore) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error('Gemini API Key לא נמצא. אנא הוסף VITE_GEMINI_API_KEY ל-.env')
  }

  const prompt = `אתה מומחה בבניית אתרים. צור תוכן לאתר עבור העסק הבא:

שם העסק: ${businessName}
סוג עסק: ${businessType}
תיאור: ${businessDescription}
חנות מקוונת: ${isStore ? 'כן' : 'לא'}

צור JSON עם המבנה הבא:
{
  "businessName": "${businessName}",
  "businessType": "${businessType}",
  "businessDescription": "${businessDescription}",
  "isStore": ${isStore},
  "heroTitle": "כותרת ראשית מותאמת",
  "heroSubtitle": "תת-כותרת מותאמת",
  "features": [...],
  "products": ${isStore ? '[...]' : '[]'},
  "aboutText": "טקסט אודות העסק",
  "colorScheme": {"primary": "#hex", "secondary": "#hex", "accent": "#hex"}
}

השתמש בעברית בלבד.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'שגיאה ב-Gemini API')
    }

    const data = await response.json()
    const content = data.candidates[0].content.parts[0].text
    
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const websiteData = JSON.parse(cleanContent)
    
    return websiteData
  } catch (error) {
    console.error('Error calling Gemini:', error)
    throw error
  }
}

/**
 * יצירת תמונות של האתר באמצעות DALL-E
 * @param {string} businessName - שם העסק
 * @param {string} businessDescription - תיאור העסק
 * @param {string} businessType - סוג העסק
 * @param {boolean} isStore - האם זה חנות
 * @returns {Promise<Object>} אובייקט עם 3 תמונות: catalog/catalog, cart/services, promotions/about
 */
export async function generateWebsiteImages(businessName, businessDescription, businessType, isStore) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenAI API Key לא נמצא. אנא הוסף VITE_OPENAI_API_KEY ל-.env')
  }

  const basePrompt = `Modern professional website in Hebrew for ${businessName}. ${businessDescription}. Clean, modern, professional design.`

  // יצירת prompts מותאמים לפי סוג העסק
  let imagePrompts = {}
  
  if (isStore) {
    // אם זה חנות - קטלוג, עגלה, מבצעים
    imagePrompts = {
      catalog: `${basePrompt} Product catalog page with grid of products, each product with image, name and price. Clean organized layout. Hebrew text.`,
      cart: `${basePrompt} Shopping cart page with list of products, quantities, total price and checkout button. Clear and user-friendly design. Hebrew text.`,
      promotions: `${basePrompt} Promotions page with discount banners, special offers, product images on sale. Attractive and colorful design. Hebrew text.`
    }
  } else {
    // אם זה אתר תדמית - דף שירותים, דף אודות, דף צור קשר
    imagePrompts = {
      catalog: `${basePrompt} Services page showing different services offered, each service with icon, title and description. Professional layout. Hebrew text.`,
      cart: `${basePrompt} About us page with company information, mission, values and team. Professional and trustworthy design. Hebrew text.`,
      promotions: `${basePrompt} Contact page with contact form, phone, email, address and map. Clean and accessible design. Hebrew text.`
    }
  }

  const images = {}

  try {
    // יצירת 3 תמונות במקביל
    const imagePromises = Object.entries(imagePrompts).map(async ([key, prompt]) => {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'שגיאה ב-DALL-E API')
      }

      const data = await response.json()
      return { key, url: data.data[0].url }
    })

    const results = await Promise.all(imagePromises)
    
    results.forEach(({ key, url }) => {
      images[key] = url
    })

    return images
  } catch (error) {
    console.error('Error generating images:', error)
    throw error
  }
}

/**
 * פונקציה ראשית - בוחרת את ה-API לפי הגדרות
 */
export async function generateWebsite(businessName, businessType, businessDescription, isStore) {
  const aiProvider = import.meta.env.VITE_AI_PROVIDER || 'openai' // 'openai', 'claude', 'gemini'
  
  try {
    switch (aiProvider.toLowerCase()) {
      case 'openai':
        return await generateWebsiteWithOpenAI(businessName, businessType, businessDescription, isStore)
      case 'claude':
      case 'anthropic':
        return await generateWebsiteWithClaude(businessName, businessType, businessDescription, isStore)
      case 'gemini':
      case 'google':
        return await generateWebsiteWithGemini(businessName, businessType, businessDescription, isStore)
      default:
        throw new Error(`Provider לא נתמך: ${aiProvider}`)
    }
  } catch (error) {
    console.error('Error generating website:', error)
    throw error
  }
}

