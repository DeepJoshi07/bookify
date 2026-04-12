import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const fireAuth = getAuth(firebaseApp);
const fireStore = getFirestore(firebaseApp);
const fireStorage = getStorage(firebaseApp);
const GoogleProvider = new GoogleAuthProvider();

const FireContext = createContext();

export const useFirebase = () => useContext(FireContext);

function FireProvider({ children }) {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);

  const signup = async (email, password) => {
    return await createUserWithEmailAndPassword(fireAuth, email, password);
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(fireAuth, email, password);
  };

  const logout = async () => {
    setUser(null);
    return await signOut(fireAuth);
  };

  const googleLogin = async () => {
    return await signInWithPopup(fireAuth, GoogleProvider);
  };

  useEffect(() => {
    const sub = onAuthStateChanged(fireAuth, (u) => {
      if (!u) return;
      setUser(u);
      console.log(u);
    });

    return () => sub();
  }, []);

  const addImage = async (image) => {
    const storageRef = ref(
      fireStorage,
      `/upload/images/${Date.now()}-${image.name}`,
    );
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    return {
      imagePath: storageRef.path,
      coverUrl: url,
    };
  };

  const addBook = useCallback(
    (bookData) => {
      const addData = async () => {
        if (bookData.coverImage) {
          const imageData = await addImage(bookData.coverImage);
          bookData = {
            ...bookData,
            coverImage: imageData.coverUrl,
            coverPath: imageData.imagePath,
          };
        }
        const collectionRef = collection(fireStore, "books");
        await addDoc(collectionRef, bookData);
      };
      addData();
    },
    [books],
  );

  const getBook = useCallback(() => {}, [books, addBook]);

  const updateBook = () => {};

  const deleteBook = () => {};

  const booksBySeller = () => {};

  const purchaseBook = () => {};

  const cancelOrder = () => {};

  const ordersForUser = () => {};

  const relatedBooks = () => {};
  // const value = useMemo(
  //   () => ({ user, login, signup, logout }),
  //   [user, login, signup, logout]
  // );

  const value = useMemo(
    () => ({
      user,
      books,
      orders,
      login,
      logout,
      signup,
      googleLogin,
      getBook,
      addBook,
      updateBook,
      deleteBook,
      booksBySeller,
      purchaseBook,
      cancelOrder,
      ordersForUser,
      relatedBooks,
    }),
    [
      user,
      books,
      orders,
      login,
      logout,
      signup,
      googleLogin,
      getBook,
      addBook,
      updateBook,
      deleteBook,
      booksBySeller,
      purchaseBook,
      cancelOrder,
      ordersForUser,
      relatedBooks,
    ],
  );
  return <FireContext.Provider value={value}>{children}</FireContext.Provider>;
}

export default FireProvider;
