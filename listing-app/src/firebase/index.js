import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
  signOut,
  updateEmail as updateEmailAuth,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkUserAuth, setCreatedAt, setLoading, setRegister, setUserId } from "../store/reducers/User/userSlice";
import { getDatabase, ref, set, orderByKey, onValue, on, orderByValue, get } from "firebase/database";
import { collection, getFirestore, onSnapshot, where, query, getDocs, addDoc, doc, setDoc, orderBy, updateDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB60wKug-C4eUXXKZ1f53LZUXKPNYGchPQ",
  authDomain: "delivery-firm.firebaseapp.com",
  databaseURL: "https://delivery-firm-default-rtdb.firebaseio.com",
  projectId: "delivery-firm",
  storageBucket: "delivery-firm.appspot.com",
  messagingSenderId: "113028905411",
  appId: "1:113028905411:web:41905f17c3c7291eafa576",
  measurementId: "G-Y89C98Q70B"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);
export const dbFirestore = getFirestore(app)

// Initialize Realtime Database and get a reference to the service
export const storage = getStorage(app);

export async function uploadImages(images, path) {
  const uploadPromises = images.map(async (image, index) => {
    const response = await fetch(image);
    image = await response.blob();
    const reference = storageRef(storage, `${path}/${index}`);
    await uploadBytes(reference, image);
    return getDownloadURL(reference);
  });

  try {
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error('Some image uploads failed:', error);
    return false;
  }
}
export async function uploadImage(image, path) {
  try{
    const response = await fetch(image);
    image = await response.blob();
    const reference = storageRef(storage, `${path}`);
    console.log(reference)
    await uploadBytes(reference, image);
    return getDownloadURL(reference);;
  } catch (error) {
    console.error('Some image uploads failed:', error);
    return false;
  }
}

export const createOrSignInWithEmail = async (email, password, dispatch, user) => {
  dispatch(setLoading(true));
  try {
    const name = email.split('@')[0];
    const createdAt = new Date().toString()
    // Try to create a new account
    const signUpResponse = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = signUpResponse.user;
    dispatch(setUserId(uid));
    user = {...user, _id: uid, createdAt: createdAt, name: name }
    createUserWithCustomKey(uid, user);

    return signUpResponse;
  } catch (signUpError) {
    if (signUpError.code === 'auth/email-already-in-use') {
      // If account creation fails because email is already in use, try to sign in
      try {
        const signInResponse = await signInWithEmailAndPassword(auth, email, password);
        return signInResponse;
      } catch (signInError) {
        // Handle sign-in error
        return signInError.code;
      }
    } else {
      console.log(signUpError)
      // Handle other errors from account creation
      return signUpError.code;
    }
  } finally {
    dispatch(setLoading(false));
  }
};

// 
export const logout = async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out: ', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export async function createUserWithCustomKey( childId, data ){
  const { password, isLoggedIn, loading, uid, userId, ...dataWithoutPassword } = data;
  console.log(dataWithoutPassword)

  try{
    const res = await set(ref(db, 'users/' + childId), dataWithoutPassword)
    console.log('Response: ', res)
  }catch(error){
    console.error('Error: ', error)
    return error
  }
}

export const updateAndVerifyEmail = async (newEmail, password) => {
  try {
    // Re-authenticate the user.
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update the email.
    await updateEmailAuth(auth.currentUser, newEmail);
    return { success: true, message: 'Email updated!' }; 
  } catch (error) {
    if(error.code === 'auth/operation-not-allowed'){
      try{
        const res = await sendEmailVerification(auth.currentUser);
        if(res === undefined){
          const res = await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

          return 'Sent'
        }

        return res;
      }catch(error){
        return res;
      }
  
    }
    return error;
  }
};

export function fetchChatsByUserIDs(uid1, uid2) {
  return new Promise((resolve, reject) => {
    const chatsRef = collection(dbFirestore, 'chats');
    const q = query(chatsRef, where('members', 'array-contains-any', [uid1, uid2]));

    getDocs(q)
      .then(querySnapshot => {
        const allChats = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          // Check if both user IDs are in the 'members' array
          allChats.push(data);
        });
        resolve(allChats);
      })
      .catch(error => reject(error));
  });
}
export function fetchChatsByUserID(uid1) {
  return new Promise((resolve, reject) => {
    const chatsRef = collection(dbFirestore, 'chats');
    const q = query(chatsRef, where('members', 'array-contains', uid1));

    getDocs(q)
      .then(querySnapshot => {
        const allChats = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          allChats.push(data);
        });
        console.log(allChats);
        resolve(allChats);
      })
      .catch(error => reject(error));
  });
}

