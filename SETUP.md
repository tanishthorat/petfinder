# 🐾 PetPro Setup Guide

## 📋 Quick Setup Instructions

### Step 1: Get Your Supabase Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `qdmpdrjeyuikpbvzdufa`
3. Go to **Settings** → **API**
4. Copy the **`service_role`** key (⚠️ Keep this secret!)
5. Update your `.env` file:
   ```env
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   ```

### Step 2: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file `supabase-schema.sql` in this project
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click **Run** to execute

This will create:
- ✅ All database tables (users, pets, swipes, matches, messages, user_preferences)
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Storage bucket for pet images
- ✅ Real-time subscriptions for messaging

### Step 3: Test Your Database Connection

```bash
npm run test:db
```

If successful, you'll see:
```
✅ Successfully connected to Supabase database!
✅ Database schema is set up correctly!
🌱 Seeding sample data...
✅ Sample users created
✅ Sample pets created
🎉 Database seeded successfully!
```

### Step 4: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 🔐 Security Notes

### Public vs Private Keys

#### ✅ SAFE TO EXPOSE (Client-Side):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous/public key for client-side

**Why it's safe:** These keys are protected by Row Level Security (RLS) policies in your database. Users can only access data that the RLS policies allow.

#### ⚠️ KEEP SECRET (Server-Side Only):
- `SUPABASE_SERVICE_ROLE_KEY` - Bypasses RLS, has full database access
- `DATABASE_URL` - Direct database connection string
- `CLERK_SECRET_KEY` - Clerk authentication secret

**Never commit these to git or expose them in client-side code!**

---

## 🗄️ Database Schema Overview

### Users Table
- Stores user profiles linked to Clerk authentication
- Roles: adopter, owner, shelter, admin
- Includes location data for distance-based matching

### Pets Table
- Pet listings with detailed information
- Linked to owner (user)
- Status tracking: available → pending → adopted
- Supports multiple images via Supabase Storage

### Swipes Table
- Tracks user swipes (left/right) on pets
- Ensures each user can only swipe once per pet
- Powers the Tinder-style matching system

### Matches Table
- Created when adopter likes a pet
- Links adopter, pet, and owner
- Status tracking: matched → contacted → meeting_scheduled → adopted

### Messages Table
- Real-time chat between matched users
- Linked to matches
- Read/unread status tracking

### User Preferences Table
- Stores adopter preferences
- Used to filter pet feed
- Species, age range, size, distance, etc.

---

## 🚀 Project Structure

```
petpro/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── users/        # User management
│   │   ├── pets/         # Pet CRUD
│   │   ├── swipes/       # Swipe tracking
│   │   └── matches/      # Match management
│   ├── onboarding/       # User onboarding flow
│   ├── profile/          # User profile page
│   ├── swipe/            # Tinder-style swipe interface
│   ├── post-pet/         # Pet creation form
│   ├── my-pets/          # Owner's pet management
│   ├── matches/          # Match list & chat
│   ├── history/          # Swipe history
│   ├── liked/            # Liked pets
│   └── search/           # Advanced search
├── components/           # Reusable UI components
├── lib/                  # Utilities
│   ├── supabaseClient.ts # Supabase client setup
│   └── supabase.ts       # Database helper functions
├── types/                # TypeScript types
│   ├── database.ts       # Database schema types
│   └── index.ts          # App types
├── scripts/              # Utility scripts
│   └── test-supabase.ts  # DB connection test
└── supabase-schema.sql   # Database schema
```

---

## 🎨 Features to Implement

### ✅ Phase 1: Core Features (Start Here)
- [ ] User onboarding flow (/onboarding)
- [ ] User profile management (/profile)
- [ ] Pet posting form (/post-pet)
- [ ] Swipe interface (/swipe)
- [ ] Match list (/matches)

### 🔄 Phase 2: Enhanced Features
- [ ] Real-time messaging (/matches/:id)
- [ ] Swipe history (/history)
- [ ] Liked pets (/liked)
- [ ] Advanced search (/search)
- [ ] Map view integration

### 🎯 Phase 3: Advanced Features
- [ ] Admin dashboard (/admin)
- [ ] Analytics & reporting
- [ ] Email notifications
- [ ] Push notifications
- [ ] Mobile app (React Native)

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Test database connection
npm run test:db

# Run linter
npm run lint
```

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Public - Safe for client-side)
NEXT_PUBLIC_SUPABASE_URL="https://qdmpdrjeyuikpbvzdufa.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# Supabase Private Keys (Server-side only - DO NOT EXPOSE)
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
DATABASE_URL="postgresql://postgres:Petfinder@123@db.qdmpdrjeyuikpbvzdufa.supabase.co:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# Petfinder API (Optional)
PETFINDER_API_KEY=""
PETFINDER_SECRET_KEY=""
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test your connection
npm run test:db

# Common issues:
# 1. Wrong service role key → Check Supabase dashboard
# 2. Schema not created → Run supabase-schema.sql in SQL Editor
# 3. RLS policies blocking access → Check policies in Supabase dashboard
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [NextUI Components](https://nextui.org)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Support

Need help? Check:
1. This README
2. `supabase-schema.sql` for database structure
3. `types/database.ts` for TypeScript types
4. Run `npm run test:db` to verify setup

---

**Happy coding! 🐾**
