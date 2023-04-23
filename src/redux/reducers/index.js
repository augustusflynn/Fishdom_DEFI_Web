import { combineReducers } from "redux";
import isOpenTabBar from "./isOpenTabBar";
import userReducers from "./user";

export default combineReducers({
	isOpenTabBar,
	user: userReducers
});
