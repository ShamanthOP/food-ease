import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyDMcW6maj27Wy9h1_deDo6cUmS7pIFLx_E",
    authDomain: "mini-project-626b7.firebaseapp.com",
    databaseURL:
        "https://mini-project-626b7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mini-project-626b7",
    storageBucket: "mini-project-626b7.appspot.com",
    messagingSenderId: "284196505212",
    appId: "1:284196505212:web:8c90fbefe5becb28966bf9",
    measurementId: "G-K977F11DT8",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, googleAuthProvider, database as default };
