import LeagueTable from '../components/LeagueTable';
import { calculatePoints } from '../lib/leagueLogic';

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function Home() {
  // Fetch league standings
  const standings = await calculatePoints();
  
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Betting League</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Current standings and picks for next week
        </p>
      </header>
      
      <LeagueTable standings={standings} />
      
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p className="mt-2">
          <a 
            href="/admin" 
            className="text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            Admin Login
          </a>
        </p>
      </footer>
    </main>
  );
} 