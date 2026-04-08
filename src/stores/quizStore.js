import { create } from 'zustand'

const useQuizStore = create((set) =>({
  difficulty: "easy",  
  changeDifficulty: (newDifficulty) => set({difficulty: newDifficulty}),
  autoPronounce: false,
  setAutoPronounce: (enabled) => set({ autoPronounce: Boolean(enabled) }),
  questionCount: 10,
  setQuestionCount: (count) => set({ questionCount: Number(count) }),

  category: "",
  setCategory: (cat) => set({category: cat}),
  
  index: 0,
  setIndex: (newIndex) => set({ index: newIndex }),
  incrementIndex: () => set((state)=> ({index: state.index + 1})),
  decrementIndex: () => set((state)=>({index:state.index -1})),
  resetIndex : () => set({index: 0}),
  
  selectedOption: null, 
  setSelectedOption: (option) => set({selectedOption: option}),

  isPaused: false,
  toggleIsPaused: () => set((state)=>({isPaused: !state.isPaused})),
  setIsPaused: (paused) => set({ isPaused: paused }),

  isFinished: false,
  setIsFinished: (option) => set({isFinished: option}),
   
  navigation: "both",
  setNavigation: (nav) => set({navigation:nav}),

  isSidebarOpen: false,
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
