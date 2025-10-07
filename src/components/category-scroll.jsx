import {Button} from '@/components/ui/button.jsx' 
import useQuizStore from '@/stores/quizStore'
import {shallow} from 'zustand/shallow'
import { useShallow } from 'zustand/react/shallow'
const CategoryScroll = ({setSelectedOption}) => {
  const difficulties = ["easy", "medium", "hard"]
  const {difficulty, changeDifficulty} = useQuizStore(useShallow((state)=>({
    difficulty: state.difficulty,
    changeDifficulty: state.changeDifficulty
  })), shallow );
  return (
    <div className="  w-full ">
    <div className="flex  w-[100%]   py-2 font-bold flex  justify-between">
  
    {   difficulties.map((item) =>{
       return( 
       <Button key = {item} variant="scroll" className= {`font-bold text-lg hover:scale-105
        transition duration-300 hover:opacity-75 shadow-md p-6 px-8 ${difficulty === item ? "bg-black shadow-md text-white": ""} `} 
          onClick = { 
            () => {
            changeDifficulty(item);
            }} > {item}</Button>)
    })}
  
    </div>
    </div>
);
};

export default CategoryScroll

