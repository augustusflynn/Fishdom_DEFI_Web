import { Route } from "react-router-dom";
import LayoutDefault from "./layout/LayoutDefault";
import Audits from "./pages/About/Audits";
import PartnersAndInvestors from "./pages/About/PartnersAndInvestors";
//About
import Teams from "./pages/About/Teams";
//stake
import Claim from "./pages/Claim";
import ComingSoon from "./pages/ComingSoon";
import Proposals from "./pages/DAO/Proposals";
import CreateProposal from "./pages/DAO/Proposals/CreateProposal";
import ProposalDetail from "./pages/DAO/Proposals/ProposalDetail";
//Trade
import Landing from "./pages/Landing/Landing";
import PrivateRound from "./pages/PrivateRound";
//products
import CROWNAucition from "./pages/Products/CROWNAucition";
import CROWNLucky from "./pages/Products/CROWNLucky";
import LuckyTicket from "./pages/Products/LuckyTicket";
import SCEPTER from "./pages/Products/SCEPTER";
import Documents from "./pages/Resources/Documents";
import FAQ from "./pages/Resources/FAQ";
//Resources
import Tokenomics from "./pages/Resources/Tokenomics";
import SeedRound from "./pages/SeedRound";
import MiningCROWN from "./pages/Stake/MiningCROWN";
import StakeWDA from "./pages/Stake/StakeWDA";
import Collection from "./pages/Trade/Collections";
import WinMarket from "./pages/Trade/WinMarket";
import DetailMarketItem from "./pages/Trade/WinMarket/DetailMarketItem";
import WinSwap from "./pages/Trade/WinSwap";
import Vesting from "./pages/Vesting";

const listRoute = [
	{
		path: "/",
		element: <LayoutDefault />,
		childrent: [
			{
				path: "",
				element: <Landing />,
				childrent: [],
			},
			// stake
			{
				path: "stake-wda",
				element: <StakeWDA />,
				childrent: [],
			},
			{
				path: "stake-mining-crown",
				element: <MiningCROWN />,
				childrent: [],
			},
			{
				path: "claim",
				element: <Claim />,
				childrent: [],
			},
			{
				path: "claim" + `/:type`,
				element: <Claim />,
				childrent: [],
			},
			// product
			{
				path: "products-crown-lucky",
				element: <CROWNLucky />,
				childrent: [],
			},
			{
				path: "products-crown-auction",
				element: <CROWNAucition />,
				childrent: [],
			},
			{
				path: "products-lucky-ticket",
				element: <LuckyTicket />,
				childrent: [],
			},
			{
				path: "products-scepter",
				element: <SCEPTER />,
				childrent: [],
			},

			//DAO

			{
				path: "dao-proposals",
				element: <Proposals />,
				childrent: [
					{
						path: "proposal-detail" + `/:id`,
						element: <ProposalDetail />,
						childrent: [],
					},
					{
						path: "create-proposals",
						element: <CreateProposal />,
						childrent: [],
					},
				],
			},

			////////// Trade
			{
				path: "trade-win-market",
				element: <WinMarket />,
				childrent: [],
			},
			{
				path: "detail-market-item",
				element: <DetailMarketItem />,
				childrent: [],
			},
			{
				path: "trade-win-swap",
				element: <WinSwap />,
				childrent: [],
			},
			{
				path: "your-collection",
				element: <Collection />,
				childrent: [],
			},

			//Resources

			{
				path: "resources-tokenomics",
				element: <Tokenomics />,
				childrent: [],
			},
			{
				path: "resources-documents",
				element: <Documents />,
				childrent: [],
			},
			{
				path: "resources-faq",
				element: <FAQ />,
				childrent: [],
			},

			//About

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
				path: "about-audits",
				element: <Audits />,
				childrent: [],
			},
			////

			{
				path: "private-round",
				element: <PrivateRound />,
				childrent: [],
			},
			{
				path: "seed-round",
				element: <SeedRound />,
				childrent: [],
			},

			{
				path: "vesting",
				element: <Vesting />,
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
