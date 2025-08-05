'use client'
import { Button } from "@/components/ui/button.jsx";
import Link from 'next/link'

function Dashboard() {
  return (
    <div className='h-screen overflow-hidden bg-blue-600'>
      <div className='bg-[url("/girlbg.jpg")] bg-cover bg-top h-[60%] w-full relative'>
        {/* Overlay */}
        <div className='absolute inset-0 bg-black/60 z-[1]'></div>
        {/* Text content */}
        <div className='relative z-[2] h-full flex items-center justify-center'>
          <span className='text-white text-3xl font-bold drop-shadow-lg'>
            NEXT SPELLING
          </span>
        </div>
      </div>
      <div className='bg-blue-600 h-[40%] z-[4] relative flex rounded-t-2xl items-center justify-center -translate-y-8'>
         <Link href='../login' >        
          <Button variant='default' className='shadow-lg text-2xl hover:cursor-pointer p-6'> Get Started
        </Button>
    </Link>
      </div>
    </div>
  );
}

export default Dashboard;
