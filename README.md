# Holy Ghost House of God — Newsletter Application

A full-stack newsletter web application built for **Holy Ghost House of God** church. Manage articles, subscribers, and email newsletters from an intuitive admin panel, while providing a beautiful public-facing website for readers.

## 🧱 Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Email**: Resend
- **Auth**: JWT-based admin authentication

## ✨ Features

### Public Website
- Hero section with newsletter subscription form
- Articles listing with search and pagination
- Individual article pages with Markdown rendering
- Unsubscribe page
- Responsive, SEO-friendly design

### Admin Panel
- Dashboard with subscriber/article/view/email stats
- Article management (create, edit, delete)
- Markdown editor for content
- Draft/Published status management
- Newsletter send toggle per article
- Subscriber management (view, add, delete, search)
- Toast notifications for all actions

### Newsletter System
- Automatic email to all subscribers on article publish
- Manual newsletter sending from admin
- Confirmation email on subscription
- Unsubscribe link in all emails
- Email logging for tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- [Resend](https://resend.com) account for email

### 1. Clone the repository

```bash
git clone https://github.com/geoffOkumu/hghg.git
cd hghg
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `JWT_SECRET` | Secret key for JWT tokens (use a random string) |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `FROM_EMAIL` | Sender email (must be verified in Resend) |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (e.g. `http://localhost:3000`) |

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed admin user
npx tsx prisma/seed.ts
```

### 5. Start the development server

```bash
npm run dev
```

Visit:
- **Public site**: [http://localhost:3000](http://localhost:3000)
- **Admin panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/              # Admin pages
│   │   ├── articles/       # Article management
│   │   ├── dashboard/      # Dashboard with stats
│   │   ├── login/          # Admin login
│   │   └── subscribers/    # Subscriber management
│   ├── api/                # API routes
│   │   ├── admin/          # Protected admin APIs
│   │   ├── articles/       # Public article APIs
│   │   ├── auth/           # Authentication APIs
│   │   ├── subscribe/      # Newsletter subscription
│   │   └── unsubscribe/    # Newsletter unsubscription
│   ├── articles/[id]/      # Article detail page
│   └── unsubscribe/        # Unsubscribe page
├── components/
│   ├── admin/              # Admin components
│   ├── public/             # Public site components
│   └── ui/                 # Shared UI components
├── lib/
│   ├── auth.ts             # JWT authentication helpers
│   ├── email.ts            # Resend email functions
│   └── prisma.ts           # Prisma client singleton
└── middleware.ts            # Route protection middleware
```

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `Admin` | Admin user accounts |
| `Subscriber` | Newsletter subscribers |
| `SubscriberList` | Subscriber segmentation lists |
| `SubscriberListMember` | Many-to-many subscriber-list membership |
| `Article` | Blog articles/newsletter content |
| `ArticleView` | Article view tracking |
| `EmailLog` | Email send history |

## 🔐 Authentication

The admin panel uses a simple JWT-based authentication system:

1. Admin credentials are set via environment variables
2. The seed script creates the admin user in the database
3. Login generates a JWT token stored in an HTTP-only cookie
4. Middleware protects all `/admin/*` and `/api/admin/*` routes

## 📬 Email Configuration

1. Sign up at [Resend](https://resend.com)
2. Verify your domain or use the sandbox domain for testing
3. Get your API key and add it to `.env`
4. Set `FROM_EMAIL` to a verified sender address

## 🏗️ Production Deployment

### Build

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Database

Use a managed PostgreSQL service like:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

## 📄 License

MIT
