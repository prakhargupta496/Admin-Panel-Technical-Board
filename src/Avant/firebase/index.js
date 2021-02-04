import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "AIzaSyCkvCRZ2w5yNfYqtiCPEyiSV0_FrVDmOHQ",
    authDomain: "technical-board.firebaseapp.com",
    projectId: "technical-board",
    storageBucket: "technical-board.appspot.com",
    messagingSenderId: "240946019514",
    appId: "1:240946019514:web:d438e16f1539bd5be5d683",
    measurementId: "G-W5TGT5V8G3"
};

// Initialize Firebase
const backend = firebase.initializeApp(config, "avant");

export default backend;