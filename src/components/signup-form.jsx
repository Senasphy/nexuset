'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignUpForm({
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  onSubmit,
  signInWithGoogleRedirect,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full px-8">
       <div>
        <label htmlFor="username" className="block text-sm font-medium">
           
        </label>
        <Input
          id="username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
          className="mt-1 h-12"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
           
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="mt-1 h-12"
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
          className="mt-1 h-12"
        />
      </div>
      <Button variant= 'custom' type="submit" className="w-full h-12 text-lg">
        Sign Up
      </Button>
      <Button onClick = {()=>signInWithGoogleRedirect()}>Sign up with Google</Button>
    </form>
  );
}