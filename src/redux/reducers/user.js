import { INIT_STATE } from "../../constants/reduxConstants";
import { user, getType } from "../actions";

export default function userReducers(
  state = INIT_STATE.user,
  action
) {
  switch (action.type) {
    case getType(user.setUser):
      return action.payload;
    default:
      return state;
  }
}
