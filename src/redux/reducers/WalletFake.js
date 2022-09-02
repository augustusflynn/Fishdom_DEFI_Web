import { ethers } from "ethers";
import { INIT_STATE } from "../../constants/reduxConstants";
import { getType, walletFake } from "../actions";

export default function postsReducers(
  state = INIT_STATE.walletConnectFake,
  action
) {
  switch (action.type) {
    case getType(walletFake.walletSetFakeData):
      return new ethers.providers.JsonRpcProvider(action.payload);
    default:
      return new ethers.providers.JsonRpcProvider(state);
  }
}
