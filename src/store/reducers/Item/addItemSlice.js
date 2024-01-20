import { createSlice } from '@reduxjs/toolkit'
import { checkUserAuth } from '../User/userSlice'

const initialState = {
  condition: '',
  createdAt: '',
  description: '',
  images:[],
  price: 0,
  status: 'active',
  promoted: false,
  subCategoryId: '',
  title: '',
  userId: '',
  zoneId: '-NhHdj8_3gWA-DyjE3GH',
  zone: {
    zone: '',
    coordinates: {
      longitude: 0,
      latitude: 0
    }
  }, 
  address: {
    address: '',
    coordinates: {
      longitude: 0,
      latitude: 0  
    }
  },
  views: 0,
  likes: ['']
}

export const addItemSlice = createSlice({
  name:'addItem',
  initialState:initialState,
  reducers:{
    resetForm: (state) => {
      state.condition = ''
      state.createdAt = ''  
      state.description = ''
      state.likes = ['']
      state.images = []
      state.price = 0
      state.status = 'active'
      state.subCategoryId = ''
      state.title = ''
      state.userId = ''
      state.zoneId = ''
      state.currentLocation = ''
      state.zone = {
        zone: '',
        coordinates: {
          longitude: 42.6833,
          latitude: 23.3167
        }
      }
      state.address = {
        address: '',
        coordinates: {
          longitude: 0,
          latitude: 0  
        }
      },
      state.views = 0
    },
    changeTitle: (state, action) => {
      state.title = action.payload
    },
    changeDescription: (state, action) => {
      state.description = action.payload
    },
    changePrice: (state, action) => {
      // Check if the payload is a valid float or an incomplete float
      const isFloat = /^(\d+)?(\.\d*)?$/.test(action.payload);
    
      if (isFloat) {
        // If it's a valid or incomplete float, store it as a string
        state.price = action.payload;
      } else {
        // If it's not a valid float, you might want to handle this case
        // For now, let's set the price to 0 or keep the previous value
        state.price = state.price || 0;
      }
    },
        changeCondition: (state, action) => {
      state.condition = action.payload
    },
    changeImages: (state, action) => {
      state.images = action.payload
    },
    removeImage: (state, action) => {
      state.images = state.images.filter((item, index) => index !== action.payload)
    },
    setCreatedAt: (state) => {
      state.createdAt = String(new Date())
    },
    setSubCategoryId: (state, action) => {
      state.subCategoryId = action.payload
    },
    setZone: (state, action) => {
      action.payload.zone ? action.payload.zone = action.payload.zone : action.payload.zone = 'Sofia'
      state.zone = action.payload
    },
    setZoneId: (state, action) => {
      state.zoneId = action.payload
    },
    setCurrentCoordinates: (state, action) => {
      state.address.coordinates = action.payload
      state.address.coordinates.longitude = Number(state.address.coordinates.longitude)
      state.address.coordinates.latitude = Number(state.address.coordinates.latitude)
    },
    setAddress: (state, action) => {
      state.address.address = action.payload
    },
    setUserId: (state, action) => {
      state.userId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.userId = action.payload.uid
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.userId = ''
      });
  },
})

export const { 
  resetForm,
  changeTitle, 
  changeDescription,
  changePrice,
  changeCondition,
  changeImages,
  setCreatedAt,
  setSubCategoryId,
  setZone,
  setAddress,
  setUserId,
  setZoneId,
  setCurrentCoordinates,
  removeImage
} = addItemSlice.actions

export default addItemSlice.reducer
