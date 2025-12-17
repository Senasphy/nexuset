'use client'
import {useState} from 'react'
import {useAuth} from '@/context/AuthContext'
import {useRouter} from 'next/navigation'
import LoginForm from '@/components/login-form'
import {Loader} from 'lucide-react'
import {Button}from '@/components/ui/button'

export default function Login(){
    const {login,loading} = useAuth()
    const [actionLoading, setActionLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    
    const handleLogin = async () =>{
        setActionLoading(true)
        try{
            await login(email, password)
            router.push('../categories/')
        } catch(err){
            const errMap = {'auth/invalid-email': 'Please enter a valid email address',
        'auth/user-not-found': 'You have not signed up with this email',
        'auth/wrong-password': 'Email or password is incorrect',
        'auth/invalid-credential': 'Email or password is incorrect',
        'auth/too-many-requests': 'Too many attempts, please try again later',}
        setError(errMap[err.code] || err.message)
        }finally{
            setActionLoading(false)
        }
        
    }
    if(actionLoading || loading) return(

     <div className="bg-greenGirl-bg bg-cover bg-center flex gap-2 w-full h-screen text-lg items-center justify-center ">

    <Loader className='animate-spin text-white w-8 h-8 ' /> <p className='text-white text-4xl'> Loading...</p>
    </div>
)
    else{return(
        <div className = 'bg-greenGirl-bg bg-cover bg-center  h-screen w-full flex items-center justify-center flex-col gap-4 '>
<div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10  w-full text-white">
        <h1 className='text-6xl text-center font-bold'>LOGIN</h1>
        <div className='text-2xl  p-8 flex flex-col items-center  '>
         <LoginForm email = {email}
                    setEmail = {setEmail}
                    password = {password}
                    setPassword = {setPassword} onSubmit = {handleLogin} />
        {error && <p className = 'text-red-500'>{error}</p>}
        </div>
         <div className='flex text-2xl gap-2 justify-center items-center'>
            <p>Create new account?</p>
            <Button variant = 'link' className = 'text-blue-500 text-md' onClick = {() => router.push('/sign-up')}>Sign Up</Button>
         </div>
      </div>
         
                    </div>
       
    )}

}
