import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './reducers/rootReducer'

export default store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})