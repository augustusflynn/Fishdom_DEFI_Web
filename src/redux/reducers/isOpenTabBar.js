import { INIT_STATE } from "../../constants/reduxConstants";
import { isOpenTabBar, getType } from "../actions";

export default function postsReducers(state = INIT_STATE.isOpenTabBar, action) {
  switch (action.type) {
    case getType(isOpenTabBar.setStatus):
      return action.payload;
    default:
      return state;
  }
}
