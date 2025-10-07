import { useShallow } from 'zustand/react/shallow'
import { Menu,  X} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useQuizStore from '@/stores/quizStore'
import useTimerStore from '@/stores/timerStore'

function Sidebar(){
  const { theme, setTheme } = useTheme()
  
  const {difficulty, changeDifficulty, navigation, setNavigation, isSidebarOpen, setIsSidebarOpen} = useQuizStore(useShallow((state) => ({
    difficulty: state.difficulty,
    changeDifficulty: state.changeDifficulty,
    navigation: state.navigation,
    setNavigation: state.setNavigation,
    isSidebarOpen: state.isSidebarOpen,
    setIsSidebarOpen: state.setIsSidebarOpen,

  })))

  const { countdownTime, setCountdownTime, resetTimer, startTimer} = useTimerStore(useShallow((state)=>({
    countdownTime: state.countdownTime,
    setCountdownTime: state.setCountdownTime,
    resetTimer: state.resetTimer,
    startTimer: state.startTimer
  })))

  function handleChangeTime(time){
    resetTimer()
    setCountdownTime(time);
    startTimer()
  }
  
   return(
      <div
        className={`fixed top-0 right-0  h-screen w-[70%] bg-white dark:text-white dark:bg-black text-black shadow-xl transform ${
          isSidebarOpen ?   'translate-x-0':'translate-x-full'  
        } transition-transform duration-300 ease-in-out  [&>*]:px-4 py-8`}
      >
        <div className=" w-full pb-4 flex justify-between">
          <h2 className="text-2xl">Next Spelling</h2>
        <div className = "">
               <Button variant='custom'
        onClick={()=>{
          setIsSidebarOpen(false)
        console.log("isSidebarOpen: ", isSidebarOpen)}
        }
        className="top-4 right-4  transition-colors"
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
     <X  color="black" />
      </Button>

</div>
     </div>
      <div>


     
          <ul className="space-y-2  hover:[&>*]:opacity-95">
 <li>
     <div className='flex justify-between items-center p-2 w-full dark:text-white'>
     <span>Navigation</span>
                    <Select value = {navigation} onValueChange={setNavigation}>
  <SelectTrigger  className='max-w-[50%]'>
    <SelectValue placeholder="Swipe" />
  </SelectTrigger>
  <SelectContent className = 'z-[10001]'>
    <SelectItem value="both">Swipe</SelectItem>
    <SelectItem value="swipe">Buttons</SelectItem>
    <SelectItem value="buttons">Both</SelectItem>
  </SelectContent>

</Select> 
     </div>

    </li>
 <li>
     <div className='flex justify-between items-center p-2 w-full '>
     <span>Theme</span>
                    <Select value={theme} onValueChange={setTheme}>
  <SelectTrigger  className='max-w-[50%]'>
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent className = 'z-[10001]'>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>

</Select> 
     </div>

    </li>

            <li>
     <div className='flex justify-between p-2  items-center w-full  '>
               <span>Difficulty</span>    <Select value = {difficulty} onValueChange= {changeDifficulty}>
     <SelectTrigger className='max-w-[50%]'>
    <SelectValue placeholder="Difficulty" />
  </SelectTrigger>
  <SelectContent className = 'z-[10001]'>
    <SelectItem value="easy" className='flex justify-between'>Easy</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="hard">Hard</SelectItem>
  </SelectContent>

</Select> 
</div>
    </li>
 <li>
     <div className='flex justify-between dark:text-white items-center p-2 w-full '>
     <span>Time</span>
                    <Select value={countdownTime} onValueChange={handleChangeTime} className='w-[40%]'>
  <SelectTrigger  className='max-w-[50%]'>
    <SelectValue placeholder="Time" />
  </SelectTrigger>
  <SelectContent className = 'z-[10001]'>
    <SelectItem value={50}>Fast(10 minutes)</SelectItem>
    <SelectItem value={60}>Moderate(15 minutes)</SelectItem>
    <SelectItem value={70}>Slow(20 minutes)</SelectItem>
  </SelectContent>
     

</Select> 
     </div>

    </li>
          <li>
              <a href="#" className="block p-2 hover:bg-secondary/10 rounded">
                Contact
              </a>
            </li>

         </ul>
</div>
      </div>)}
export default Sidebar
