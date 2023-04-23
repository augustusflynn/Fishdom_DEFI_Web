import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
	return reduxAction().type;
};
export const isOpenTabBar = createActions({
	setStatus: (payload) => payload,
});

export const user = createActions({
	setUser: (payload) => payload
});
