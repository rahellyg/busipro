# הגדרת AI לבניית אתרים

המערכת תומכת בשימוש ב-AI חיצוני ליצירת תוכן מותאם לאתרים. יש לך 3 אפשרויות:

## אפשרויות AI

### 1. OpenAI (מומלץ - הכי נפוץ)
- **יתרונות**: מהיר, זול יחסית, תוצאות טובות
- **מחיר**: ~$0.15 לכל 1M tokens (GPT-4o-mini)
- **קישור**: https://platform.openai.com/api-keys

### 2. Anthropic Claude
- **יתרונות**: איכות גבוהה, בטיחות טובה
- **מחיר**: ~$3 לכל 1M tokens (Claude 3.5 Sonnet)
- **קישור**: https://console.anthropic.com/

### 3. Google Gemini
- **יתרונות**: חינמי עד גבול מסוים
- **מחיר**: חינמי עד 60 requests/דקה
- **קישור**: https://makersuite.google.com/app/apikey

## התקנה

### שלב 1: קבלת API Key

בחר אחד מהספקים למעלה וצור API Key.

### שלב 2: יצירת קובץ .env

צור קובץ `.env` בתיקיית הפרויקט והוסף:

**לשימוש ב-OpenAI:**
```env
VITE_OPENAI_API_KEY=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
VITE_AI_PROVIDER=openai
```

**לשימוש ב-Claude:**
```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
VITE_AI_PROVIDER=claude
```

**לשימוש ב-Gemini:**
```env
VITE_GEMINI_API_KEY=your-api-key-here
VITE_AI_PROVIDER=gemini
```

### שלב 3: הפעלה מחדש

הפעל מחדש את שרת הפיתוח:
```bash
npm run dev
```

## איך זה עובד?

1. המשתמש ממלא טופס עם פרטי העסק
2. המערכת שולחת את הנתונים ל-AI
3. ה-AI יוצר תוכן מותאם:
   - כותרות מותאמות
   - תכונות רלוונטיות
   - מוצרים (אם זה חנות)
   - טקסט אודות העסק
   - הצעת צבעים
4. התוכן מוצג באתר שנוצר

## ללא API Key

אם אין API Key, המערכת תשתמש בנתונים בסיסיים שהמשתמש הזין (ללא תוכן מותאם מ-AI).

## אבטחה

⚠️ **חשוב**: לעולם אל תעלה את קובץ `.env` ל-GitHub!
- הקובץ `.env` כבר ב-`.gitignore`
- השתמש ב-`.env.example` לדוגמה בלבד

## פתרון בעיות

### שגיאה: "API Key לא נמצא"
- ודא שיצרת קובץ `.env` בתיקיית הפרויקט
- ודא שהשם של המשתנה נכון (VITE_OPENAI_API_KEY וכו')
- הפעל מחדש את שרת הפיתוח

### שגיאה: "שגיאה ב-API"
- ודא שה-API Key תקף
- בדוק שיש לך יתרה/קרדיט בחשבון
- בדוק את ה-console לדברי שגיאה מפורטים

### התוכן לא בעברית
- ה-AI צריך להבין שהוא צריך להחזיר תוכן בעברית
- אם יש בעיה, נסה לשנות את ה-prompt ב-`src/services/aiService.js`

## עלויות משוערות

**OpenAI GPT-4o-mini:**
- ~$0.15 לכל 1M tokens
- כל אתר = ~2,000-5,000 tokens
- **עלות לאתר**: ~$0.001-0.0015

**Claude 3.5 Sonnet:**
- ~$3 לכל 1M tokens
- כל אתר = ~2,000-5,000 tokens
- **עלות לאתר**: ~$0.006-0.015

**Gemini:**
- חינמי עד 60 requests/דקה
- **עלות לאתר**: חינם (עד גבול)

## שיפור התוצאות

אפשר לשפר את התוצאות על ידי:
1. שינוי ה-prompt ב-`src/services/aiService.js`
2. שימוש במודל יותר מתקדם (GPT-4 במקום GPT-4o-mini)
3. הוספת דוגמאות ב-prompt
4. התאמת ה-temperature (0.7 = יצירתי, 0.3 = מדויק יותר)

