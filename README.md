# InFast CRM

O'quv markazlar uchun CRM tizimi - **Muhammadaziz Yakubov** tomonidan yaratilgan.

## 🚀 Xususiyatlar

- 📊 **Dashboard** - Umumiy statistika va ko'rsatkichlar
- 📚 **Kurslar** - Kurslarni boshqarish
- 👥 **Guruhlar** - Guruhlarni yaratish va boshqarish
- 🎓 **O'quvchilar** - O'quvchilarni ro'yxatga olish
- 💰 **To'lovlar** - To'lovlarni kuzatish
- 📋 **Davomat** - Davomatni belgilash
- 🏆 **Reyting** - O'quvchilar reytingi
- 👨‍💼 **Xodimlar** - Xodimlarni boshqarish

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
MONGODB_URI=mongodb://localhost:27017/infast-crm
JWT_SECRET=your-super-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Client (.env fayl yarating `client/` papkasida - ixtiyoriy):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Loyihani ishga tushirish
```bash
npm run dev
```

Bu buyruq backend (port 5000) va frontend (port 3000) ni bir vaqtda ishga tushiradi.

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
