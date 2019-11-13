import firebase-admin
from firebase-admin import credentials
from firebase-admin import auth

firebaseConfig = {
        apiKey: "AIzaSyC5Byo69WNfFYywwOHquvCpUxGJ45xu5UU",
        authDomain: "lokos-studybuddy.firebaseapp.com",
        databaseURL: "https://lokos-studybuddy.firebaseio.com",
        projectId: "lokos-studybuddy",
        storageBucket: "lokos-studybuddy.appspot.com",
        messagingSenderId: "847034663979",
        appId: "1:847034663979:web:6ef254f9d66a0681f7966e",
        measurementId: "G-5T2C6P7P8R"
    }

cred = credentials.Certificate(firebaseConfig)
firebase-admin.initialize_app(cred)

for user in auth.list_users().iterate_all():
    print("Deleting user " + user.uid)
    auth.delete_user(user.uid)