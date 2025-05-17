import React from 'react'
import {ChevronLeft} from 'lucide-react'
import {useRouter} from 'next/navigation'

const MainHeader = () => {
  const router = useRouter()
  return (
     <div className="flex w-full sticky top-0 justify-between items-center px-4 p-2 bg-white">
        <ChevronLeft
          size="32"
          onClick={() => {
            router.back()
          }}
          className="hover:scale-105 hover:cursor-pointer"
        />
        <img
          src="/random.jpg"
          alt="User Profile"
          className="border-2 shadow-md h-14 w-14 rounded-[100%]"
        />
        </div>
  )
}

export default MainHeader 