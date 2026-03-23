import { collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with actual
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const staffData = [
  // Stage 1
  { staffId: "S1_001", password: "pass123", assignedStage: 1, staffName: "Alice Johnson" },
  { staffId: "S1_002", password: "pass123", assignedStage: 1, staffName: "Bob Smith" },
  { staffId: "S1_003", password: "pass123", assignedStage: 1, staffName: "Charlie Brown" },
  { staffId: "S1_004", password: "pass123", assignedStage: 1, staffName: "Diana Prince" },
  { staffId: "S1_005", password: "pass123", assignedStage: 1, staffName: "Eve Wilson" },
  { staffId: "S1_006", password: "pass123", assignedStage: 1, staffName: "Frank Miller" },
  { staffId: "S1_007", password: "pass123", assignedStage: 1, staffName: "Grace Lee" },
  { staffId: "S1_008", password: "pass123", assignedStage: 1, staffName: "Henry Davis" },
  { staffId: "S1_009", password: "pass123", assignedStage: 1, staffName: "Ivy Chen" },
  { staffId: "S1_010", password: "pass123", assignedStage: 1, staffName: "Jack Taylor" },
  // Stage 2
  { staffId: "S2_001", password: "pass123", assignedStage: 2, staffName: "Karen White" },
  { staffId: "S2_002", password: "pass123", assignedStage: 2, staffName: "Leo Garcia" },
  { staffId: "S2_003", password: "pass123", assignedStage: 2, staffName: "Mia Rodriguez" },
  { staffId: "S2_004", password: "pass123", assignedStage: 2, staffName: "Noah Martinez" },
  { staffId: "S2_005", password: "pass123", assignedStage: 2, staffName: "Olivia Lopez" },
  { staffId: "S2_006", password: "pass123", assignedStage: 2, staffName: "Peter Anderson" },
  { staffId: "S2_007", password: "pass123", assignedStage: 2, staffName: "Quinn Thomas" },
  { staffId: "S2_008", password: "pass123", assignedStage: 2, staffName: "Ryan Jackson" },
  { staffId: "S2_009", password: "pass123", assignedStage: 2, staffName: "Sara Harris" },
  { staffId: "S2_010", password: "pass123", assignedStage: 2, staffName: "Tom Clark" },
  // Stage 3
  { staffId: "S3_001", password: "pass123", assignedStage: 3, staffName: "Uma Patel" },
  { staffId: "S3_002", password: "pass123", assignedStage: 3, staffName: "Victor Lewis" },
  { staffId: "S3_003", password: "pass123", assignedStage: 3, staffName: "Wendy Walker" },
  { staffId: "S3_004", password: "pass123", assignedStage: 3, staffName: "Xavier Hall" },
  { staffId: "S3_005", password: "pass123", assignedStage: 3, staffName: "Yara Young" },
  { staffId: "S3_006", password: "pass123", assignedStage: 3, staffName: "Zane King" },
  { staffId: "S3_007", password: "pass123", assignedStage: 3, staffName: "Anna Wright" },
  { staffId: "S3_008", password: "pass123", assignedStage: 3, staffName: "Ben Scott" },
  { staffId: "S3_009", password: "pass123", assignedStage: 3, staffName: "Cathy Green" },
  { staffId: "S3_010", password: "pass123", assignedStage: 3, staffName: "David Adams" },
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