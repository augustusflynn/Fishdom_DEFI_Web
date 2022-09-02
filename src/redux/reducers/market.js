import { INIT_STATE } from "../../constants/reduxConstants";
import { stakingClaim, crownClaim, getType, market } from "../actions";

export function marketSetData(state = INIT_STATE.marketData, action) {
	switch (action.type) {
		case getType(market.marketData):
			const data = [...state.market, ...action.payload];
			return {
				...state,
				market: [...new Set(data)],
			};
		case getType(market.sellData):
			const dataSell = [...action.payload];
			return {
				...state,
				sell: [...new Set(dataSell)],
			};
		case getType(market.withdrawData):
			const dataWithdraw = [...action.payload];
			return {
				...state,
				withdraw: [...new Set(dataWithdraw)],
			};
		default:
			return { ...state };
	}
}
