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
      setUser({ uid: 'guest', email: 'guest@example.com' });
      setUsername('Guest');
      setLoading(false);
      return;
    }
    if (typeof onAuthStateChanged !== 'function') {
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
    if (!auth) {
      return;
    }
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
      throw new Error('Error storing user data');
    }

    return userCredential
  };


  const logout = async () => {
    if(!auth) {
      setUser(null);
      setUsername(null);
      return;
    }
    try{
    document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      await signOut(auth);
      setUser(null)
      setUsername(null)
    }catch(err){
      throw new Error('Error signing out'); 
    }
    }
  const login = async (email, password) => {
    if (!auth) {
      return;
    }
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
    if (!auth) {
      return;
    }
    const provider = new GoogleAuthProvider();
    try{
      const result = await signInWithPopup(auth, provider)
      const googleUser = result.user
      setUser(googleUser)

      const displayName = googleUser.displayName || null
      const photoURL = googleUser.photoURL || null
      const fallbackUsername = googleUser.email?.split('@')[0] || null

      const userRef = doc(db, 'users', googleUser.uid)
      const userSnapshot = await getDoc(userRef)

      if (!userSnapshot.exists()) {
        const newUsername = displayName || fallbackUsername || `user-${googleUser.uid.slice(0, 6)}`
        await setDoc(userRef, {
          email: googleUser.email || null,
          username: newUsername,
          photoURL,
          createdAt: new Date().toISOString(),
        })
        await setDoc(doc(db, 'usernames', newUsername), { uid: googleUser.uid })
        setUsername(newUsername)
      } else {
        const existingData = userSnapshot.data()
        if (existingData?.username) {
          setUsername(existingData.username)
        } else if (displayName || fallbackUsername) {
          setUsername(displayName || fallbackUsername)
        }
        if (photoURL && existingData?.photoURL !== photoURL) {
          await setDoc(userRef, { photoURL }, { merge: true })
        }
      }

      return googleUser
    }catch(error){
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
