'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {signInWithGoogle} from '@/context/AuthContext';

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  signInWithGoogleRedirect,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit } className=" w-full px-8 " >
      <div className='w-full'>
         <h1 className='text-2xl font-bold pb-1'>LOGIN</h1>  
        <label htmlFor="email" className="block text-sm font-medium">
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="text-lg py-2 px-4 rounded-md border h-12
           border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      <div className='w-full flex items-center justify-center flex-col space-y-2'>
        <label htmlFor="password" className="block text-sm font-medium">
         
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className=" font-lg py-2 px-4 rounded-md border h-12
           border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        
        <Button type="submit" className = 'w-full'>
        Login
      </Button>
      <Button className = 'w-full ' onClick = {()=>signInWithGoogleRedirect()}>Login with Google</Button>
      </div>

      
    </form>
  );
}
