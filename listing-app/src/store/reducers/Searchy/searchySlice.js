import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  createdAt: '',
  description: '',
  image: null,
  inquiry: '',
  status: 'active',
  subCategoryId: '',
  title: '',
  userId: '',
  zoneId: '-NhHdj8_3gWA-DyjE3GH',
  views: 0,
  activeTab: 0,
  hiddenTab: false
}

export const searchySlice = createSlice({
  name:'searchy',
  initialState:initialState,
  reducers:{
    resetForm: (state) => {
      state.createdAt = ''  
      state.description = ''
      state.inquiry = ''
      state.status = 'active'
      state.subCategoryId = ''
      state.image = null
      state.title = ''
      state.userId = ''
      state.zoneId = ''
      state.views = 0
    },
    changeTitle: (state, action) => {
      state.title = action.payload
    },
    changeInquiry: (state, action) => {
      state.inquiry = action.payload
    },
    setActiveTab: (state) => {
      state.activeTab = state.activeTab >= 2 || state.activeTab === 'hidden' ? 0 : state.activeTab + 1
    },
    toggleTab: (state, action) => {
      state.hiddenTab = action.payload ? action.payload : !state.hiddenTab
    },
    changeDescription: (state, action) => {
      state.description = action.payload
    },
    setImage: (state, action) => {
      state.image = action.payload
    },
    setCreatedAt: (state) => {
      state.createdAt = String(new Date())
    },
    setZoneId: (state, action) => {
      state.zoneId = action.payload
    },
    setUserId: (state, action) => {
      state.userId = action.payload
    },
  }
})

export const { 
  resetForm,
  changeTitle, 
  changeDescription,
  setCreatedAt,
  setUserId,
  setZoneId,
  setImage,
  hideTab,
  changeInquiry,
  setActiveTab,
  toggleTab
} = searchySlice.actions

export default searchySlice.reducer
