"use client"
import categories from './categoryList'
import CategoryCard from '@/components/category-card.jsx'
import {logOut, useAuth} from '@/context/AuthContext'
import {useRouter} from 'next/navigation'

  
const CategoryPage = () => {
  const {username} = useAuth()
  const router = useRouter()
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
   
   
    <div className="h-screen w-full ">
            <div className = 'w-full h-[30%] flex flex-col items-between justify-between mb-4'>
            <div className = 'flex items-center justify-end'>
                <p className="m-8 transition-all ease-in-out hover:underline 
                hover:text-red-600 hover:cursor-pointer active:scale-95" 
                onClick = {()=>handleSignout(logOut)}>Sign Out</p>
            </div>
            <div className="flex  flex-col items-end text-2xl font-bold px-4">
              <p> Welcome {username} </p>

             <p> What do you want to practice today?</p>
             
            </div>
            
         {categories.map((item,index) => {
        return <div key = {item.description + index} className='flex flex-col justify-center item-center' >
        <CategoryCard category = {item} /> 
      
      </div>
      
    })}
            </div>
          
</div>


  )
}

export default CategoryPage
