import { combineReducers } from "redux";
import addItemSlice from "./Item/addItemSlice";
import userSlice from "./User/userSlice";

export const rootReducer = combineReducers({
    addItem: addItemSlice,
    user: userSlice
})