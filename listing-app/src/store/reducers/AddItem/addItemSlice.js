import { createSlice } from '@reduxjs/toolkit'
import { generateRandomItemId } from './helpers'

const initialState = {
  condition: '',
  createdAt: '',
  description: '',
  images:[],
  price: 0,
  status: 'Pending',
  subCategoryId: '',
  title: '',
  userId: 'userId1',
  zoneId: '', 
  address: {
    address: '',
    coordinates: {
      longitude: 0,
      latitude: 0  
    }
  }
}

export const addItemSlice = createSlice({
  name:'addItem',
  initialState:initialState,
  reducers:{
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
      state.createdAt = new Date().toISOString()
    },
    setSubCategoryId: (state, action) => {
      state.subCategoryId = action.payload
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
})

export const { 
  setId,
  changeTitle,
  changeDescription,
  changePrice,
  changeCondition,
  changeImages,
  setCreatedAt,
  setSubCategoryId,
  setZoneId,
  setAddress,
  setUserId,
  setCurrentCoordinates,
  removeImage
} = addItemSlice.actions

export default addItemSlice.reducer
