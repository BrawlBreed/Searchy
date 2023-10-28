import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GoogleAuthProvider, signInWithRedirect, initializeAuth, getRedirectResult, getAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
// initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
const auth = getAuth();
const provider = new GoogleAuthProvider();

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

export const googleSignIn = async () => {
  try {
    const result = await signInWithRedirect(auth, provider);
    console.log(result)
  } catch (error) {
    console.log(error)
  }
  
  // getRedirectResult(auth)
  // .then((result) => {
  //   // This gives you a Google Access Token. You can use it to access Google APIs.
  //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   const token = credential.accessToken;

  //   // The signed-in user info.
  //   const user = result.user;
  //   // IdP data available using getAdditionalUserInfo(result)
  //   // ...
  // }).catch((error) => {
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.customData.email;
  //   // The AuthCredential type that was used.
  //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   // ...
  // });

}