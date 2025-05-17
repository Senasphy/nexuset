"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addDoc, getDoc, collection, doc } from "firebase/firestore";
import {db} from "../../lib/firebase.js"; 
import {Pi, MapPin, BookText, FlaskConical, LayoutGrid, ChevronLeft, RotateCcw, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import {useAuth}  from '../../context/AuthContext'
import {useRouter} from 'next/navigation'


export default function DisplayData({ username }) {
  const id = 'IE3bvXDlpMMUYaSP715l8OH2sni1'
  const router = useRouter()
  const { user, loading , logout} = useAuth();
  const [unfilteredData, setUnfilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [storedScores, setStoredScores] = useState([]);
  const [isSideBarOpen, setIsSideBarOpen] =  useState(false)
  const [isMainPageOpen, setIsMainPageOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [copyData, setCopyData] = useState([])
  const [isClient, setIsClient] = useState(false)
  const [name, setName] = useState("")
 

  useEffect(() => {
    setIsClient(true)
  },[])
  
  useEffect(() => {
    if (isClient) {
      if (!user) {
        console.log('Dashboard: No user, redirecting to /login');
        router.push('/login');
      } 
    }
  }, [user, loading, isClient, router]);

  async function handleName(userID) {
    const snapDoc = await getDoc(doc(db, 'users',userID))
    if (snapDoc.exists()){
        const data = snapDoc.data()
        setName(data.username)
        console.log(user)
        
    }else{
      console.log("User not found")
    }
    
   }
  useEffect(()=>{
    if (user) handleName(user.uid)
  },[router])
  

  function handleDifficulty(level){
      setDifficulty(level)
      const filteredData = copyData.filter((item) => item.difficulty === level);
      setData(filteredData);
    }
    
    
    const CategoryScroll = () => {
    return (
      <div className="overflow-hidden my-4">
        <div className="flex gap-4  overflow-x-auto px-4 py-2 font-bold">
        <Button variant = "scroll" className = {`font-bold text-lg hover:scale-105
         transition duration-300 hover:opacity-75 p-6 ${difficulty === "easy" ? "bg-black text-white": ""} `} 
         onClick = {()=>handleDifficulty("easy")} >Easy</Button>
          <Button variant = "scroll" className = {`font-bold text-lg hover:scale-105 transition
           duration-300 hover:opacity-75 p-6 ${difficulty === "medium" ? "bg-black text-white": ""}`} 
           onClick = {()=>handleDifficulty("medium")}>Medium</Button>
          <Button variant = "scroll" className = {`font-bold text-lg hover:scale-105 transition
           duration-300 hover:opacity-75 p-6 ${difficulty ===  "hard" ? "bg-black text-white": ""}`}
           onClick = {()=>handleDifficulty("hard")}>Hard</Button>
        </div>
      </div>
    );
  };



useEffect(() => {
  if (selectedCategory) {
    setIsLoading(true);
    fetchData();
  }
}, [selectedCategory]);
if (loading) return <h1 className="h-screen w-full flex items-center justify-center">Loading...</h1>


  
  const fetchData = ()=>{
    fetch(`https://vercel-backend-6z0uebn2u-senasphys-projects.vercel.app/api/${selectedCategory}`)
    
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then((jsonData) => {
        const unshuffled = [...jsonData];
        for (let i = unshuffled.length - 1; i > 0; i--) {
          const j = Math.floor(0.5 * (i + 1));

          {/*the 0.5  is being used as a temporary fix for the hydration issue caused
            by Math.rand(). Another shuffling algorithm is recommended*/}
          [unshuffled[i], unshuffled[j]] = [unshuffled[j], unshuffled[i]];
        }
        setUnfilteredData(unshuffled);
        const filteredData = unshuffled.filter((item) => item.difficulty === difficulty);
        setCopyData(unshuffled)
        setData(filteredData);
        setIsLoading(false)
      })
      .catch((error)   => console.log("Error", error));
    }

  const categories = {
    All: <LayoutGrid className="bg-transparent" />,
    Math: <Pi className="bg-transparent" />,
    English: <BookText className="bg-transparent" />,
    Geography: <MapPin className="bg-transparent" />,
    Science: <FlaskConical className="bg-transparent" />,
  };

  
  async function handleSignout(logout){
    try{
      await logout;
      console.log('User signed out successfully');
      router.push('/login')
    }
    catch(err){
      console.error('Error signing out:', err);
    }
  }
  function selectCategory(key) {
    setSelectedCategory(key);
    handleCategory(key);
    setIndex(0);
  }

  function DisplayScores() {
    return (
      <div className="rounded-full m-4 p-4 bg-transparent">
        <ul className="rounded-lg">
          {storedScores.map((score) => (
            <li key={score.id}>
              {score.username}: {score.score}
            </li>
          ))}
        </ul>
      </div>
    );
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

  function handleNextQuestion() {
    setIndex((index) => index + 1);
    setCorrectOption(null);
    setSelectedOption(null);
  }

  const HomePage = () => {
    return (
      <div className="container mx-auto">
        <CategoryScroll categories={categories} />
      </div>
    );
  };

  function handlePreviousQuestion() {
    setIndex((index) => index - 1);
    setCorrectOption(null);
    setSelectedOption(null);
  }

  function handleResetQuestion() {
    setIndex(0);
    setScore(0);
  }

  function handleOption(idx) {
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

 
  function handleAnswer(item, idx) {
    const isCorrect = data[index].correctAnswer === item;
    setSelectedOption(idx);
    setCorrectOption(isCorrect);
  
    if (!isDone.includes(data[index].id)) {
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
      setIsDone((prevState) => [...prevState, data[index].id]);
    }
  }

  function handleSubmit() {
    updateScore();
    alert(`Your score of ${score} has been updated`);
    handleResetQuestion();
  }
  

  function toggleSideBar(){
    setIsSideBarOpen((prev) => !prev)
  }

  function Hero(){
    return(<>
        <div className="h-screen w-full">
            <div className = 'w-full h-[30%] flex flex-col items-between justify-between'>
            <div className = 'flex items-center justify-end'>
                <p className="m-8 transition-all ease-in-out hover:underline 
                hover:text-red-600 hover:cursor-pointer active:scale-95" onClick = {()=>{handleSignout(logout)
                
                }}>Sign Out</p>
            </div>
            <div className="flex  flex-col items-end text-2xl font-bold px-4">
              <p> Welcome, {name}</p>
             <p> What do you want to practice today?</p>
            </div>
            </div>
            <div className="fixed bottom-0 w-full h-[70%] bg-[#F3EBE4] shadow-2xl border 
            rounded-t-2xl flex flex-col justify-between p-4 gap-4 overflow-y-auto">

                <div className="rounded-2xl shadow-md flex gap-2 flex-col bg-[#F3C5C5] 
                p-4 hover:opacity-75 hover:cursor-pointer "  onClick = {()=>{
                  setSelectedCategory("general")
                  setIsMainPageOpen(true)
                  handleName(id)
                }
                }
                >
               <div className="flex gap-2 items-center">
               <LayoutGrid size = {18}/>
               <div className="flex w-full justify-between ">
               <p>General</p>
               <span className="bg-white px-3 text-[14px] rounded-full shadow-md">
               ⭐ {4.8}
                </span>   </div>            </div>
               <p>Spell words from every field!</p>
               
              <p className="text-sm ">High Score: {45}</p>
               
                </div>

                <div className="rounded-2xl flex flex-col gap-2 shadow-md 
                bg-[#F9E1C0] p-4 hover:opacity-75 hover:cursor-pointer" onClick = {()=>{
                  setSelectedCategory("geography")
                  setIsMainPageOpen(true)
                }
                }>
               <div className="flex gap-2 items-center">
               <MapPin size = {18}/>
               <div className="w-full flex justify-between">
                <p>Geography</p>
               <span className="bg-white px-3 text-[14px] rounded-full shadow-md">
               ⭐ {4.8}
                </span>
                </div>  
               </div>
               <p>Spell global places right!</p>
               <p className="text-sm ">High Score: {45}</p>
          
                </div>


                


                <div className="rounded-2xl  flex flex-col gap-2 shadow-md bg-[#C0F1DC]
                 p-4 hover:opacity-75 hover:cursor-pointer"  onClick = {()=>{
                  setSelectedCategory("science")
                  setIsMainPageOpen(true)
                }
                }>
               <div className="flex gap-2 items-center">
               <FlaskConical size = {18}/>
               <div className="flex w-full justify-between"><p>Science</p>
               <span className="bg-white px-3 text-[14px] rounded-full shadow-md">
               ⭐ {4.8}
                </span>  
                </div>
               </div>
               <p>Nail science word spellings!</p>
               <p className="text-sm ">High Score: {45}</p>
               
                </div>

                <div className="rounded-2xl flex flex-col gap-2 shadow-md bg-[#F8B575] p-4 
                hover:opacity-75 hover:cursor-pointer"  onClick = {()=>{
                  setSelectedCategory("english")
                  setIsMainPageOpen(true)
                }
                }>
               <div className="flex gap-2 items-center">
               <BookText size = {18}/>
              
               <div className="flex w-full justify-between">
               <p>English</p>
               <span className="bg-white px-3 text-[14px] rounded-full shadow-md">
               ⭐ {4.8}
                </span>  
                </div>
               </div>
               <p>Perfect your word spelling!</p>
               <p className="text-sm ">High Score: {45}</p>
               
                </div>
                <div className="rounded-2xl flex flex-col gap-2 shadow-md 
                bg-[#D5D3FF]  p-4 hover:opacity-75 hover:cursor-pointer" onClick = {()=>{
                  setSelectedCategory("math")
                  setIsMainPageOpen(true)
                }
                }>
               <div className="flex gap-2 items-center">
               <Pi size = {18}/>
               <div className="w-full flex justify-between">
                <p>Mathematics</p>
               <span className="bg-white px-3 text-[14px] rounded-full shadow-md">
               ⭐ {4.8}
                </span>
                </div>  
               </div>
               <p>Master Math Spellings!</p>
               <p className="text-sm ">High Score: {45}</p>
          
                </div>


                
                <Button onClick = {()=>
                  setIsMainPageOpen(true)
                }> Go to the main page</Button>
            </div>

        </div>
        </>
    )
}

  function DisplayQuestion() {
    return (
      <>
      <div className="flex gap-12 align-center justify-center w-full mt-8">
      <div className="flex flex-col justify-center h-screen w-screen items-center mt-4">
        <div className="flex w-full sticky top-0 justify-between items-center px-4 p-4 bg-white">
        <ChevronLeft
          size="32"
          onClick={() => {
          setIsMainPageOpen(false);
          setSelectedCategory(null);
          setIndex(0);
          setScore(0);
          setData([]);
          }}
          className="hover:scale-105 hover:cursor-pointer"
        />
        <img
          src="/random.jpg"
          alt="User Profile"
          className="border-2 shadow-md h-14 w-14 rounded-[100%]"
        />
        </div>
        <HomePage className="flex items-center justify-center text-center w-full" />

        <div className="p-2 mx-4 flex flex-col w-full gap-4 items-center px-4">
        <p className="mx-2 w-full text-center bg-[#F9E1C0] border-1 py-12 px-4 shadow-md rounded-2xl text-xl md2:text-xl flex justify-center items-center">
          {data[index].definition}
        </p>
        <div
          key={data[index].definition}
          className="flex flex-col px-2 items-center justify-center gap-4 md2:text-xl mb-4 w-full"
        >
          {data[index].options.map((item, optionIndex) => {
          const isSelected = selectedOption === optionIndex;
          const variant = isSelected ? data[index].correct_answer === item ? "correct" : "destructive" : "custom";
         
            return (
            <Button
              className="py-6 text-md rounded-full mx-2 md2:text-[.9rem] w-full shadow-md"
              key={item}
              variant={variant}
              onClick={(e) => {
              handleAnswer(item, optionIndex);
              e.target.blur();
              }}
            >
              {handleOption(optionIndex)}: {item}
            </Button>
            );
          })}
        </div>
        </div>
       
        <div className="flex gap-4">
        <Button
          className="px-2 py-7 text-lg font-light md2:text-xl rounded-2xl shadow-md"
          variant="custom"
        >
          Score: {score}
        </Button>

        <div
          className="px-4 py-4 bg-[#D8D8FF] text-lg font-bold md2:text-xl rounded-2xl shadow-md font-bold hover:scale-105 transition duration-300 hover:opacity-75 hover:cursor-pointer"
          onClick={handleResetQuestion}
        >
          <RotateCcw color="red" size="24" />
        </div>
        <div
          className="px-4 py-4 bg-[#D8D8FF] text-lg font-bold md2:text-xl rounded-2xl shadow-md font-bold hover:scale-105 transition duration-300 hover:opacity-75 hover:cursor-pointer"
          onClick={handlePreviousQuestion}
        >
          <ArrowBigLeft />
        </div>

        <div
          className="px-4 py-4 bg-[#D8D8FF] text-lg font-bold md2:text-xl rounded-2xl shadow-md font-bold hover:scale-105 transition duration-300 hover:opacity-75 hover:cursor-pointer"
          onClick={handleNextQuestion}
        >
          <ArrowBigRight />
        </div>

        {index === data.length - 1 ? (
          <Button
          className="px-2 py-6 text-lg font-light md2:text-xl rounded-2xl"
          onClick={handleSubmit}
          >
          Submit
          </Button>
        ) : null}
        </div>
      </div>
      {isSideBarOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-20">
        <div className="fixed h-full w-[90%] top-0 right-0 transform transition-transform duration-300 ease-in-out bg-[#F3EBE4]">
          <div className="flex w-full justify-end px-6 pt-4">
          <AlignJustify size="32" onClick={toggleSideBar} />
          </div>
          <div className="px-6">Welcome ladies and ladies only</div>
        </div>
        </div>
      )}
      </div>
      </>
    );
  }

  return (
    <div className="flex flex-col text-lg md2:text-xl">
      {isLoading ? (
        <div className="loading-spinner h-screen w-full flex justify-center items-center">Loading...</div>
      ) : isMainPageOpen && data.length > 0 ? (
        <DisplayQuestion /> // Pass data to DisplayQuestion
      ) : (
        <Hero /> // Pass callback to Hero
      )}
    </div>
  );
}