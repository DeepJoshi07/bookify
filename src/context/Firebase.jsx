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
  limit,
  where,
  onSnapshot,
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

// {
//   Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit aspernatur necessitatibus veniam tempore perferendis facere, perspiciatis unde sed earum amet cupiditate, nesciunt distinctio accusamus! At quidem accusantium odio perferendis esse!
// }

function FireProvider({ children }) {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mine, setMine] = useState([]);

  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        fireAuth,
        email,
        password,
      );
      return { success: true, user: result.user };
    } catch (error) {
      console.log(error.code,error.message)
      return { success: false, error };
    }
  };

  const login = async (email, password) => {
    try {
    const result = await signInWithEmailAndPassword(fireAuth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.log(error.code,error.message)
    return { success: false, error };
  }
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
      setLoading(false);
    });

    return () => sub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      query(collection(fireStore, "books"), where("sellerId", "==", user.uid)),
      (snapshot) => {
        setMine(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
    );
    return () => unsubscribe();
  }, [user]);

  const addImage = async (image) => {
    const imageRef = `/upload/images/${Date.now()}-${image.name}`;
    const storageRef = ref(fireStorage, imageRef);
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    return {
      imagePath: imageRef,
      coverUrl: url,
    };
  };

  const deleteImage = async (imagePath) => {
    const imageRef = ref(fireStorage, imagePath);
    await deleteObject(imageRef);
  };

  const addBook = useCallback(
    async (bookData) => {
      if (bookData.coverImage) {
        const { imagePath, coverUrl } = await addImage(bookData.coverImage);
        bookData = {
          ...bookData,
          coverImage: coverUrl,
          coverPath: imagePath,
        };
      }
      const collectionRef = collection(fireStore, "books");
      await addDoc(collectionRef, bookData);
    },
    [fireStore],
  );

  const getBooks = useCallback(async () => {
    const collectionRef = collection(fireStore, "books");
    const data = await getDocs(collectionRef);
    const dataList = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(dataList);
  }, [user, fireStore]);

  const getBook = useCallback(
    async (bookId) => {
      const docRef = doc(fireStore, "books", bookId);
      const bookData = await getDoc(docRef);
      const data = { ...bookData.data(), id: bookData.id };
      return data;
    },
    [fireStore, user],
  );

  useEffect(() => {
    const getData = async () => {
      await getBooks();
    };
    getData();
  }, [getBooks]);

  const updateBook = useCallback(
    async (id, payload) => {
      if (payload.coverImage !== "") {
        console.log(payload.coverImage);
        const docRef = doc(fireStore, "books", id);
        const oldDoc = await getDoc(docRef);

        if (oldDoc.exists()) {
          const imageTodelete = await oldDoc.data().coverPath;
          await deleteImage(imageTodelete);
        }

        const imageData = await addImage(payload.coverImage);
        payload = {
          ...payload,
          coverImage: imageData.coverUrl,
          coverPath: imageData.imagePath,
        };
      } else {
        delete payload.coverImage;
      }

      const docRef = doc(fireStore, "books", id);
      await updateDoc(docRef, payload);
    },
    [fireStore],
  );

  const deleteBook = useCallback(
    (id) => {
      const deleteData = async () => {
        const docRef = doc(fireStore, "books", id);
        const getData = await getDoc(docRef);
        const imageData = getData.data();
        await deleteImage(imageData.coverPath);
        await deleteDoc(docRef);
      };
      deleteData();
    },
    [books, orders],
  );

  const booksBySeller = useCallback(() => {
    if (!user) return;
    return books.filter((b) => b.sellerId === user.uid);
  }, [user, books]);

  const purchaseBook = useCallback(
    async (bookId, userId) => {
      const book = books.filter((b) => b.id === bookId);
      if (!book) return;
      const collectionRef = collection(fireStore, "orders");
      const docRef = await addDoc(collectionRef, {
        bookId,
        userId,
        orderAt: new Date().toISOString(),
        status: "active",
      });
      const data = await getDoc(docRef);
      // console.log(data)
      return await { ...data.data(), id: data.id };
    },
    [books, orders],
  );

  const cancelOrder = useCallback(
    async (orderId) => {
      if (!user) return;
      const docRef = doc(fireStore, "orders", orderId);
      await deleteDoc(docRef);
    },
    [fireStore, user],
  );

  const ordersForUser = useCallback(
    async (userId) => {
      if (!user) return;
      if (!userId) return;
      const q = query(
        collection(fireStore, "orders"),
        where("userId", "==", userId),
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
      return data;
    },
    [fireStore, user],
  );

  const relatedBooks = useCallback(
    async (bookId, limitCount = 4) => {
      const collectionRef = collection(fireStore, "books");
      const q = query(collectionRef, limit(limitCount));
      const snapshot = await getDocs(q);
      let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data = data.filter((doc) => doc.id !== bookId);
      return data;
    },
    [fireStore, user],
  );

  const value = useMemo(
    () => ({
      user,
      books,
      orders,
      loading,
      mine,
      setMine,
      login,
      logout,
      signup,
      googleLogin,
      getBooks,
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
      mine,
      setMine,
      login,
      logout,
      signup,
      googleLogin,
      getBooks,
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
