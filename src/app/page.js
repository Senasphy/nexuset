'use client'
import {useEffect, useState} from 'react'
import {useAuth} from '../context/AuthContext'
import {useRouter} from 'next/navigation'
export default function Home(){
  const router = useRouter() 
  const {user, loading} = useAuth
  

  if (loading){
      return <div className = 'h-screen w-full flex flex-col justify-center items-center gap-2'>
        <h1 className = 'text-2xl font-bold'>Loading...</h1>
        <p className = 'text-lg'>Please wait while we load your data</p>
      </div>
  }
  useEffect(()=>{
    if (!loading){
      router.push('/dashboard')
    } }, [loading])
  return  user ? children : null
}
