import { INIT_STATE } from "../../constants/reduxConstants";
import { wallet, getType } from "../actions";

export default function postsReducers(
  state = INIT_STATE.walletConnect,
  action
) {
  switch (action.type) {
    case getType(wallet.walletSetData):
      return action.payload;
    default:
      return state;
  }
}
