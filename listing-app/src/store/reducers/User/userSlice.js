import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../../firebase/index'; // Import your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';

// Async thunk for checking user authentication state
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          if (user.emailVerified) {
            console.log(user.emailVerified)
          }      
          dispatch(setUserId(user.uid))
          resolve(user);
        } else {
            console.log('Logged out')
            dispatch(logout());
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
  notifications: {
    recommendations: false,
    specialOffers: false,
  },
  createdAt: '',
  active: true,
  favorites: [''],
  isLoggedIn: false,
  loading: false,
  userId: '', // Add uid to the state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      Object.assign(state, action.payload);
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
      state.createdAt = new Date().toString();
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
} = userSlice.actions;

export default userSlice.reducer;
