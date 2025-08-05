'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full px-8 ">
      <div className='w-full'>
        <label htmlFor="email" className="block text-sm font-medium">
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="mt-1 text-lg py-2 px-4 rounded-md border h-12
           border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
         
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="mt-1 font-lg py-2 px-4 rounded-md border h-12
           border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <Button variant="custom" className="w-full text-lg h-12" type="submit">
        Login
      </Button>
    </form>
  );
}
