# THE NEST ARCHITECTS
Architecture Portfolio & Cost Estimation Platform

## Tech Stack
- **Frontend**: ReactJS, MUI, React Query, Framer Motion, React Hook Form
- **Backend**: NestJS, TypeORM, Passport.js, JWT, Nodemailer, Multer
- **Database**: PostgreSQL
- **Storage**: Cloudinary
- **Auth**: Google OAuth2 + JWT

---

## Setup

### 1. Clone & Install
```bash
npm run install:all
```

### 2. Backend Environment
Copy `backend/.env.example` to `backend/.env` and fill in:
- PostgreSQL credentials
- Google OAuth Client ID & Secret
- Cloudinary credentials
- Gmail SMTP App Password
- JWT Secret

### 3. Frontend Environment
Copy `frontend/.env.example` to `frontend/.env` and fill in:
- `VITE_API_URL=http://localhost:3000`
- `VITE_GOOGLE_CLIENT_ID=your_google_client_id`

### 4. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3000/auth/google/callback` as authorized redirect URI

### 5. Run
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

---

## URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Swagger Docs | http://localhost:3000/api/docs |
| Admin Panel | http://localhost:5173/admin-login-page |

## Admin Credentials
- **Email**: dhaarun@gmail.com
- **Password**: Welcome123!

---

## Project Structure
```
THE NEST ARCHITECTS/
├── backend/          # NestJS API
│   └── src/
│       ├── auth/     # Google OAuth + JWT + Admin login
│       ├── users/    # User management
│       ├── projects/ # Project CRUD + Cloudinary
│       ├── calculator/ # Cost estimation engine
│       ├── landing/  # Landing page CMS
│       ├── about/    # About page CMS
│       ├── contact/  # Contact form + email
│       ├── settings/ # App settings
│       └── common/   # Mail, Cloudinary, Guards
└── frontend/         # React + Vite
    └── src/
        ├── pages/    # All public pages
        ├── pages/admin/ # All admin pages
        ├── components/  # Layout + common components
        ├── api/      # Axios + API calls
        ├── context/  # Auth context
        └── theme/    # MUI theme
```

## API Endpoints
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /auth/google | — |
| POST | /auth/admin-login | — |
| GET | /auth/profile | JWT |
| GET | /projects | — |
| GET | /projects/:id | — |
| POST | /projects | Admin |
| PUT | /projects/:id | Admin |
| DELETE | /projects/:id | Admin |
| GET | /calculator/services | — |
| POST | /calculator/calculate | — |
| GET | /calculator/services/all | Admin |
| POST/PUT/DELETE | /calculator/:id | Admin |
| GET | /landing | — |
| PUT | /landing | Admin |
| GET | /about | — |
| PUT | /about | Admin |
| POST | /contact | — |
| GET | /contact | Admin |
| DELETE | /contact/:id | Admin |
| GET | /users | Admin |
| DELETE | /users/:id | Admin |
| PATCH | /users/:id/block | Admin |
| GET/PUT | /settings | Admin |
