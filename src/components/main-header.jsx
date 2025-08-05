'use client';
import {useRouter} from 'next/navigation'
import { useState, useEffect} from 'react';
import { Menu, X, ToggleLeft, ChevronLeft} from 'lucide-react';
import {Button} from '@/components/ui/button'
import Timer from '@/components/timer'

export default function Sidebar({setTimeover, setHasQuit,setCurrentTime}) {
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState(false)
  const router = useRouter()
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  useEffect(()=>{
    if(completed){
    }
    
  }, [completed])
  return (
    <div className="relative flex justify-between items-center py-2 w-full ">

    <ChevronLeft size={32} onClick ={
      ()=> {
        if(!completed){
          setHasQuit(true)
          return
        }
        router.back();
      }
    } />

      <div className =  ' p-1 border-2 border-black rounded-md '>
    <Timer duration={10000}  setCurrentTime={setCurrentTime} setCompleted={setCompleted} completed={completed} setTimeover={setTimeover}/>
    </div>
    
      <Button variant='custom'
        onClick={toggleSidebar}
        className="top-4 right-4 z-[1000] transition-colors"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-black text-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-[1000]`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4"> Next Spelling</h2>
          <ul className="space-y-2">
            <li className='flex justify-between w-full'>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                Navigation
              </a>
              <ToggleLeft size={36} />
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                Theme
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[900]"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
