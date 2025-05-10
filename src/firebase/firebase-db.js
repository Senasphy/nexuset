    import {initializeApp} from 'firebase/app';
    import {getFirestore} from 'firebase/firestore' 
    

    const firebaseConfig = { 
        apiKey: "AIzaSyAjARe8t_F4WV9zwehD7uA4J4B1pA2iB9s",
        authDomain: "nextspelling.firebaseapp.com",
        projectId: "nextspelling", 
        storageBucket: "nextspelling.firebasestorage.app", 
        messagingSenderId: "520937149732", 
        appId: "1:11520937149732:web:321faf944e6f8dd1c20fb1",  
        measurementId: "G-ZBPF3KSWLP"

    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app)
    export default db;