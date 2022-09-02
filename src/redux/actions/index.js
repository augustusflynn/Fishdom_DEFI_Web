import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
	return reduxAction().type;
};
export const isOpenTabBar = createActions({
	setStatus: (payload) => payload,
});

export const wallet = createActions({
	walletSetData: (payload) => payload,
});

export const walletFake = createActions({
	walletSetFakeData: (payload) => payload,
});

export const stakingClaim = createActions({
	stakingClaimData: (payload) => payload,
	stakingClaimed: (payload) => payload,
});

export const crownClaim = createActions({
	crownClaimData: (payload) => payload,
	crownClaimed: (payload) => payload,
});

export const market = createActions({
	marketData: (payload) => payload,
	sellData: (payload) => payload,
	withdrawData: (payload) => payload,
});
