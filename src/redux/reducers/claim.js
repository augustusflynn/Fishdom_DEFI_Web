import { INIT_STATE } from "../../constants/reduxConstants";
import { stakingClaim, crownClaim, getType, market } from "../actions";

export function stakingClaimData(state = INIT_STATE.stakingClaimData, action) {
	switch (action.type) {
		case getType(stakingClaim.stakingClaimData):
			return { ...state, stake: action.payload };
		case getType(stakingClaim.stakingClaimed):
			const data = [...state.claimed, ...action.payload];
			return {
				...state,
				claimed: [...new Set(data)],
			};
		default:
			return { ...state };
	}
}

export function crownClaimData(state = INIT_STATE.crownClaimData, action) {
	switch (action.type) {
		case getType(crownClaim.crownClaimData):
			return { ...state, crown: action.payload };
		case getType(crownClaim.crownClaimed):
			const data = [...state.claimed, ...action.payload];
			return {
				...state,
				claimed: [...new Set(data)],
			};
		default:
			return { ...state };
	}
}
