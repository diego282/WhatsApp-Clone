// const firebase = require('firebase');
// require('firebase/firestore');

// export class Firebase {

//     constructor() {

//         this._firebaseConfig = {

//             apiKey: "AIzaSyAT4pRy6qlayKgSUNPr5_S3bOnc9rYSBiQ",
//             authDomain: "whatsapp-clone-878bc.firebaseapp.com",
//             projectId: "whatsapp-clone-878bc",
//             storageBucket: "whatsapp-clone-878bc.appspot.com",
//             messagingSenderId: "1010861283191",
//             appId: "1:1010861283191:web:5bffa399532e4497757372",
//             measurementId: "G-FFTXTQT607"

//         };

//         this.init(); //metodo para ativar todos os outros
//     }

//     init() { //metodo para ativar todos os outros


//         // Initialize Firebase..
//         if (!this._initialize) {
//             firebase.initializeApp(this._firebaseConfig); //firebaseConfig
//             firebase.analytics();

//             firebase.firestore().settings({ //confinguraçoes.. obj
//                 timestampsInSnapshots: true
//             });

//             this._initialize = true; //coloca como true..
//         }
//     }

//     static db() { //banco de dados
//         return firebase.firestore(); //retornando cloud firestore
//     }

//     static hd() {
//         return firebase.storage(); //hd na nuvem retorna arquivos
//     }

// }


import firebase from "firebase";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

export class Firebase {
    constructor() {

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        this._config = {
            apiKey: "AIzaSyAT4pRy6qlayKgSUNPr5_S3bOnc9rYSBiQ",
            authDomain: "whatsapp-clone-878bc.firebaseapp.com",
            projectId: "whatsapp-clone-878bc",
            storageBucket: "whatsapp-clone-878bc.appspot.com",
            messagingSenderId: "1010861283191",
            appId: "1:1010861283191:web:dfb4bad6e0d8c125757372",
            measurementId: "G-WLHM09GGTJ"
        };
        //console.log('Firebase constructor: _config:', this._config);
        this.init();
    }

    init() {
        // Initialize Firebase
        //console.log('Firebase init(): !this._initialized', this._initialized);
        if (!window._initializedFirebase) {
            //console.log('Firebase init(): !this._initialized>firebase', firebase);
            firebase.initializeApp(this._config);
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });
            window._initializedFirebase = true;
        }
    }

    static db() {
        return firebase.firestore();
    }

    static hd() {
        return firebase.storage();
    }

    initAuth() {

        return new Promise((s, f) => { // retorna uma promesa
            let provider = new firebase.auth.GoogleAuthProvider();
            //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            //console.log('Firebase initAuth(): (S)', provider);
            //
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                let token = result.credential.accessToken;
                // The signed-in user info.
                let user = result.user;
                //console.log('Firebase initAuth(): (result)', user, token);
                s({
                    user,
                    token
                });
                // ...
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                //console.log('Firebase initAuth(): (error)', errorCode, errorMessage, email, credential );
                f(error);
                // ...
            });

        });

    }

}