export function addChat(chatObject) {
  return new Promise((resolve, reject) => {
    const chatsRef = collection(dbFirestore, 'chats');
    const chatDocRef = doc(chatsRef, chatObject.id); // Use custom ID for the document

    setDoc(chatDocRef, chatObject)
      .then(docRef => {
        resolve(chatObject.id)
      })
      .catch(error => {
        reject(error);
      });
  });
}

export const deleteChat = async (chatId) => {
  return new Promise((resolve, reject) => {
    // Reference to the specific chat document
    const chatDocRef = doc(dbFirestore, 'chats', chatId);

    // Deleting the document
    deleteDoc(chatDocRef)
      .then(() => {
        resolve(`Chat with ID ${chatId} deleted successfully.`);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function fetchMessagesByChatId(chatId, setMessages) {
  const messagesRef = collection(dbFirestore, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
      const allMessages = querySnapshot.docs.map(doc => ({
        _id: doc.id, // Assuming _id is the Firestore document ID
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user
      }));
      setMessages(allMessages);
  }, (error) => {
      console.error("Error fetching messages: ", error);
  });
}

export function saveMessage({ id, createdAt, text, user }) {
  return new Promise((resolve, reject) => {
    if (text.trim()) {
      const message = {
        createdAt,
        text,
        user
      };

      const messagesRef = collection(dbFirestore, `chats/${id}/messages`); // Assuming you have a "chats" collection

      const recentMessage = {
        messageText: text,
        sentAt: createdAt,
        sentBy: user
      }
      addDoc(messagesRef, message)
        .then(docRef => {
          const chatDocRef = doc(dbFirestore, 'chats', id);
          updateDoc(chatDocRef, { recentMessage: recentMessage })

          return docRef
        })
        .then(docRef => {
          resolve({ ...message, id: docRef.id });
        })
        .catch(error => {
          reject(error);
        });
    } else {
      reject(new Error('Message text cannot be empty'));
    }
  });
}

// export const updateAndVerifyEmail = async (newEmail, password) => {
//   const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
//   const res = await reauthenticateWithCredential(auth.currentUser, credential)
//   console.log(res)
//   if(res?.user){
//     try{
//       const res = await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
//       console.log(res)
//       return res
//     } catch(error){
//       return error
//     }
//   }

//   return res
// }

export async function updateEmail(email) {
  try{
    const res = await updateEmailAuth(auth.currentUser, email);
    return res
  }catch(error){
    return error
  };
}

export const sendForgotPasswordEmail = async (email) => {
  const auth = getAuth();
  try{
    await sendPasswordResetEmail(auth, email)
    return true
  }catch(error){
    console.log(error)
    return false
  }
};

// export const createOrSignUpWithPhone = async (phoneNumber, dispatch, mutateFunction) => {
//   dispatch(setLoading(true));

//   // Create a new RecaptchaVerifier instance
//   const recaptchaVerifier = new RecaptchaVerifier('', {}, auth);
//   try {
//     // Send a verification code to the user's phone
//     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
//     // Save confirmationResult to verify the code later
//     window.confirmationResult = confirmationResult;
//     dispatch(setLoading(false));
//       try {
//         // Here you would securely store the password associated with the user's UID
//         // For example, you might have a cloud function that stores the password securely in your database
//         const res = await mutateFunction(uid, password);
//         console.log(res);
//         // Handle success, such as updating the Redux state
//         dispatch(setUserPasswordSet(true));
//         return { success: true };
//       } catch (error) {
//         console.error("Error setting password:", error);
//         // Handle or dispatch error
//         return { error };
//       }
//     } catch (error) {
//     console.error("Error during phone number sign in:", error);
//     dispatch(setLoading(false));
//     if (error.code === 'auth/number-already-in-use') {
//       // The phone number is already in use, so you might want to log the user in or handle it accordingly
//       // You can dispatch an action here if needed
//     }
//     return { error };
//   }
// };

// // Function to verify the code sent to the user's phone and sign in or sign up
// export const verifyPhoneCode = async (code, dispatch, mutateFunction) => {
//   try {
//     // Verify the code entered by the user
//     const result = await window.confirmationResult.confirm(code);
//     // User is signed in, you can get the user's info from result.user
//     console.log("User signed in:", result.user);
//     dispatch(setUserId(result.user.uid));
//     const res = mutateFunction();
//     console.log(res);
//     // You can now create a user record in your database if needed
//     // Dispatch any additional actions here
//     return { user: result.user };
//   } catch (error) {
//     console.error("Error verifying code:", error);
//     // Handle or dispatch error
//     return { error };
//   }
// };
