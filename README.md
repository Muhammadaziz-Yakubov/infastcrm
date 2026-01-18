# InFast CRM

O'quv markazlar uchun CRM tizimi - **Muhammadaziz Yakubov** tomonidan yaratilgan.

## 🚀 Xususiyatlar

### CRM Tizimi
- 📊 **Dashboard** - Umumiy statistika va ko'rsatkichlar
- 📚 **Kurslar** - Kurslarni boshqarish
- 👥 **Guruhlar** - Guruhlarni yaratish va boshqarish
- 🎓 **O'quvchilar** - O'quvchilarni ro'yxatga olish
- 💰 **To'lovlar** - To'lovlarni kuzatish
- 📋 **Davomat** - Davomatni belgilash
- 🏆 **Reyting** - O'quvchilar reytingi
- 👨‍💼 **Xodimlar** - Xodimlarni boshqarish
- 📝 **Vazifalar** - O'quvchilarga vazifa berish
- 📊 **Imtihonlar** - Testlar va imtihonlar

### Landing Page
- 🏠 **Asosiy sahifa** - InFast Academy taqdimoti
- 📚 **Kurslar** - Barcha kurslar batafsil ma'lumoti
- 👨‍🏫 **O'qituvchilar** - Mentorlar jamoasi
- ℹ️ **Biz haqimizda** - Akademiya haqida ma'lumot
- 📞 **Aloqa** - Bog'lanish uchun forma
- 📰 **Blog** - IT yangiliklari va maqolalar
- 📱 **Responsive** - Barcha qurilmalar uchun mos

## 🛠 Texnologiyalar

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 📦 O'rnatish

### 1. Repozitoriyani klonlash
```bash
git clone https://github.com/your-username/infast-crm.git
cd infast-crm
```

### 2. Barcha dependency'larni o'rnatish
```bash
npm run install-all
```

### 3. Environment o'zgaruvchilarini sozlash

**Server (.env fayl yarating `server/` papkasida):**
```env
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/infast-crm
JWT_SECRET=your-super-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
API_URL=https://your-backend-domain.onrender.com

# Telegram Bot (kursga yozilish uchun bildirishnomalar)
# BotFather'dan token oling: https://t.me/BotFather
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

**Client (.env fayl yarating `client/` papkasida - ixtiyoriy):**
```env
VITE_API_URL=http://localhost:5000
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

**Production uchun (Vercel + Render):**
```env
# Backend (.env)
API_URL=https://your-backend-domain.onrender.com

# Frontend (.env)
VITE_API_URL=https://your-backend-domain.onrender.com
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### 4. Loyihani ishga tushirish
```bash
npm run dev
```

Bu buyruq backend (port 5000) va frontend (port 3000) ni bir vaqtda ishga tushiradi.

## 🎨 Landing Page

Loyiha endi professional landing page bilan keladi:

### Sahifalar:
- **/** - Asosiy landing page
- **/courses** - Kurslar katalogi
- **/about** - Biz haqimizda
- **/team** - O'qituvchilar jamoasi
- **/contact** - Aloqa formasi
- **/blog** - Yangiliklar va maqolalar

### Kursga yozilish:
- Landing page'dan to'g'ridan-to'g'ri kursga yozilish
- Telegram bot orqali avtomatik bildirishnoma
- `-5148910044` guruhiga xabar yuboriladi

### Features:
- Modern, responsive dizayn
- Course registration form
- Team profiles
- Blog system
- Contact forms
- SEO optimized

## 🌐 Deployment

### Render.com (Backend)

1. Render.com da yangi Web Service yarating
2. GitHub repozitoriyangizni ulang
3. Sozlamalar:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Environment Variables qo'shing:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Kuchli random string
   - `FRONTEND_URL` - Vercel frontend URL

### Vercel (Frontend)

1. Vercel da yangi loyiha yarating
2. GitHub repozitoriyangizni ulang
3. Sozlamalar:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Environment Variables qo'shing:
   - `VITE_API_URL` - Render backend URL (masalan: `https://your-app.onrender.com/api`)

## 👤 Default Admin

Loyiha birinchi marta ishga tushganda avtomatik admin user yaratiladi:
- **Email:** muhammadazizyaqubov2@gmail.com
- **Parol:** Azizbek0717

## 📁 Loyiha Strukturasi

```
infast-crm/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Qayta ishlatiladigan komponentlar
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── pages/          # Sahifalar
│   │   └── utils/          # Yordamchi funksiyalar
│   └── vercel.json         # Vercel konfiguratsiyasi
├── server/                 # Backend (Express.js)
│   ├── models/             # Mongoose modellari
│   ├── routes/             # API route'lari
│   ├── middleware/         # Auth middleware
│   └── jobs/               # Cron job'lar
├── render.yaml             # Render.com konfiguratsiyasi
└── package.json            # Root package.json
```

## 📝 API Endpoints

- `POST /api/auth/login` - Admin login
- `POST /api/student-auth/login` - O'quvchi login
- `GET/POST /api/courses` - Kurslar
- `GET/POST /api/groups` - Guruhlar
- `GET/POST /api/students` - O'quvchilar
- `GET/POST /api/payments` - To'lovlar
- `GET/POST /api/attendance` - Davomat
- `GET /api/dashboard` - Dashboard statistikasi

## 🔒 Xavfsizlik

- JWT token asosida autentifikatsiya
- Parollar bcrypt bilan hash qilinadi
- CORS sozlangan
- Role-based access control (ADMIN, MANAGER)

## 📄 Litsenziya

ISC

---

**Muallif:** Muhammadaziz Yakubov  
**Aloqa:** muhammadazizyaqubov2@gmail.com
