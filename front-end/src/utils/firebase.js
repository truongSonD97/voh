import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA9OkvT8DwwO-fZzngrPH_wjMMqBdzTLKk",
    authDomain: "voh-record.firebaseapp.com",
    databaseURL: "https://voh-record.firebaseio.com",
    projectId: "voh-record",
    storageBucket: "voh-record.appspot.com",
    messagingSenderId: "705796826239",
};

firebase.initializeApp(config);

export default firebase;