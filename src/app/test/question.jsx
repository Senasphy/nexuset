"use client"
import { useRef, useState, useEffect } from "react"

export default function Question({ question }) {
  const inputRefs = useRef([])
  const word = question?.correctAnswer || "";
  
  const [userAnswer, setUserAnswer] = useState(new Array(word.length).fill(""))
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    setUserAnswer(new Array(word.length).fill(""))
    setIsError(false)
    setIsSuccess(false)
  }, [word])

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const char = value.toLowerCase();

    const newAnswer = [...userAnswer];
    newAnswer[index] = char;
    setUserAnswer(newAnswer);
    if (isError) setIsError(false);

    if (char && index < word.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (index === word.length - 1 && char !== "") {
      const finalString = newAnswer.join("").toLowerCase();
      if (finalString === word.toLowerCase()) {
        setIsSuccess(true);
        setIsError(false);
      } else {
        setIsError(true);
        setIsSuccess(false);
      }
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!userAnswer[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  }

  const getBorderColor = () => {
    if (isSuccess) return "border-green-500 border-4 bg-green-50";
    if (isError) return "border-red-500 bg-red-50 border-4 animate-shake"; 
    return "border-gray-300 focus:border-blue-500";
  }

  return (
    <div className="h-screen w-full flex px-12  flex-col justify-center items-center gap-10">
      <ul className="flex gap-4">
        {userAnswer.map((char, index) => (
          <li key={index}>
            <input
              type='text'
              maxLength={1}
              value={char} // This makes it a "Controlled Component"
              className={`h-14 w-10 text-center rounded-md bg-white text-black text-3xl border-2 transition-colors outline-none uppercase ${getBorderColor()}`}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          </li>
        ))}
      </ul>
      
      {isSuccess && <p className="text-green-600 font-bold">Perfect! 🎉</p>}
      {isError && <p className="text-red-500 font-bold">Try again! ❌</p>}

      <div className="w-full max-w-2xl p-6 border-2 border-dashed  rounded-xl bg-gray-50/50 text-center italic text-gray-600">
        <span className="font-bold not-italic block mb-2 text-gray-400 uppercase text-xs tracking-widest">Definition</span>
  "{question.definition}"
      </div>
   </div>
  )
}
