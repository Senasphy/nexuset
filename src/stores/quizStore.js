import { create } from 'zustand'

const useQuizStore = create((set) =>({
  difficulty: "easy",  
  changeDifficulty: (newDifficulty) => set({difficulty: newDifficulty}),

  index: 0,
  incrementIndex: () => set((state)=> ({index: state.index + 1})),
  decrementIndex: () => set((state)=>({index:state.index -1})),
  resetIndex : () => set({index: 0}),
  
  selectedOption: null, 
  setSelectedOption: (option) => set({selectedOption: option}),
  
}))
export default useQuizStore;
