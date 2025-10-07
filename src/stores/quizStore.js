import { create } from 'zustand'

const useQuizStore = create((set) =>({
  difficulty: "easy",  
  changeDifficulty: (newDifficulty) => set({difficulty: newDifficulty}),

  category: "",
  setCategory: (cat) => set({category: cat}),
  
  index: 0,
  incrementIndex: () => set((state)=> ({index: state.index + 1})),
  decrementIndex: () => set((state)=>({index:state.index -1})),
  resetIndex : () => set({index: 0}),
  
  selectedOption: null, 
  setSelectedOption: (option) => set({selectedOption: option}),

  isPaused: false,
  toggleIsPaused: () => set((state)=>({isPaused: !state.isPaused})),

  isFinished: false,
  setIsFinished: (option) => set({isFinished: option}),
   
  navigation: "both",
  setNavigation: (nav) => set({navigation:nav}),

  isSidebarOpen: true,
  toggleSidebar: () => set((state) =>({isSidebarOpen: !state.isSidebarOpen})),
  setIsSidebarOpen: (sidebarStatus) => set({
    isSidebarOpen: sidebarStatus
  }),

  categoricalStat: [],
  setCategoricalStat: (stat) => set({categoricalStat: stat}),

  chronologicalStat: [],
  setChronologicalStat: (stat) => set({chronologicalStat: stat})

}))
export default useQuizStore;
