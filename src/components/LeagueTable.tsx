'use client';

import { useState } from 'react';

interface Standing {
  id: string;
  name: string;
  totalPoints: number;
  picksNextWeek: number;
  currentWeek: number;
  nextWeek: number;
}

interface LeagueTableProps {
  standings: Standing[];
  isLoading?: boolean;
}

export default function LeagueTable({ standings, isLoading = false }: LeagueTableProps) {
  const [sortField, setSortField] = useState<'name' | 'points'>('points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: 'name' | 'points') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };
  
  const sortedStandings = [...standings].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (sortField === 'name') {
      return a.name.localeCompare(b.name) * modifier;
    } else {
      return (a.totalPoints - b.totalPoints) * modifier;
    }
  });
  
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
        ))}
      </div>
    );
  }
  
  if (standings.length === 0) {
    return (
      <div className="card text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-900">League Table</h2>
        <p className="text-gray-500 dark:text-gray-400">No players found.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden rounded-lg">
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">League Table</h2>
        
        {/* Desktop table - hidden on small screens */}
        <div className="hidden sm:block">
          <table className="w-full text-left text-gray-900 dark:text-white">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 font-semibold text-gray-900 dark:text-white">
                  <button 
                    className="flex items-center text-left leading-6 min-h-[44px] text-gray-900 dark:text-white"
                    onClick={() => handleSort('name')}
                  >
                    Player
                    {sortField === 'name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="py-3 font-semibold text-gray-900 dark:text-white">
                  <button 
                    className="flex items-center text-left leading-6 min-h-[44px] text-gray-900 dark:text-white"
                    onClick={() => handleSort('points')}
                  >
                    Points
                    {sortField === 'points' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="py-3 font-semibold text-gray-900 dark:text-white">Picks (Week {standings[0]?.nextWeek || 1})</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.map((player) => (
                <tr key={player.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 font-medium text-gray-900 dark:text-white">{player.name}</td>
                  <td className="py-4 text-gray-900 dark:text-white">{player.totalPoints}</td>
                  <td className="py-4 text-gray-900 dark:text-white">{player.picksNextWeek}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile cards - only shown on small screens */}
        <div className="sm:hidden space-y-4">
          <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <button 
              className="font-semibold leading-6 min-h-[44px] text-gray-900 dark:text-white"
              onClick={() => handleSort('name')}
            >
              Player
              {sortField === 'name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
            <button 
              className="font-semibold leading-6 min-h-[44px] text-gray-900 dark:text-white"
              onClick={() => handleSort('points')}
            >
              Points
              {sortField === 'points' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          </div>
          
          {sortedStandings.map((player) => (
            <div 
              key={player.id} 
              className="flex flex-col p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{player.name}</h3>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{player.totalPoints} pts</div>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Picks for Week {player.nextWeek}: <span className="font-medium">{player.picksNextWeek}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 