import React, { useState } from 'react';
import Button from './Button';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Sign in with:', email, password);
    setIsLoading(false);
  };

  return (
    <div className="bg-black/80 backdrop-blur-md rounded-2xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-2 border-transparent px-4 py-3 text-sm bg-white/10 text-white transition-all duration-200 focus:outline-none focus:border-red-500 focus:bg-white/15 placeholder:text-white/50 backdrop-blur-md"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border-2 border-transparent px-4 py-3 text-sm bg-white/10 text-white transition-all duration-200 focus:outline-none focus:border-red-500 focus:bg-white/15 placeholder:text-white/50 backdrop-blur-md"
            placeholder="Enter your password"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}