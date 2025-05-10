'use client'
import {useState} from 'react'
import {useAuth} from '../../context/AuthContext'
import {useRouter} from 'next/navigation'
import LoginForm from '@/components/login-form'
import { Button } from '@/components/ui/button';


export default function Login(){
    const {login} = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    
    const handleLogin = async () =>{
        try{
            await login(email, password)
            router.push('../category')
        } catch(err){
            const errMap = {'auth/invalid-email': 'Please enter a valid email address',
        'auth/user-not-found': 'You have not signed up with this email',
        'auth/wrong-password': 'Email or password is incorrect',
        'auth/invalid-credential': 'Email or password is incorrect',
        'auth/too-many-requests': 'Too many attempts, please try again later',}
        setError(errMap[err.code] || err.message)
        }
        
    }

    return(
        <div className = 'h-screen w-full flex items-center justify-center flex-col gap-4 text-lg'>
        <h1 className='text-2xl font-bold'>LOGIN</h1>
         <LoginForm email = {email}
                    setEmail = {setEmail}
                    password = {password}
                    setPassword = {setPassword} 
                    onSubmit = {handleLogin}
                    />
        {error && <p className = 'text-red-500'>{error}</p>}
         <div className='flex gap-2 justify-center items-center'>
            <p>Create new account?</p>
            <Button variant = 'link' className = 'text-blue-500 text-lg' onClick = {() => router.push('/sign-up')}>Sign Up</Button>
         </div>
         
                    </div>
       
    )

}
