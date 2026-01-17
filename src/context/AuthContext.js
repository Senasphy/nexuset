'use client';

import { auth, db }  from '@/lib/firebase';
import { useState, useEffect, createContext, useContext} from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import {doc, setDoc, getDoc} from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (!auth) {
      console.error('Auth is undefined in AuthContext');
      setLoading(false);
      return;
    }
    if (typeof onAuthStateChanged !== 'function') {
      console.error('onAuthStateChanged is not a function:', onAuthStateChanged);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      if(currentUser){
          try{
            const userdoc = await getDoc(doc(db,'users',currentUser.uid));
            if (userdoc.exists()){
              setUsername(userdoc.data().username);
            } else{
              setUsername(null)
            }
          }
          catch(err){
            console.error('Error fetching user document:', err);
            setUsername(null);
          }
      } else {
        setUsername(null);
      }
      setUser(currentUser);
      setLoading(false);
          });
    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, username) => {
    if (!email || !password || !username){
      throw new Error('Email, password, or username is missing');
    }
    const usernameSnapshot = await getDoc(doc(db, 'usernames', username));
    if (usernameSnapshot.exists()) {
      throw new Error('Username already exists');
    }
    const userCredential = await createUserWithEmailAndPassword(auth,email,password)
    const user = userCredential.user
    if (!user){
      throw new Error("User is undefined after sign up")
    }
    try{
      await setDoc(doc(db, 'users', user.uid), {
        email,
        username,
        createdAt: new Date().toISOString(),
  
      })
      await setDoc(doc(db, 'usernames' , username),{uid: user.uid})
      setUsername(username)
    }
    catch(err){
      console.error('Error storing user data:', err);
      throw new Error('Error storing user data');
    }

    return userCredential
  };


  const logout = async () => {
    if(!auth) {
      throw new Error('Auth service is not initialized');
    }
    try{
    document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      await signOut(auth);
      setUser(null)
      setUsername(null)
    }catch(err){
      console.error('Error signing out:', err);
      throw new Error('Error signing out'); 
    }
    }
  const login = async (email, password) => {
   // Inside login function, after signInWithEmailAndPassword
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;  
    const idToken = await user.getIdToken()
    document.cookie = `__session=${idToken}; path=/; SameSite=Strict; Secure; Max-Age=3600`
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()){
      setUsername(userDoc.data().username);
    }
    else{
      setUsername(null)
    }
   
    return userCredentials
     
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try{
      const result = await signInWithPopup(auth, provider)
      return result.user
    }catch(error){
      console.error("Google sign-in error", error)
      throw error
    }

  }
  const value = { user, loading, signInWithGoogle,  signUp, login, logout, username };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
