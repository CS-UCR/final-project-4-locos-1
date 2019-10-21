import * as firebase from 'firebase';

export function credentials(){

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyC5Byo69WNfFYywwOHquvCpUxGJ45xu5UU",
        authDomain: "lokos-studybuddy.firebaseapp.com",
        databaseURL: "https://lokos-studybuddy.firebaseio.com",
        projectId: "lokos-studybuddy",
        storageBucket: "lokos-studybuddy.appspot.com",
        messagingSenderId: "847034663979",
        appId: "1:847034663979:web:6ef254f9d66a0681f7966e",
        measurementId: "G-5T2C6P7P8R"
    };
    firebase.initializeApp(firebaseConfig);
}


//firebase functions

/*
export function storeItemDriver(directory, item){

    //directory must be string
    firebase.database().ref("/" + directory).set(item);
    return
}

export function readItemDriver(directory){

    return firebase.database().ref('/' + directory).once('value').then(function(snapshot){
        console.log(snapshot.val())
    })

}

export function deleteItemDriver(directory){

    firebase.database().ref("/" + directory).remove()
}

export function updateItemDriver(directory){



}

*/
