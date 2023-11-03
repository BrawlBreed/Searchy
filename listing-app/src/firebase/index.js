import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkUserAuth, setLoading, setRegister, setUserId } from "../store/reducers/User/userSlice";

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

// Initialize Realtime Database and get a reference to the service
export const storage = getStorage(app);

export async function uploadImages(images, path) {
  const uploadPromises = images.map(async (image, index) => {
    const response = await fetch(image);
    image = await response.blob();
    const reference = ref(storage, `${path}/${index}`);
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

export const createOrSignInWithEmail = async (email, password, dispatch, mutateFunction) => {
  dispatch(setLoading(true));
  try {
    // Try to create a new account
    const signUpResponse = await createUserWithEmailAndPassword(auth, email, password);
    dispatch(setUserId(signUpResponse.user.uid));
    const res = mutateFunction();
    console.log(res)
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
