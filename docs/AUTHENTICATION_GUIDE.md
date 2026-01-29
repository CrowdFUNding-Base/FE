# 🔐 Authentication Integration Guide

## Overview
Sistem authentication CrowdFUNding mendukung 2 metode login:
1. **Google OAuth** - Login menggunakan akun Google
2. **Web3 Wallet** - Login menggunakan wallet (MetaMask, Coinbase, WalletConnect)

---

## 📋 Setup Instructions

### 1. Frontend Environment Variables

Create `.env.local` in `fe/` directory:

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:3300

# Google OAuth (from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# WalletConnect (from WalletConnect Cloud)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Smart Contracts
NEXT_PUBLIC_CAMPAIGN_ADDRESS=0x669419298f071c321EF9B9cCA44be58E380A5fE3
NEXT_PUBLIC_BADGE_ADDRESS=0xdbe867Ddb16e0b34593f2Cef45e755feC2a8ce9d
```

### 2. Backend Environment Variables

Already configured in `be/.env`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

---

## 🚀 How It Works

### Google OAuth Flow

```
User clicks "Google" button
        ↓
Opens Google OAuth popup
        ↓
User selects Google account
        ↓
Frontend receives access token
        ↓
Fetch user info from Google API
        ↓
POST /auth/google-login with { email, name, googleId }
        ↓
Backend creates/finds user in database
        ↓
Backend generates JWT token
        ↓
Backend sets httpOnly cookie: user_session
        ↓
Frontend redirects to /home
```

### Web3 Wallet Flow

```
User clicks "Web3 Wallet" button
        ↓
Connect wallet (MetaMask/Coinbase/WalletConnect)
        ↓
Get wallet address from Wagmi
        ↓
POST /auth/wallet-login with { walletAddress, role }
        ↓
Backend creates/finds user by wallet address
        ↓
Backend generates JWT token
        ↓
Backend sets httpOnly cookie: user_session
        ↓
Frontend redirects to /home
```

---

## 📡 API Endpoints

### POST `/auth/google-login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "googleId": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Cookie Set:**
- `user_session`: JWT token (httpOnly, secure, sameSite: strict)
- Expires in 24 hours

---

### POST `/auth/wallet-login`

**Request Body:**
```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890",
  "role": "contributor"  // or "campaigner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 2,
    "name": "User_0x1234",
    "walletAddress": "0x1234567890123456789012345678901234567890"
  }
}
```

**Cookie Set:**
- `user_session`: JWT token
- Contains: `{ _id, walletAddress, role }`

---

## 🧪 Testing

### Test Google Login

1. Open browser: http://localhost:3000/login
2. Click "Google" button
3. Select Google account
4. Should redirect to /home with logged in state

### Test Wallet Login

1. Open browser: http://localhost:3000/login
2. Make sure MetaMask is installed
3. Click "Web3 Wallet" button
4. Approve wallet connection in MetaMask
5. Should redirect to /home with logged in state

### Test with cURL

**Google Login:**
```bash
curl -X POST http://localhost:3300/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "googleId": "12345"
  }'
```

**Wallet Login:**
```bash
curl -X POST http://localhost:3300/auth/wallet-login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x568597f5526a45ff3224c5dee94c2b629a26b5e2",
    "role": "contributor"
  }'
```

---

## 🔒 Security Features

1. **JWT Token** stored in httpOnly cookie (not accessible via JavaScript)
2. **CORS** configured to only accept requests from frontend
3. **SameSite: Strict** prevents CSRF attacks
4. **Secure flag** in production (HTTPS only)
5. **24-hour expiration** for session tokens

---

## 🛠️ Components Used

### Frontend

- **LoginForm** (`fe/src/components/layout/LoginForm.tsx`)
  - Handles both Google and Wallet login
  - Shows loading states
  - Error handling

- **GoogleAuthProvider** (`fe/src/components/Contexts/GoogleAuthProvider.tsx`)
  - Wraps app with Google OAuth context

- **Web3Provider** (`fe/src/components/Contexts/Web3Provider.tsx`)
  - Wraps app with Wagmi provider
  - Configured with RainbowKit

### Backend

- **authController** (`be/controllers/authController.ts`)
  - `googleOAuthLogin()` - Handles Google authentication
  - `walletOnlyLogin()` - Handles wallet authentication

- **auth routes** (`be/routes/auth.ts`)
  - POST `/auth/google-login`
  - POST `/auth/wallet-login`
  - POST `/auth/logout`

---

## 📝 Database Schema

### users table
```sql
- id (Primary Key)
- email (Unique)
- fullname
- google_id (nullable)
- is_google_auth (boolean)
- is_wallet_only (boolean)
```

### wallet_addresses table
```sql
- id (Primary Key)
- user_id (Foreign Key → users.id)
- wallet_address (Unique)
- role (contributor | campaigner)
```

---

## 🐛 Common Issues

### 1. Google Login fails with "Client ID not configured"

**Solution:** Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`

### 2. Wallet connection fails

**Solution:**
- Check MetaMask is installed
- Make sure you're on Base Sepolia network
- Clear browser cache

### 3. CORS error

**Solution:** Make sure backend has correct CORS settings in `app.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 4. Cookie not set

**Solution:**
- Check `withCredentials: true` in axios requests
- Verify backend and frontend are on same domain or proper CORS

---

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production` in backend
- [ ] Use HTTPS for both frontend and backend
- [ ] Update CORS origin to production URL
- [ ] Rotate JWT_SECRET
- [ ] Enable secure flag for cookies
- [ ] Add rate limiting
- [ ] Add Google OAuth verification
- [ ] Add wallet signature verification (optional)

---

## 📚 References

- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://www.rainbowkit.com)
- [JWT Best Practices](https://jwt.io/introduction)

---

## ✨ Next Features (TODO)

- [ ] Connect wallet to existing Google account
- [ ] Disconnect wallet
- [ ] Multiple wallet support
- [ ] Email verification for Google accounts
- [ ] Password reset
- [ ] 2FA authentication
- [ ] Session management (logout from all devices)
