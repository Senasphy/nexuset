import {Button} from '@/components/ui/button.jsx' 
const CategoryScroll = ({difficulty, setDifficulty}) => {
return (
    <div className="overflow-hidden my-4">
    <div className="flex gap-4  overflow-x-auto px-8 py-2 font-bold flex items-center justify-center">
    <Button variant = "scroll" className = {`font-bold text-lg hover:scale-105
        transition duration-300 hover:opacity-75 p-6 px-8 ${difficulty === "easy" ? "bg-black text-white": ""} `} 
        onClick = {()=>setDifficulty("easy")} >Easy</Button>
        <Button variant = "scroll" className = {`font-bold text-lg hover:scale-105 transition
        duration-300 hover:opacity-75 p-6 ${difficulty === "medium" ? "bg-black text-white": ""}`} 
        onClick = {()=>setDifficulty("medium")}>Medium</Button>
        <Button variant = "scroll" className = {`font-bold text-lg hover:scale-105 transition
        duration-300 hover:opacity-75 p-6 px-8 ${difficulty ===  "hard" ? "bg-black text-white": ""}`}
        onClick = {()=>setDifficulty("hard")}>Hard</Button>
    </div>
    </div>
);
};

export default CategoryScroll

