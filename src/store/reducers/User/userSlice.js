import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../../firebase/index'; // Import your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';
import { client } from '../../../apollo';
import { gql } from '@apollo/client';
import { dateStringToDDMMYYYY } from '../../../utilities/methods';

// Async thunk for checking user authentication state
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch, getState }) => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if(auth?.currentUser){
          dispatch(changeEmail(auth?.currentUser?.email))
          dispatch(setUserId(user?.uid))
          resolve(user);
        } else {
          // Check if we are awaiting email verification
          const { awaitingEmailVerification } = getState().user;
          if(awaitingEmailVerification){
            dispatch(setEmailChanged(true))
            useTimeout(() => {
              dispatch(changeEmail(auth.currentUser.email))
              dispatch(setAwaitingEmailVerification(false));
              dispatch(setEmailChanged(false))
              dispatch(logout())
            }, 20000)
          }else{
            console.log('Logged out');
            dispatch(logout());
          }
          // If we are awaiting email verification, do not dispatch logout
          resolve(null);
        }
      });
    });
  }
);

export const initialState = {
  name: '',
  description: '',
  phoneCode: '+359',
  phone: '',
  email: '',
  password: '',
  avatar: '',
  followers: [''],
  following: [''],
  likedItems: [''],
  ownedItems: [''],
  notifications: {
    recommendations: false,
    specialOffers: false,
  },
  createdAt: '',
  active: true,
  favorites: [''],
  isLoggedIn: false,
  loading: false,
  awaitingEmailVerification: false,
  emailChanged: false,
  uid: '', // Add uid to the state
  userId: '',
  changed: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAwaitingEmailVerification: (state, action) => {
      state.awaitingEmailVerification = action.payload;
    },
    setEmailChanged: (state, action) => {
      state.emailChanged = action.payload;
    },
    setCurrentUser: (state, action) => {
      Object.assign(state, { ...action.payload, createdAt: dateStringToDDMMYYYY(action.payload?.createdAt), email: auth.currentUser.email });
    },
    setUserId: (state, action) => { 
      state.isLoggedIn = true;
      state.userId = action.payload;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setCreatedAt: (state) => {
      state.createdAt = new Date()?.toString();
    },
    changeEmail: (state, action) => {
      state.email = action.payload;
    },
    changePhoneCode: (state, action) => {
      state.phoneCode = action.payload;
    },
    changePhone: (state, action) => {
      state.phone = action.payload;
    },
    changePassword: (state, action) => {
      state.password = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    changeName: (state, action) => {
      state.name = action.payload;
    },
    changeDescription: (state, action) => {
      state.description = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    appendFavorites: (state, action) => {
      const itemExists = state.favorites.some(favorite => favorite === action.payload);
      if (!itemExists) {
        state.favorites.push(action.payload);
        state.favorites = Array.from(new Set(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = Array.from(new Set(state.favorites.filter((favorite) => favorite !== action.payload)));
    },
    setOwnedItems: (state, action) => {
      state.ownedItems = action.payload;
    },
    changeOwnedItems: (state) => {
      state.changed = !state.changed;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setFollowers: (state, action) => {
      state.followers = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.uid = action.payload.uid;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.uid = '';
      });
  },

});

export const { 
  setRegister,
  setUserId,
  logout,
  setFavorites,
  setCreatedAt,
  setLoading,
  changePhoneCode,
  setCurrentUser,
  changeEmail,
  changePassword,
  changeName,
  changeDescription,
  setAvatar,
  changePhone,
  setAwaitingEmailVerification,
  setEmailChanged,
  appendFavorites,
  removeFavorite,
  changeOwnedItems,
  setOwnedItems,
  setFollowing,
  setFollowers
} = userSlice.actions;

export default userSlice.reducer;
