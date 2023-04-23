import { combineReducers } from "redux";
import isOpenTabBar from "./isOpenTabBar";
import wallet from "./wallet";
import userReducers from "./user";

export default combineReducers({
	isOpenTabBar,
	wallet,
	user: userReducers
});
