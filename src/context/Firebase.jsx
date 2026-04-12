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
import {
  getFirestore,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where
} from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  ref,
} from "firebase/storage";
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

  const deleteImage = async (imagePath) => {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  };

  const addBook = useCallback(
    async (bookData) => {
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
    },
    [books],
  );

  const getBook = useCallback(async () => {
    if (!user) return;
    const collectionRef = collection(fireStore, "books");
    const data = await getDocs(collectionRef);
    const dataList = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(dataList);
  }, [books, addBook, fireStore]);

  const updateBook = useCallback(
    async (id, payload) => {
      
      if (payload.coverImage) {
        const docRef = doc(fireStore, "book", id);
        const oldDoc = await getDoc(docRef);

        if (oldDoc.exists()) {
          const imageTodelete = await oldDoc.data().coverPath;
          await deleteImage(imageTodelete);
        }
      }
      const imageData = await addImage(payload.coverImage);
      payload = {
        ...payload,
        coverImage: imageData.coverUrl,
        coverPath: imageData.imagePath,
      };
      const docRef = doc(fireStore, "books", id);
      await updateDoc(docRef);
    },
    [books, fireStore, fireStorage],
  );

  const deleteBook = useCallback(
    (id) => {
      const deleteData = async () => {
        const docRef = doc(fireStore, "books", id);
        await deleteDoc(docRef);
      };
      deleteData();
    },
    [books, orders],
  );

  const booksBySeller = useCallback(
    (id) => {
      () => books.filter((b) => b.sellerId === id);
    },
    [books],
  );

  const purchaseBook = useCallback(
    (bookId, userId) => {
      const book = books.filter((b) => b.id === bookId);
      if (!book) return;
      const collectionRef = collection(fireStore, "orders");
      addDoc(collectionRef, {
        bookId,
        userId,
        orderAt: new Date().toISOString(),
        status: "active",
      });
    },
    [books, orders],
  );

  const cancelOrder = useCallback(
    async(orderId) => {
      const docRef = doc(fireStore,"orders",orderId)
      await deleteDoc(docRef)
    },
    [orders, books],
  );

  const ordersForUser = useCallback(
  async (userId) => {
    if(!userId)return;
    const q = query(
      collection(fireStore, "orders"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
  [fireStore]);

  const relatedBooks = useCallback(async(bookId,limit=4) => {
    const docRef = doc(fireStore,"books");
    const q = query(docRef,where("id","!=",bookId),limit);
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({id:doc.id,...doc.data()}))
    return data;
  },[books]);

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
