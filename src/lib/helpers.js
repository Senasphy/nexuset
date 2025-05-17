import {addDoc} from 'firebase/firestore'
import {db} from '@/lib/helpers'
 
 
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
    const isCorrect = data[index].correctAnswer === item;
    setSelectedOption(optionIndex);
    setCorrectOption(isCorrect);
  
    if (!isDone.includes(data[index].id)) {
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
      setIsDone((prevState) => [...prevState, data[index].id]);
    }
  }



export function submitScore() {
    updateScore();
    alert(`Your score of ${score} has been updated`);
    resetQuestion();
  }



async function updateScore() {
    try {
      await addDoc(collection(db, "scores"), {
        username,
        score,
      });
    } catch (err) {
      console.log("Error found: ", err);
    }
  }

