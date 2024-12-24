import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';

export function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      if (isRegistering) {
        console.log('Attempting to register...');
        await signUp(email, password);
        console.log('Registration successful');
      } else {
        console.log('Attempting to login...');
        await signIn(email, password);
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered');
            break;
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Invalid email or password');
            break;
          case 'auth/weak-password':
            setError('Password should be at least 6 characters');
            break;
          default:
            setError(`Failed to ${isRegistering ? 'register' : 'sign in'}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? 'Create an account' : 'Sign in to your account'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            {isRegistering && (
              <div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm password"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading 
                ? (isRegistering ? 'Creating account...' : 'Signing in...') 
                : (isRegistering ? 'Sign up' : 'Sign in')}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isRegistering 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
} 