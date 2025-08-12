import {addDoc} from 'firebase/firestore'
import useScoreStore from '@/stores/scoreStore'
 
 
 export function handleOption(idx) {
    switch (idx) {
      case 0:
        return "A";
      case 1:
        return "B";
      case 2:
        return "C";
      case 3:
        return "D";
    }
  }



 export function handleAnswer(data, item, optionIndex, index) {
    const incrementScore = useScoreStore((state)=> state.incrementScore)
    const isCorrect = data[index].correctAnswer === item;
    setSelectedOption(optionIndex);
    setCorrectOption(isCorrect);
  
    if (!isDone.includes(data[index].id)) {
      if (isCorrect) {
        incrementScore()
      }
      setIsDone((prevState) => [...prevState, data[index].id]);
    }
  }



export function submitScore(score) {
    updateScore(score);
    alert(`Your score of ${score} has been updated`);
    resetQuestion();
  }



async function updateScore(score) {
    try {
      await addDoc(collection(db, "scores"), {
        username,
        score,
      });
    } catch (err) {
      console.log("Error found: ", err);
    }
  }

