import { Route } from "react-router-dom";
import LayoutDefault from "./layout/LayoutDefault";
import PartnersAndInvestors from "./pages/About/PartnersAndInvestors";
import Teams from "./pages/About/Teams";
import Claim from "./pages/Claim";
import ComingSoon from "./pages/ComingSoon";
import Stake from "./pages/Stake";
import Collection from "./pages/Trade/Collections";
import Marketplace from "./pages/Trade/Market";
import Swap from "./pages/Trade/Swap";

const listRoute = [
	{
		path: "/",
		element: <LayoutDefault />,
		childrent: [
			{
				path: process.env.REACT_APP_FISHDOM_GAME_URL,
				isURLOnly: true
			},
			{
				path: "stake",
				element: <Stake />,
				childrent: [],
			},
			{
				path: "claim",
				element: <Claim />,
				childrent: [],
			},
			{
				path: "",
				element: <Marketplace />,
				childrent: [],
			},
			{
				path: "trade-swap",
				element: <Swap />,
				childrent: [],
			},
			{
				path: "your-collection",
				element: <Collection />,
				childrent: [],
			},
			{
				path: "about-team",
				element: <Teams />,
				childrent: [],
			},
			{
				path: "about-partners-and-investors",
				element: <PartnersAndInvestors />,
				childrent: [],
			},
			{
				path: "*",
				element: <ComingSoon />,
				childrent: [],
			},
		],
	},
];
export default listRoute;
const getRoute = (info) => {
	if (info.isURLOnly) {
		return <></>
	}
	if (info.childrent.length > 0) {
		return (
			<Route path={info.path} element={info.element} key={info.path}>
				{info.childrent.map((item, index) => getRoute(item, index))}
			</Route>
		);
	}
	if (info.path) {
		return <Route path={info.path} element={info.element} key={info.path} />;
	} else {
		return <Route index element={info.element} key={info.path} />;
	}
};
export function RenderRoutes(routes) {
	return routes.map((info) => getRoute(info));
}
