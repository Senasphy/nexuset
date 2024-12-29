"use client"
import React, {useState, useRef } from 'react'
import './/page.css'


import DisplayData from './app.js'

export default function App(){
  const [showBoard, setShowBoard] = useState(false);
  const[username, setUsername] = useState(null)
  const buttonRef = useRef(null)
const handleClick = e => {
    if(e.key == "Enter"){
      buttonRef.current.click();
    }
  }

  function handleLogin(){
    if(username === null){
            alert("Username can not be empty!")
    }
    else{
    setShowBoard(!false)}
  }


  return(
    !showBoard ? (
    <div className='flex flex-col justify-center h-screen  items-center gap-4'>
      <p className = 'text-4xl font-bold text-blue-400 md1:text-4xl ' > NEXT GEN</p>

      <div className = ' flex flex-col items-end justify-end gap-2 md1:flex-row' >
 <input className = 'h-10  border-2 outline-none rounded-sm border-blue-400 p-2 mx-4  'type ='text'
  placeholder = 'Enter name' onChange = {(event)=>{
  setUsername(event.target.value)
  

 }} onKeyDown = {handleClick}></input>  
 <button ref = {buttonRef} className = 'bg-blue-400 outline-none rounded-sm mr-5 hover:opacity-75 transition duration-60  px-2 py-1 h-10 w-24'
 onClick = {handleLogin}>Join</button></div></div>) : <DisplayData username = {username}/>)
} 