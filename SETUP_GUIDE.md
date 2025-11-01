# 🚀 WraithWatchers - Setup Guide

## Quick Setup (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

#### A. Create `.env.local`

Create a file called `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Where to find these:**
- Go to your Supabase project dashboard
- Click Settings (⚙️) → API
- Copy the URL and anon/public key

#### B. Run Database Setup SQL

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire contents of `database-setup.sql`
3. Paste and click **Run**

This creates:
- `sightings` table
- Indexes for performance
- Row Level Security policies

### 3. Import Initial Data

```bash
npm run import-data
```

This uploads all 12,000+ ghost sightings from the CSV file into your database.

**Expected output:**
```
🚀 Starting CSV data import to Supabase...
📄 Reading CSV file...
✅ Parsed 12002 rows from CSV
🔍 Filtered to 12002 valid sightings
📦 Uploading 12002 sightings in 25 batches...
✅ Batch 1 completed
...
🎉 Total records in database: 12002
✨ Import complete! Your app is ready to use.
```

### 4. Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## ✨ Features

- 🗺️ Interactive map with 12,000+ ghost sightings
- 📊 Statistics dashboard
- 🔍 Searchable and filterable table
- 📝 Submit new sightings form
- 💾 Export data to CSV
- 📱 Fully mobile responsive

---

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run import-data` | Import CSV data to database (one-time) |
| `npm run lint` | Run ESLint |

---

## 📊 Database Schema

The `sightings` table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `date_of_sighting` | DATE | When it happened |
| `latitude` | DECIMAL | GPS latitude |
| `longitude` | DECIMAL | GPS longitude |
| `city` | VARCHAR | Nearest city |
| `state` | VARCHAR | US State |
| `notes` | TEXT | Description |
| `time_of_day` | VARCHAR | Dawn, Morning, etc. |
| `tag` | VARCHAR | Type (Shadow Figure, etc.) |
| `image_link` | TEXT | Optional image URL |
| `created_at` | TIMESTAMP | Record creation time |

---

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

**Note:** Run `npm run import-data` locally once. Data will be in your Supabase database for all deployments.

---

## 🔒 Security

- Row Level Security (RLS) enabled
- Public can read sightings
- IP-based rate limiting (3 per hour)
- IPs not stored in database (privacy-first)
- Environment variables never committed to git

---

## 🆘 Troubleshooting

### "Missing Supabase credentials"

Create `.env.local` with your Supabase URL and anon key.

### "relation 'sightings' does not exist"

Run `database-setup.sql` in Supabase SQL Editor first.

### "Database already contains records"

The import script prevents duplicates. If you need to reimport:
```sql
-- Run in Supabase SQL Editor:
DELETE FROM sightings;
```
Then run `npm run import-data` again.

### App shows "Error loading sightings"

1. Check `.env.local` has correct credentials
2. Verify database setup is complete
3. Check browser console for errors

---

## 📁 Project Structure

```
├── app/
│   ├── components/       # React components
│   ├── types/           # TypeScript types
│   ├── page.tsx         # Main sightings page
│   ├── post/            # Post sighting page
│   └── thank-you/       # Confirmation page
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── database.ts      # Database functions
├── scripts/
│   └── import-csv-data.ts  # One-time import script
├── public/
│   └── ghost_sightings_12000_with_images.csv
├── database-setup.sql   # Database schema
└── .env.local          # Your credentials (create this)
```

---

## 🎨 Tech Stack

- **Framework:** Next.js 16
- **Database:** Supabase (PostgreSQL)
- **Maps:** Leaflet.js
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

---

## ✅ Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.local` with Supabase credentials
- [ ] Run `database-setup.sql` in Supabase SQL Editor
- [ ] Import data (`npm run import-data`)
- [ ] Start app (`npm run dev`)
- [ ] Visit http://localhost:3000
- [ ] 🎉 Done!

---

**Questions?** Check your Supabase dashboard or browser console for error messages.

**Built with ❤️ (and a little fear) for WraithWatchers** 👻

