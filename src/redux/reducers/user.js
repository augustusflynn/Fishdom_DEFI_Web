import { INIT_STATE } from "../../constants/reduxConstants";
import { user, getType } from "../actions";

export default function userReducers(
  state = INIT_STATE.user,
  action
) {
  switch (action.type) {
    case getType(user.setUser):
      localStorage.setItem('fd_user', JSON.stringify(action.payload))   
      return action.payload;
    default:
      return state;
  }
}
