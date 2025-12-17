"use client" 
import { useEffect } from 'react'
import categories from './categoryList'
import CategoryCard from '@/components/category-card.jsx'
import { useAuth } from '@/context/AuthContext'
import {useRouter} from 'next/navigation'
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/sidebar'
import { Menu } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
const CategoryPage = () => {

  const {username,logout } = useAuth()
  const router = useRouter()
   const {setIsSidebarOpen,  isSidebarOpen, setCategory, category} = useQuizStore(useShallow((state) => ({
    toggleSidebar: state.toggleSidebar,
    setIsSidebarOpen: state.setIsSidebarOpen,
    category: state.category,
    setCategory: state.setCategory
  })))
  async function handleSignout(logout){
    try{
      await logout;
      router.push('/login')
    }
    catch(err){
      console.error('Error signing out:', err);
    }
  }


   

  return (
   
   
    <div className='h-full dark:bg-dark-bg bg-cover bg-center relative w-full flex flex-col'>
    {isSidebarOpen && <div className='fixed inset-0 bg-black/50 '> </div> }
            <div className = 'flex items-center justify-between p-8 '>
                <p className= "transition-all ease-in-out hover:underline hover:text-red-600 hover:cursor-pointer active:scale-95" 
                onClick = {()=>handleSignout(logout)}>Sign Out</p>

               <Button onClick={()=>{setIsSidebarOpen(true); console.log(isSidebarOpen)}} variant='custom'>   <Menu color="black"/> </Button>
         </div>
           <div className="flex  flex-col text-center text-3xl  px-4">
              <p> Welcome {username} </p>

             <p> What do you want to practice today?</p>
             
            </div>
            
            <Sidebar />
 
    {categories.map((item,index) => {
        return <button key = {item.description + index} className='flex flex-col justify-center item-center' 
          onClick={()=> {setIsSidebarOpen(false) 
          setCategory(item.name.toLowerCase())
          console.log("category: ", category)}}  >
        <CategoryCard category = {item} /> 
      
      </button>
      
    })}
      
          
</div>

  )}

export default CategoryPage
