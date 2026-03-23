import dotenv from 'dotenv';
dotenv.config();

import { collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const staffData = [
  // Stage 1
  { staffId: "staff1", password: "pass001", assignedStage: 1, staffName: "Alice Johnson" },
  { staffId: "staff2", password: "pass001", assignedStage: 1, staffName: "Bob Smith" },
  { staffId: "staff3", password: "pass001", assignedStage: 1, staffName: "Charlie Brown" },
  { staffId: "staff4", password: "pass001", assignedStage: 1, staffName: "Diana Prince" },
  { staffId: "staff5", password: "pass001", assignedStage: 1, staffName: "Eve Wilson" },
  { staffId: "staff6", password: "pass001", assignedStage: 1, staffName: "Frank Miller" },
  { staffId: "staff7", password: "pass001", assignedStage: 1, staffName: "Grace Lee" },
  { staffId: "staff8", password: "pass001", assignedStage: 1, staffName: "Henry Davis" },
  { staffId: "staff9", password: "pass001", assignedStage: 1, staffName: "Ivy Chen" },
  { staffId: "staff10", password: "pass001", assignedStage: 1, staffName: "Jack Taylor" },
  // Stage 2
  { staffId: "staff11", password: "pass001", assignedStage: 2, staffName: "Karen White" },
  { staffId: "staff12", password: "pass001", assignedStage: 2, staffName: "Leo Garcia" },
  { staffId: "staff13", password: "pass001", assignedStage: 2, staffName: "Mia Rodriguez" },
  { staffId: "staff14", password: "pass001", assignedStage: 2, staffName: "Noah Martinez" },
  { staffId: "staff15", password: "pass001", assignedStage: 2, staffName: "Olivia Lopez" },
  { staffId: "staff16", password: "pass001", assignedStage: 2, staffName: "Peter Anderson" },
  { staffId: "staff17", password: "pass001", assignedStage: 2, staffName: "Quinn Thomas" },
  { staffId: "staff18", password: "pass001", assignedStage: 2, staffName: "Ryan Jackson" },
  { staffId: "staff19", password: "pass001", assignedStage: 2, staffName: "Sara Harris" },
  { staffId: "staff20", password: "pass001", assignedStage: 2, staffName: "Tom Clark" },
  // Stage 3
  { staffId: "staff21", password: "pass001", assignedStage: 3, staffName: "Uma Patel" },
  { staffId: "staff22", password: "pass001", assignedStage: 3, staffName: "Victor Lewis" },
  { staffId: "staff23", password: "pass001", assignedStage: 3, staffName: "Wendy Walker" },
  { staffId: "staff24", password: "pass001", assignedStage: 3, staffName: "Xavier Hall" },
  { staffId: "staff25", password: "pass001", assignedStage: 3, staffName: "Yara Young" },
  { staffId: "staff26", password: "pass001", assignedStage: 3, staffName: "Zane King" },
  { staffId: "staff27", password: "pass001", assignedStage: 3, staffName: "Anna Wright" },
  { staffId: "staff28", password: "pass001", assignedStage: 3, staffName: "Ben Scott" },
  { staffId: "staff29", password: "pass001", assignedStage: 3, staffName: "Cathy Green" },
  { staffId: "staff30", password: "pass001", assignedStage: 3, staffName: "David Adams" },
];

async function addStaff() {
  for (const staff of staffData) {
    try {
      await addDoc(collection(db, "staff"), staff);
      console.log(`Added ${staff.staffName}`);
    } catch (error) {
      console.error(`Error adding ${staff.staffName}:`, error);
    }
  }
}

addStaff();