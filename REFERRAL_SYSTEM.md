# Referral Tizimi - InfastCRM

## Umumiy Ma'lumot
Coin tizimi o'chirildi. Faqat referral tizimi va avtomatik chegirmalar qoldirildi.

## Backend Arxitektura

### Models

#### 1. Referral Model (`server/models/Referral.js`)
```javascript
{
  referrer_id: ObjectId,        // Taklif qilgan talaba
  friend_id: ObjectId,           // Taklif qilingan talaba (do'st)
  status: String,                // PENDING, ACTIVE, COMPLETED, CANCELLED
  discount_percent: Number,      // Chegirma foizi (default: 20%)
  discount_active: Boolean,      // Chegirma aktiv yoki yo'q
  friend_first_payment_date: Date,
  friend_first_payment_amount: Number,
  total_discount_given: Number,  // Jami berilgan chegirma summasi
  admin_id: ObjectId,            // Qo'shgan admin
  approved_date: Date,
  notes: String
}
```

### Services

#### 1. ReferralService (`server/services/ReferralService.js`)

**Asosiy Metodlar:**

- `createReferral(referrerId, friendId, adminId, notes)` - Yangi referral yaratish
- `approveReferral(referralId, adminId)` - Referralni tasdiqlash
- `handleFriendFirstPayment(friendId, paymentAmount)` - Do'stning birinchi to'lovini qayta ishlash va chegirmani aktivlashtirish
- `calculateReferrerDiscount(referrerId, paymentAmount)` - Referrer uchun chegirmani hisoblash
- `getReferralsByReferrer(referrerId)` - Referrer referrallarini olish
- `getAllReferrals(status)` - Barcha referrallarni olish
- `cancelReferral(referralId, adminId, reason)` - Referralni bekor qilish
- `getStatistics()` - Referral statistikasi

### API Endpoints

#### Admin Endpoints (`/api/referrals`)

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/create` | Yangi referral yaratish |
| POST | `/approve/:id` | Referralni tasdiqlash |
| POST | `/cancel/:id` | Referralni bekor qilish |
| GET | `/all?status=` | Barcha referrallar (filter bilan) |
| GET | `/by-referrer/:referrerId` | Referrer bo'yicha |
| GET | `/by-friend/:friendId` | Do'st bo'yicha |
| GET | `/statistics` | Statistika |

## Workflow

### 1. Referral Yaratish
```
Admin → Referral yaratadi (referrer + friend)
     → Status: PENDING
```

### 2. Referral Tasdiqlash
```
Admin → Approve tugmasini bosadi
     → Status: PENDING → ACTIVE
```

### 3. Do'st Birinchi To'lov Qiladi
```
Do'st to'lov qiladi
     → handleFriendFirstPayment() ishga tushadi
     → Status: ACTIVE → COMPLETED
     → discount_active: true
     → Referrer uchun chegirma aktivlashadi
```

### 4. Referrer To'lov Qiladi
```
Referrer to'lov qiladi
     → calculateReferrerDiscount() ishga tushadi
     → 20% chegirma qo'llaniladi
     → To'lov summasi avtomatik kamayadi
```

## Payment Integration

`server/routes/payments.js` da to'lov yaratishda:

```javascript
// 1. Chegirmani hisoblash
const discountResult = await ReferralService.calculateReferrerDiscount(
  student_id, 
  paymentAmount
);

// 2. Chegirma qo'llash
if (discountResult.hasDiscount) {
  paymentAmount = paymentAmount - discountResult.discountAmount;
}

// 3. Do'stning birinchi to'lovini tekshirish
const friendReferralResult = await ReferralService.handleFriendFirstPayment(
  student_id,
  originalAmount
);
```

## Frontend

### Admin Panel (`client/src/pages/Referrals.jsx`)

**Funksiyalar:**
- Yangi referral qo'shish
- Referrallarni ko'rish va filtrlash (PENDING, ACTIVE, COMPLETED)
- Referralni tasdiqlash
- Referralni bekor qilish
- Statistika ko'rish
- Top referrerlar ro'yxati

**Statistika:**
- Jami referrallar
- Kutilayotgan referrallar
- Aktiv referrallar
- Yakunlangan referrallar
- Top referrerlar (eng ko'p referral qilganlar)

## Chegirma Qoidalari

1. **Chegirma Foizi:** 20% (default)
2. **Chegirma Aktivlashuvi:** Do'st birinchi to'lov qilgandan keyin
3. **Chegirma Qo'llanishi:** Referrerning har bir to'lovida
4. **Bir nechta referral:** Agar referrerda bir nechta aktiv referral bo'lsa, chegirmalar qo'shiladi (max 100%)

## Misol

```
1. Admin: Ali → Vali referral qo'shadi
2. Admin: Referralni tasdiqlaydi (Status: ACTIVE)
3. Vali: 500,000 so'm to'lov qiladi
   → Referral COMPLETED bo'ladi
   → Ali uchun 20% chegirma aktivlashadi
4. Ali: 500,000 so'm to'lov qiladi
   → Avtomatik 20% chegirma: -100,000 so'm
   → To'lov summasi: 400,000 so'm
```

## Database Schema

```javascript
// Referral collection
{
  _id: ObjectId,
  referrer_id: ObjectId → Student,
  friend_id: ObjectId → Student,
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED",
  discount_percent: 20,
  discount_active: false,
  friend_first_payment_date: null,
  friend_first_payment_amount: null,
  total_discount_given: 0,
  admin_id: ObjectId → User,
  approved_date: null,
  notes: "",
  createdAt: Date,
  updatedAt: Date
}
```

## O'chirilgan Tizimlar

- ❌ Coin Balance
- ❌ CoinHistory Model
- ❌ CoinService
- ❌ Coin API Endpoints
- ❌ Coin UI Components

## Qoldirilgan Tizimlar

- ✅ Referral Model
- ✅ ReferralService
- ✅ Referral API Endpoints
- ✅ Avtomatik Chegirma Tizimi
- ✅ Admin Referral UI
- ✅ Payment Integration

## Xavfsizlik

1. Referral faqat admin tomonidan yaratiladi
2. Bir talaba o'zini referral qila olmaydi
3. Bir xil referral ikki marta yaratilmaydi (unique constraint)
4. Chegirma faqat do'st to'lov qilgandan keyin aktivlashadi
5. Barcha amallar admin autentifikatsiyasini talab qiladi
