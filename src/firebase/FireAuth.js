import { firebaseApp } from "./FireApp";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";


export const fireAuth = getAuth(firebaseApp);
export const GoogleProvider = new GoogleAuthProvider();


