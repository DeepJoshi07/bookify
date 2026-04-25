// import { initializeApp } from "firebase/app";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
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
import {firebaseApp} from "../firebase/FireApp"
import {fireAuth,GoogleProvider} from "../firebase/FireAuth"
import {fireStore} from "../firebase/FireStore"
import {fireStorage} from "../firebase/FireStorage"


const FireContext = createContext();

export const useFirebase = () => useContext(FireContext);


function FireProvider({ children }) {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


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
      await getBooks();
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
  }, [fireStore]);


  const getBook = useCallback(
    (bookId) => {
      const data = books.filter((b) => (b.id === bookId));
      return data[0];
    },
    [fireStore,books],
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

  const getOrders = useCallback(async() =>{
    if(!user)return;
    const q = query(
        collection(fireStore, "orders"),
        where("userId", "==", user.uid),
      );
    const data = await getDocs(q)
    const dataList = data.docs.map((o)=>({...o.data(),id:o.id}))
    setOrders(dataList);
    return dataList
  },[fireStore,user])

  const relatedBooks = useCallback(
    (bookId, limitCount = 4) => {
      const data = books.filter((b) => (b.id !== bookId));
      return data;
    },
    [fireStore,books],
  );

  const value = useMemo(
    () => ({
      user,
      books,
      orders,
      loading,
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
      getOrders,
      cancelOrder,
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
      getBooks,
      addBook,
      updateBook,
      deleteBook,
      booksBySeller,
      getOrders,
      purchaseBook,
      cancelOrder,
      relatedBooks,
    ],
  );
  return <FireContext.Provider value={value}>{children}</FireContext.Provider>;
}

export default FireProvider;
