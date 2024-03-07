import React, { useState } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUTzitNFEIBR7cQjpcXYUCbKLZisvZUZ8",
  authDomain: "kouture-konect.firebaseapp.com",
  projectId: "kouture-konect",
  storageBucket: "kouture-konect.appspot.com",
  messagingSenderId: "528602575259",
  appId: "1:528602575259:web:f272af180f3e953541b13e",
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

export default firestore;
