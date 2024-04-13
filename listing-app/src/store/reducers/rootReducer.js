import { combineReducers } from "redux";
import addItemSlice from "./Item/addItemSlice";
import userSlice from "./User/userSlice";
import apiSlice from "./Api/apiSlice";
import searchySlice from "./Searchy/searchySlice";

export const rootReducer = combineReducers({
    addItem: addItemSlice, 
    user: userSlice,
    api: apiSlice,
    searchy: searchySlice,
})