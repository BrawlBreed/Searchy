import { combineReducers } from "redux";
import addItemSlice from "./AddItem/addItemSlice";

export const rootReducer = combineReducers({
    addItem: addItemSlice
})