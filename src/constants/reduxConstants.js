import { providerFake } from "./apiContants";

export const INIT_STATE = {
	isOpenTabBar: true,
	walletConnect: null,
	walletConnectFake: providerFake,
	stakingClaimData: {
		stake: [],
		claimed: [],
	},
	stakingClaimed: null,
	crownClaimData: {
		crown: [],
		claimed: [],
	},
	marketData: {
		market: [],
		sell: [],
		withdraw: [],
	},
	crownClaimed: null,
	user: {}
};
