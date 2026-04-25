import {getStorage} from "firebase/storage"
import {firebaseApp} from "../firebase/FireApp"


export const fireStorage = getStorage(firebaseApp);

