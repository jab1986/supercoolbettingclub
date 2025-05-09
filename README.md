# Betting League Table App

A mobile-first application for managing a betting league where players earn picks based on past performance.

## Features

- Responsive, mobile-first design
- Public league table showing standings and next-week picks allocation
- Admin-only form for submitting weekly picks and results
- Authentication via Supabase Auth
- PostgreSQL database with Supabase

## Tech Stack

- **Frontend**: Next.js 14 (React 18), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with App Router, PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT in httpOnly cookies
- **Form Validation**: React Hook Form with Zod
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project

### Environment Variables

Create a `.env.local` file with these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

Execute the SQL migration in `supabase/migrations/00001_initial_schema.sql` in your Supabase project.

## League Logic

- Each player makes 1-2 picks per week
- If they get both picks correct, they earn 2 picks next week
- Otherwise, they earn 1 pick
- 1 point per correct pick, 0 points per incorrect pick

## Project Structure

```
/src
  ├─ app/                  ← Next.js App Router
  │   ├─ page.tsx          ← Public league table
  │   └─ admin/page.tsx    ← Login + results entry form
  ├─ components/           ← Reusable React components
  │   └─ LeagueTable.tsx   ← Table UI component
  ├─ lib/                  ← Utilities and helpers
  │   ├─ supabaseClient.ts ← Supabase initialization
  │   ├─ database.types.ts ← TypeScript types
  │   └─ leagueLogic.ts    ← Business logic (calculatePoints)
  └─ styles/               ← Global styles and Tailwind config
```

## License

MIT

## Contributors

- Your Name 