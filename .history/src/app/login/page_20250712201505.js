'use client'
import {useEffect, useState} from 'react'
import {useAuth} from '@/context/AuthContext'
import {useRouter} from 'next/navigation'
import LoginForm from '@/components/login-form'
import { Button } from '@/components/ui/button';
import {Loader} from 'lucide-react'
import {getRedirectResult } from 'firebase/auth'
import {auth} from '@/lib/firebase'

export default function Login(){
    
    const {login,loading, signInWithGoogleRedirect,setUser} = useAuth()
    const [actionLoading, setActionLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        getRedirectResult(auth)
        .then((result) => {
            if (result && result.user) {
                const user = result.user;
                setUser(user);
                console.log("user:" , user)
                console.log("Pushing to a different link")
                router.push('/categories');
            }
            else{
                console.log("No google sign-in result")
            }
        })
        .catch((error) => console.error("Error: ", error))


    }, [])

  
    const handleLogin = async () =>{
        setActionLoading(true)
        try{
            await login(email, password)
            router.push('../categories')
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
 <div className='flex gap-2 w-full h-screen text-lg items-center justify-center '>
    <Loader className='animate-spin'/>Loading...
    </div>
)
    else{
        return(
    
        <div className = 'flex min-h-svh w-full items-center justify-center p-6 md:p-10 '>
            
       <div className = 'w-[30%] flex h-[70%] flex-col items-center justify-center border-solid border-black border-2 rounded-lg p-2'>
                <div className='text-lg w-full'>
         <LoginForm email = {email}
                    setEmail = {setEmail}
                    password = {password}
                    setPassword = {setPassword} 
                    onSubmit = {handleLogin}
                    signInWithGoogleRedirect= {signInWithGoogleRedirect}
                    />
        {error && <p className = 'text-red-500 flex w-full items-center'>{error}</p>}
        </div>
       
         <div className='flex text-md gap-2 justify-center items-center'>
            <p>Create new account?</p>
            <Button variant = 'link' className = 'text-blue-500 text-md' onClick = {() => router.push('/sign-up')}>Sign Up</Button>
         </div>

         </div>

                    </div>
       
    )}

}
