import {create} from 'zustand'

const useQuizStore = create((set) =>({
  currentScore: 0,
  highestScore:0,
 
  incrementScore:() => set((state)=> ({
    currentScore: state.currentScore + 1
  })),
  resetScore: ()=>set( { currentScore:0 } )
  
}))

export default useQuizStore
