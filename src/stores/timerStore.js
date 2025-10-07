import {create} from 'zustand'

const useTimerStore = create((set) =>({
    time: 0,
    isRunning: false,
    startTimer: () => set({isRunning:true}),
    pauseTimer: ()=> set({isRunning: false}),
    resetTimer: () => set({time:0, isRunning:false}),
    restartTimer:() => set({time:0, isRunning:true}),
    countdownTime: 0,
    setCountdownTime: (seconds) => set({countdownTime: seconds}),
    incrementTimer: () => set((state) => ({time: state.time + 1}))
}))
export default useTimerStore;
