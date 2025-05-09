'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const picksSchema = z.object({
  week: z.number().int().positive('Week must be a positive number'),
  picks: z.array(
    z.object({
      playerId: z.string().uuid('Invalid player ID'),
      selection: z.string().min(1, 'Selection is required'),
      isCorrect: z.boolean()
    })
  ).min(1, 'At least one pick is required')
});

type LoginFormData = z.infer<typeof loginSchema>;
type PicksFormData = z.infer<typeof picksSchema>;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  // Picks form
  const picksForm = useForm<PicksFormData>({
    resolver: zodResolver(picksSchema),
    defaultValues: {
      week: 1,
      picks: []
    }
  });
  
  // Handle login submit
  const onLoginSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      // In a real app, call Supabase auth.signInWithPassword here
      // For demo, just simulate login
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        // Also fetch players
        setPlayers([
          { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Player 1' },
          { id: '223e4567-e89b-12d3-a456-426614174000', name: 'Player 2' },
          { id: '323e4567-e89b-12d3-a456-426614174000', name: 'Player 3' }
        ]);
      }, 1000);
    } catch (error) {
      setFormError('Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };
  
  // Handle picks submit
  const onPicksSubmit: SubmitHandler<PicksFormData> = async (data) => {
    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      // Call API to submit picks
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit picks');
      }
      
      setFormSuccess('Picks submitted successfully!');
      picksForm.reset();
    } catch (error: any) {
      setFormError(error.message || 'An error occurred while submitting picks');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add row of picks to form
  const addPickRow = () => {
    const currentPicks = picksForm.getValues('picks') || [];
    picksForm.setValue('picks', [
      ...currentPicks, 
      { playerId: '', selection: '', isCorrect: false }
    ]);
  };
  
  // Remove row from picks
  const removePickRow = (index: number) => {
    const currentPicks = picksForm.getValues('picks') || [];
    currentPicks.splice(index, 1);
    picksForm.setValue('picks', [...currentPicks]);
  };
  
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isAuthenticated 
            ? 'Submit weekly results below' 
            : 'Please login to manage the league'}
        </p>
      </header>
      
      {/* Alert boxes for success/error feedback */}
      {formError && (
        <div className="mb-6 p-4 bg-danger-light text-danger-dark dark:bg-danger-dark dark:text-danger-light rounded">
          {formError}
        </div>
      )}
      
      {formSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded">
          {formSuccess}
        </div>
      )}
      
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto card">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  disabled={isLoading}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-danger">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  disabled={isLoading}
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-danger">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Submit Weekly Results</h2>
          
          <form onSubmit={picksForm.handleSubmit(onPicksSubmit)}>
            <div className="space-y-6">
              <div>
                <label htmlFor="week" className="block text-sm font-medium mb-1">
                  Week Number
                </label>
                <input
                  id="week"
                  type="number"
                  min="1"
                  className="input w-32"
                  disabled={isLoading}
                  {...picksForm.register('week', { valueAsNumber: true })}
                />
                {picksForm.formState.errors.week && (
                  <p className="mt-1 text-sm text-danger">
                    {picksForm.formState.errors.week.message}
                  </p>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Player Picks</h3>
                  <button
                    type="button"
                    className="text-sm btn bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    onClick={addPickRow}
                  >
                    Add Pick
                  </button>
                </div>
                
                {picksForm.formState.errors.picks && 
                  typeof picksForm.formState.errors.picks.message === 'string' && (
                  <p className="mt-1 mb-2 text-sm text-danger">
                    {picksForm.formState.errors.picks.message}
                  </p>
                )}
                
                <div className="space-y-4">
                  {picksForm.watch('picks').map((_, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Player
                        </label>
                        <select
                          className="input"
                          disabled={isLoading}
                          {...picksForm.register(`picks.${index}.playerId`)}
                        >
                          <option value="">Select Player</option>
                          {players.map(player => (
                            <option key={player.id} value={player.id}>
                              {player.name}
                            </option>
                          ))}
                        </select>
                        {picksForm.formState.errors.picks?.[index]?.playerId && (
                          <p className="mt-1 text-sm text-danger">
                            {picksForm.formState.errors.picks[index]?.playerId?.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Selection
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Team/bet selection"
                          disabled={isLoading}
                          {...picksForm.register(`picks.${index}.selection`)}
                        />
                        {picksForm.formState.errors.picks?.[index]?.selection && (
                          <p className="mt-1 text-sm text-danger">
                            {picksForm.formState.errors.picks[index]?.selection?.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-none flex items-end space-x-4 pb-1">
                        <div className="flex items-center">
                          <input
                            id={`correct-${index}`}
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            disabled={isLoading}
                            {...picksForm.register(`picks.${index}.isCorrect`)}
                          />
                          <label htmlFor={`correct-${index}`} className="ml-2 text-sm">
                            Correct
                          </label>
                        </div>
                        
                        <button
                          type="button"
                          className="text-sm text-danger hover:text-danger-dark"
                          onClick={() => removePickRow(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {picksForm.watch('picks').length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No picks added yet. Click &quot;Add Pick&quot; to start.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Results'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      <footer className="mt-12 pt-8 text-center text-sm text-gray-500">
        <p>
          <a 
            href="/" 
            className="text-primary hover:text-primary-dark hover:underline transition-colors"
          >
            Back to League Table
          </a>
        </p>
      </footer>
    </main>
  );
} 