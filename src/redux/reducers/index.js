import { combineReducers } from "redux";
import { stakingClaimData, crownClaimData } from "./claim";
import isOpenTabBar from "./isOpenTabBar";
import wallet from "./wallet";
import walletFake from "./WalletFake";
import { marketSetData } from "./market";
import userReducers from "./user";

export default combineReducers({
	isOpenTabBar,
	wallet,
	stakingClaimData,
	crownClaimData,
	walletFake,
	market: marketSetData,
	user: userReducers
});
