import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './reducers/rootReducer'

export default store = configureStore({
    reducer: rootReducer
})