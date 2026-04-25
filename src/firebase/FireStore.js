import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase/FireApp";


export const fireStore = getFirestore(firebaseApp);


