export const INIT_STATE = {
	isOpenTabBar: true,
	walletConnect: null,
	user: JSON.parse(localStorage.getItem('fd_user') || "{}")
};
