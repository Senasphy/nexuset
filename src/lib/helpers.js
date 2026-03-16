import {addDoc, collection, doc, serverTimestamp, query, where, average,  getDocs, sum, getAggregateFromServer} from 'firebase/firestore'
import useScoreStore from '@/stores/scoreStore'
import { db } from '@/lib/firebase'

 
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

export async function addNewDocument(){
  if (!db) return;
  try{
  const docRef = doc(collection(db, 'users', user.uid))
  const colRef = collection(docRef, 'usage-data', user.uid)
  await setDoc(colRef, {
    category: "science",
    completed: "false"
  })
  }catch(error){
    console.error("Failed to add document: ", error)
  }
}

export function handleAnswer(data, item, optionIndex, index) {
    const  incrementScore  = useScoreStore((state)=> state.incrementScore)
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


export async function updateScore(updateObject, user) {
  if (!db) return;
  if(user){
    try {
      const docRef = doc(db, 'users', user.uid);
      const sessionColRef = collection(docRef, 'sessions')
      const setScore = await addDoc(sessionColRef, {
        category: updateObject.category,
        completed: updateObject.completed,
        difficulty: updateObject.difficulty,
        duration: updateObject.duration,
        createdAt: serverTimestamp()
      })
       
        console.log("new score data", setScore ) 
   } catch (err) {
      console.log("Error found: ", err);
    }
  }
}



export async function queryByTime(user, time){
  if (!db) return;
  const rangeObject = getTimeRange(time)
  try{
      const docRef = doc(db, 'users', user.uid);
      const sessionColRef = collection(docRef, 'sessions')
      const q = query(sessionColRef, where("createdAt", ">", rangeObject.startTime), where("createdAt", "<", rangeObject.endTime))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log("filtered Data: " , doc.data())
      })
  }catch(e){
    console.error("Error filtering by time: ", e)
  }
  
   
}
export function getTimeRange(time){
  let now = new Date();
  let startTime, endTime

  switch(time){

    case 'today':
      startTime = new Date(now) //using startTime = now would reference now directly and mutates it in the following lines
      startTime.setHours(0,0,0,0)
      endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      endTime.setHours(0,0,0,0)
      break;

    case 'thisWeek':
      const day = now.getDay()
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day )
      endTime = new Date(now.getFullYear(), now.getMonth(), startTime.getDate() + 7)
      break;
      
    case 'thisMonth':
      startTime = new Date(now.getFullYear(), now.getMonth(), 1)
      endTime  = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      break;

    case 'thisYear':
      startTime = new Date(now.getFullYear(), 0,1)
      endTime = new Date(now.getFullYear() + 1, 0,1)
      break;

    default:
      return null;
}
  return {startTime, endTime} 
}

export async function filterByCategory(user, category){
  if (!db) return;
  const userDoc = doc(db, 'users', user.uid)
  const sessionRef  = collection(userDoc, 'sessions') 
  const q = query(sessionRef, where('category', '==',category))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) =>{
    console.log("maths data: ", doc.data())
  })

}

/* 
    type userData =  {
        totalTime:int 
        averageTime: int 

        completeSessions: int 
        incompleteSessions: int 
        totalSessions: int 

        averageScore: int 
        highestScore: int 
    }
  */

export async function getTime(user, categories ){
    if (!db) return;
    let userData = {}
    let snapshot;
    for (let i = 0; i < categories.length; i++){
      const currentCategory = categories[i]
      try{
      const docRef = doc(db, 'users', user.uid);
      const sessionRef = collection(docRef, 'sessions')
      if( currentCategory === "total"){
        snapshot = await getAggregateFromServer(sessionRef, {
          totalTime: sum("duration"),
          averageTime: average("duration")
      })
        userData.totalTime = snapshot.totalTime
        userData.averageTime = snapshot.averageTime

      }else{
        const q = query(sessionRef, where("category", "===",  currentCategory));
        snapshot = await getAggregateFromServer(q, {
          totalTime: sum("duration"),
          averageTime: average("duration")
        })
        userData[`${currentCategory}TotalTime`]  = snapshot.totalTime;
        userData[`${currentCategory}AverageTime`] = snapshot.averageTime
       }
      

      
    }catch(e){
      console.error("Error: " ,e)
      return
  }
}
    }
