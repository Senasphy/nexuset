'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SignUpForm from '@/components/signup-form';

export default function SignUp() {
  const authContext = useAuth();
  const { signUp, loading } = authContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  console.log('useAuth:', useAuth);
  console.log('authContext:', authContext);
  console.log('signUp function:', signUp);

  if (loading) return <div>Loading...</div>;

  const handleSignUp = async (e) => {
    
    try {
      await signUp(email, password, username);
      if (!email || !password || !username){
        setError("Please fill in all fields")
        return
      }
      console.log('Sign-up successful, redirecting to /');
      router.push('/');
    } catch (err) {
      console.error('Sign-up error:', err);
      const errorMap = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/operation-not-allowed': 'Sign-up is currently disabled',
        'auth/invalid-credential': 'Invalid credentials provided',
        'auth/network-request-failed': 'Network error, please try again',
        'auth/too-many-requests': 'Too many attempts, please try again later',
        'auth/username-already-in-use': 'This username is already taken',
      };
      setError(errorMap[err.code] || err.message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-4">
      <h1 className='text-2xl font-bold'>SIGN UP</h1>
      {error && <p className="text-red-500">{error}</p>}
      <SignUpForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        onSubmit={handleSignUp}
      />
      <div className='flex gap-4' >Already have an account? <p
        className="text-blue-500 cursor-pointer hover:underline"
        onClick={() => router.push('/login')}>Login</p>
        </div>
      
        
    </div>
  );
}