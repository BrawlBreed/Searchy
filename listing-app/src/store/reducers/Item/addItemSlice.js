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
  zoneId: '',
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
  views: 0
}

export const addItemSlice = createSlice({
  name:'addItem',
  initialState:initialState,
  reducers:{
    resetForm: (state) => {
      state.condition = ''
      state.createdAt = ''  
      state.description = ''
      state.images = []
      state.price = 0
      state.status = 'active'
      state.subCategoryId = ''
      state.title = ''
      state.userId = ''
      state.zoneId = ''
      state.zone = {
        zone: '',
        coordinates: {
          longitude: 0,
          latitude: 0
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
      state.price = Number(action.payload)
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
