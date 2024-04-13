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
  deleteUser,
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkUserAuth, setCreatedAt, setLoading, setRegister, setUserId } from "../store/reducers/User/userSlice";
import { getDatabase, ref, set, get, orderByChild, query as dbQuery, orderByValue, equalTo, limitToFirst, startAfter, orderByKey, limitToLast, startAt, endAt, update } from "firebase/database";
import { collection, getFirestore, onSnapshot, where, query, getDocs, addDoc, doc, setDoc, orderBy, updateDoc, deleteDoc, limit as limitToLastFirestore, getDoc } from "firebase/firestore";
import { nearByItems } from "../apollo/server";

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
  try {
    const response = await fetch(image);
    image = await response.blob();
    const reference = storageRef(storage, `${path}`);
    await uploadBytes(reference, image);
    return getDownloadURL(reference);;
  } catch (error) {
    console.error('Some image uploads failed:', error);
    return false;
  }
}

export const createOrSignInWithEmail = async (email, password, dispatch, user, navigation) => {
  dispatch(setLoading(true));
  try {
    const name = email.split('@')[0];
    const createdAt = new Date().toString()
    // Try to create a new account
    const signUpResponse = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = signUpResponse.user;
    dispatch(setUserId(uid));
    user = { ...user, _id: uid, createdAt: createdAt, name: name }
    createUserWithCustomKey(uid, user);

    return signUpResponse;
  } catch (signUpError) {
    if (signUpError.code === 'auth/email-already-in-use') {
      // If account creation fails because email is already in use, try to sign in
      try {
        const signInResponse = await signInWithEmailAndPassword(auth, email, password);
        dispatch(checkUserAuth(navigation))
        navigation.navigate('Home')
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

export async function createUserWithCustomKey(childId, data) {
  const { password, isLoggedIn, loading, uid, userId, ...dataWithoutPassword } = data;

  try {
    const res = await set(ref(db, 'users/' + childId), dataWithoutPassword)
  } catch (error) {
    console.error('Error: ', error)
    return error
  }
}

export async function updateUserProperty(childId, property, value) {
  const updates = {};
  updates['/users/' + childId + '/' + property] = value;

  try {
    await update(ref(db), updates);
    return true
  } catch (error) {
    console.error('Error updating user property: ', error);
    return false;
  }
}

export async function fetchBlockedUsers(userId) {
  const blockedUsersRef = ref(db, `users/${userId}/blockedUsers`);

  try {
    const snapshot = await get(blockedUsersRef);
    if (snapshot.exists()) {
      const blockedUsers = snapshot.val();
      return blockedUsers; // Returns the blockedUsers array or object
    } else {
      console.log('No blockedUsers data available');
      return null; // No data found
    }
  } catch (error) {
    console.error('Error fetching blockedUsers:', error);
    return null; // Error case
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
    if (error.code === 'auth/operation-not-allowed') {
      try {
        const res = await sendEmailVerification(auth.currentUser);
        if (res === undefined) {
          const res = await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

          return 'Sent'
        }

        return res;
      } catch (error) {
        return res;
      }

    }
    return error;
  }
};

export async function fetchObjectsByUids(uidArray) {
  const db = getDatabase();
  const fetchedObjects = [];

  for (const uid of uidArray) {
    const objectRef = ref(db, '/users/' + uid);

    try {
      const snapshot = await get(objectRef);
      if (snapshot.exists()) {
        fetchedObjects.push(snapshot.val());
      } else {
        console.log('No data available for uid:', uid);
      }
    } catch (error) {
      console.error('Failed to fetch object for uid:', uid, error);
    }
  }

  return fetchedObjects;
}

export function fetchChatsByUserIDs(uid1, uid2, adId) {
  return new Promise((resolve, reject) => {
    const chatsRef = collection(dbFirestore, 'chats');
    const q = query(
      chatsRef,
      where('members', 'array-contains-any', [uid1, uid2]),
      where('adId', '==', adId)
    );

    getDocs(q)
      .then(querySnapshot => {
        const allChats = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;

          // Check if both user IDs are in the 'members' array
          if (data.members.includes(uid1) && data.members.includes(uid2)) {
            allChats.push(data);
          }
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

export const deleteProfile = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      await deleteUser(user);
      console.log("User account deleted successfully");
      // Handle post-deletion logic here (e.g., redirect to a login screen)
      return true
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        console.log('The user must re-authenticate before this operation can be executed.');
        // Prompt the user to sign in again
      } else {
        console.error('Error deleting user:', error);
      }

      return false
    }
  } else {
    console.log("No user is currently signed in.");
  }
};



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

export async function updateEmail(email) {
  try {
    const res = await updateEmailAuth(auth.currentUser, email);
    return res
  } catch (error) {
    return error
  };
}

export const sendForgotPasswordEmail = async (email) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
};

export async function uploadSearchy({image, ...searchy}) {
  try {
    const imageUrl = await uploadImage(image, `searchy/${searchy.userId}/${searchy.title}`)
    const docRef = doc(dbFirestore, `searchy/${searchy.title}`);

    await setDoc(docRef, {
      ...searchy,
      image: imageUrl,
      createdAt: new Date()
    });

    return true
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export const fetchSearchy = async (uid = null, limit = 100) => {
  const collectionRef = collection(dbFirestore, 'searchy');
  let q = query(collectionRef, orderBy('createdAt', 'desc'), limitToLastFirestore(limit));

  if (uid) {
    q = query(collectionRef, where('userId', '==', uid), orderBy('createdAt', 'desc'), limitToLastFirestore(limit));
  }

  try {
    const querySnapshot = await getDocs(q);
    const userPromises = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const userRef = ref(getDatabase(), 'users/' + data.userId);
      return get(userRef).then(userSnapshot => {
        return {
          id: doc.id,
          type: 'searchy',
          user: userSnapshot.val(),
          ...data
        };
      }).catch(error => {
        console.error('Error fetching user data:', error);
        // Handle the user fetch error, possibly returning partial data with an error indicator
        return {
          id: doc.id,
          type: 'searchy',
          user: null, // or some error indicator
          ...data
        };
      });
    });

    return Promise.all(userPromises); // Wait for all user data to be fetched
  } catch (e) {
    console.error('Error fetching documents:', e);
    return []; // Return an empty array on error to maintain consistent function output type
  }
};

export async function deleteSearchy(id){
  const docRef = doc(dbFirestore, 'searchy', id);

  try{
    await deleteDoc(docRef)
    return true
  }catch(err){
    console.error('Error deleting document: ', err);
    return false
  }
}
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

// export function fetchItems(zoneId, limit = 10, uid = '', startAfterId = null ) {
//   return new Promise((resolve, reject) => {
//     const db = getDatabase();
//     let itemsQuery;
//     if (startAfterId) {
//       // Query for fetching subsequent batches
//       itemsQuery = dbQuery(
//         ref(db, 'items'),
//         orderByChild(`zoneId`),
//         equalTo(zoneId),
//         limitToLast(limit)
//       );
//     } else {
//       // Query for fetching the initial batch
//       itemsQuery = dbQuery(
//         ref(db, 'items'),
//         orderByChild('zoneId'),
//         equalTo(zoneId),
//         limitToLast(limit)
//       );
//     }

//     get(itemsQuery).then((snapshot) => {
//       if (snapshot.exists()) {
//         const itemsObject = snapshot.val();
//         const lastId = Object.keys(itemsObject)[Object.keys(itemsObject).length - 1]

//         const itemsArray = Object.values(itemsObject);

//         const itemsList = itemsArray.map(item => ({
//           id: item._id,
//           title: item.title, 
//           price: item.price,
//           location: item.address.address,
//           image: item.images[0],
//           ...item,
//         })).filter(item => item.status === 'active' && item.user?._id !== uid && Boolean(item.id) )
//         .sort((a, b) => {
//           return a.promotionScore - b.promotionScore;
//         }); 

//         resolve({...itemsList, lastId});
//       } else {
//         console.log("No data available");
//         resolve([])
//       }
//     }).catch((error) => {
//       reject(error);
//     });
//   })
// }

export async function fetchItems(zoneId, limit, startAfterId = null) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const itemsQuery = dbQuery(
      ref(db, 'items'),
      orderByChild('zoneId'),
      equalTo(zoneId ? zoneId : '-NhHdj8_3gWA-DyjE3GH'),
      limitToLast(limit)
    );

    get(itemsQuery).then(async (snapshot) => {
      if (snapshot.exists()) {
        let items = [];
        const itemPromises = [];

        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();

          // Assuming user data is stored in a separate path, e.g., 'users'
          const userPromise = get(ref(db, 'users/' + itemData.userId)).then(userSnapshot => {
            itemData.user = userSnapshot.val();
          });

          const subCategoryPromise = get(ref(db, 'subcategories/' + itemData.subCategoryId)).then(subCatSnapshot => {
            itemData.subCategory = subCatSnapshot.val();
          });

          const zonePromise = get(ref(db, 'zones/' + itemData.zoneId)).then(zoneSnapshot => {
            itemData.zone = zoneSnapshot.val();
          })

          itemPromises.push(userPromise, subCategoryPromise, zonePromise);

          items.push(itemData);
        });

        await Promise.all(itemPromises);


        let itemsArray = Object.values(items);
        const lastId = Object.keys(items)[Object.keys(items).length - 1]

        // Sort itemsArray if needed, then filter by active status and user ID
        itemsArray = itemsArray.filter((item => Boolean(item._id))).map(item => ({
          id: item._id,
          title: item.title,
          price: item.price,
          location: item.address.address,
          image: item.images[0],
          ...item,
        })).filter(item => item.status === 'active' && Boolean(item?.user))
          .sort((a, b) => {
            return b.promotionScore - a.promotionScore;
          });

        // Implement client-side pagination
        if (startAfterId) {
          const startIndex = itemsArray?.findIndex(item => item._id === startAfterId);
          if (startIndex >= 0) {
            itemsArray = itemsArray?.slice(startIndex + 1, startIndex + 1 + limit);
          } else {
            itemsArray = [];
          }
        } else {
          itemsArray = itemsArray?.slice(0, limit);
        }

        resolve({ items: [...itemsArray], lastId });
      } else {
        console.log("No data available");
        resolve({ items: [], lastId: null });
      }
    }).catch((error) => {
      reject(error);
    });
  });
}
export function fetchSearch(searchInput = null, searchSubCategory = null, limit, uid = '', startAfterId = null) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    let itemsQuery;
    if (searchInput) {
      const searchStr = searchInput.toLowerCase();
      itemsQuery = dbQuery(
        ref(db, 'items'),
        orderByChild('title'),
        startAt(searchStr),
        endAt(searchStr + "\uf8ff"),
        limitToLast(limit)
      );
    } else if (searchSubCategory) {
      itemsQuery = dbQuery(
        ref(db, 'items'),
        orderByChild('subCategoryId'),
        equalTo(searchSubCategory),
        limitToLast(limit)
      );
    }

    get(itemsQuery).then((snapshot) => {
      if (snapshot.exists()) {
        const itemsObject = snapshot.val();
        let itemsArray = Object.values(itemsObject);
        const lastId = Object.keys(itemsObject)[Object.keys(itemsObject).length - 1]

        // Sort itemsArray if needed, then filter by active status and user ID
        itemsArray = itemsArray.map(item => ({
          id: item._id,
          title: item.title,
          price: item.price,
          location: item.address.address,
          image: item.images[0],
          ...item,
        })).filter(item => item.status === 'active' && item.user?._id !== uid && Boolean(item.id))
          .sort((a, b) => {
            return b.promotionScore - a.promotionScore;
          });

        // Implement client-side pagination
        if (startAfterId) {
          const startIndex = itemsArray?.findIndex(item => item._id === startAfterId);
          if (startIndex >= 0) {
            itemsArray = itemsArray?.slice(startIndex + 1, startIndex + 1 + limit);
          } else {
            itemsArray = [];
          }
        } else {
          itemsArray = itemsArray?.slice(0, limit);
        }

        resolve({ items: [...itemsArray], lastId });
      } else {
        resolve({ items: [], lastId: null });
      }
    }).catch((error) => {
      reject(error);
    });
  });
}
