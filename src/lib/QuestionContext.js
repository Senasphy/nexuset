'use client'
import {createContext, useContext, useState} from 'react'
const QuestionContext = createContext()

export function QuestionProvider({children}){
    const [index, setIndex] = useState(0)
    const [difficulty, setDifficulty] = useState("easy")

    return(
        <QuestionContext.Provider value = {{index, setIndex,difficulty, setDifficulty}}>
            {children}
        </QuestionContext.Provider>
    )

}

export function useQuestionContext(){
    const context = useContext(QuestionContext)
    if (!context){
        throw new Error("useQuestionContext must be used within a QuestionProvider")
    }
    return context
}