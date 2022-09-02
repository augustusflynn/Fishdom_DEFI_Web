import { Space, Spin, Tabs, Row, Col } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	crownLuckyAbi,
	crownLuckyAddress,
} from "src/constants/abiCrownLucky.json";
import { luckyWDAAbi, luckyWDAAddress } from "src/constants/constants";
import { crownClaim } from "src/redux/actions";
import { crownClaim$, stakingClaim$, wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import { makeQueryBuilder } from "src/utils/MoralisQuery";

const Lucky = React.lazy(() => import("./Lucky"));
const CROWN = React.lazy(() => import("./CROWN"));
const LuckyCrown = React.lazy(() => import("./LuckyCrown"));
const Staking = React.lazy(() => import("./Staking"));

const { TabPane } = Tabs;
const Claim = () => {
	const walletConnect = useSelector(wallet$);
	const [currentTab, setCurrentTab] = useState("staking");
	const dispatch = useDispatch();
	const claimedData = useSelector(stakingClaim$).claimed;
	const crownedData = useSelector(crownClaim$).claimed;
	// Loading
	const [loading, setLoading] = useState(false);
	// Scepter
	const [scepter, setScepter] = useState(0);
	const [crownLucky, setCrownLucky] = useState(0);
	// Crown
	const [crowns, setCrowns] = useState([]);
	const [crownsLength, setCrownsLength] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [crownPageSize, setCrownPageSize] = useState(9);
	// Lucky
	const [totalTicket, setTotalTicket] = useState(0);
	const [luckyAvailable, setLuckyAvailable] = useState(0);
	const [jacketAvailable, setJacketAvailable] = useState(0);
	const [lucky, setLucky] = useState(0);
	const [jacket, setJacket] = useState(0);

	const [rewardAvailable, setRewardAvailable] = useState(0);
	const [totalTicketLose, setTotalTicketLose] = useState(0);

	useEffect(() => {
		let data = sessionStorage.getItem("claimStaking")
			? JSON.parse(sessionStorage.getItem("claimStaking"))
			: [];
		sessionStorage.setItem(
			"claimStaking",
			JSON.stringify([...data, ...claimedData])
		); // save data to sessionStorage
	}, [claimedData]);

	useEffect(() => {
		let data = sessionStorage.getItem("claimMining")
			? JSON.parse(sessionStorage.getItem("claimMining"))
			: [];
		console.log("Full feat", [...data, ...crownedData]);
		sessionStorage.setItem(
			"claimMining",
			JSON.stringify([...data, ...crownedData])
		); // save data to sessionStorage
	}, [crownedData]);

	useEffect(async () => {
		try {
			if (walletConnect) {
				setLoading(true);
				const address = await walletConnect.getAddress();
				const luckyContract = new ethers.Contract(
					luckyWDAAddress,
					luckyWDAAbi,
					walletConnect
				);
				const contract = new ethers.Contract(
					crownLuckyAddress,
					crownLuckyAbi,
					walletConnect
				);
				const amountScepter = await contract.ownerScepterNFT(address);
				const ticketTotalLose = await luckyContract.getOwnerTicketReward();
				const luckyTicketCount =
					await luckyContract.getOwnerWinningTicket5000WDA();
				const jacketTicketCount =
					await luckyContract.getOwnerWinningTicket100000WDA();
				const rewardAvailableCount =
					await luckyContract.getOwnerTicketRewardAvailable();
				const holdingLuckyTicket = await luckyContract.getOwnerTicket();
				const luckyTicketAvailableCount =
					await luckyContract.getOwnerWinningTicket5000WDAAvailable();
				const jacketTicketAvailableCount =
					await luckyContract.getOwnerWinningTicket100000WDAAvailable();
				const crownLuckyAmount = await contract.getOwnerCrownNFT();
				setLuckyAvailable(luckyTicketAvailableCount);
				setJacketAvailable(jacketTicketAvailableCount);
				setLucky(luckyTicketCount);
				setJacket(jacketTicketCount);
				setTotalTicketLose(parseInt(ticketTotalLose));
				setRewardAvailable(rewardAvailableCount);
				setTotalTicket(
					parseInt(ticketTotalLose) +
						parseInt(luckyTicketCount) +
						parseInt(jacketTicketCount) +
						parseInt(holdingLuckyTicket)
				);
				setScepter(amountScepter?.toString());
				setCrownLucky(parseInt(crownLuckyAmount));
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
		}
	}, [walletConnect]);
	useEffect(async () => {
		try {
			if (walletConnect) {
				const crownDataLength = await makeQueryBuilder("HistoryMining")
					.equalTo(
						"owner",
						walletConnect?.provider?.provider?.selectedAddress
							?.toString()
							?.toLowerCase()
					)
					.notEqualTo("nftId", "0")
					.count();
				const crownData = await makeQueryBuilder(
					"HistoryMining",
					crownPageSize,
					crownPageSize * (currentPage - 1)
				)
					.equalTo(
						"owner",
						walletConnect?.provider?.provider?.selectedAddress
							?.toString()
							?.toLowerCase()
					)
					.notEqualTo("nftId", "0") // k phai nft Id 0
					.find();
				// Handle data
				dispatch(
					crownClaim.crownClaimData(BaseHelper.formatDataMoralis(crownData))
				);
				let claimedData = sessionStorage.getItem("claimMining")
					? JSON.parse(sessionStorage.getItem("claimMining"))
					: [];
				// filter data
				let crownNewData = BaseHelper.formatDataMoralis(crownData);
				let countClaimed = 0;
				if (Object.keys(BaseHelper.formatDataMoralis(crownData)).length > 0) {
					crownNewData = crownNewData.filter((item) => {
						if (claimedData.indexOf(item?.uid?.toString()) != -1) {
							countClaimed++;
							return false;
						}
						return true;
					});
					// Reset sessionStorage if it has been removed from moralis
					if (countClaimed == 0) {
						dispatch(crownClaim.crownClaimed([]));
						sessionStorage.setItem("claimMining", JSON.stringify([]));
					}
				}
				// end handle
				console.log("Crowns: ", crownNewData);
				setCrowns(crownNewData);
				setCrownsLength(crownDataLength);
			}
		} catch (err) {
			console.log("Loi goi data");
			console.log(err);
		}
	}, [walletConnect, currentPage]);

	const crownPaginationHandler = (e) => {
		let container = document.getElementById("crown");
		setCurrentPage(e);
		window.scrollTo({
			top: container.offsetTop - 100,
			behavior: "smooth",
		});
	};

	return (
		<section className="c2i-container section" id="claim">
			<div className="claim-container text-center">
				<Space direction="vertical" size={40}>
					<h2 className="module-header c2i-no-margin">Claim</h2>
					{loading ? (
						<div style={{ display: "flex", justifyContent: "center" }}>
							<Spin />
						</div>
					) : (
						<>
							<div className="total-container">
								<div className="total-item">
									<div className="module-title">{totalTicket}</div>
									<div className="module-blur">Total Tickets</div>
								</div>
								<div className="line"></div>
								<div className="total-item">
									<div className="module-title">
										{crownsLength + crownLucky}
									</div>
									<div className="module-blur">Total CROWN</div>
								</div>
								<div className="line"></div>
								<div className="total-item">
									<div className="module-title">{scepter}</div>
									<div className="module-blur">Total SCEPTER</div>
								</div>
							</div>
							<div className="menu-container">
								<Tabs
									type="card"
									activeKey={window.location.hash || "#Staking"}
									onChange={(e) => {
										setCurrentTab(e);
										window.location.hash = e;
									}}
								>
									<TabPane tab="Staking" key="#Staking">
										<React.Suspense fallback={<Spin />}>
											<Staking />
										</React.Suspense>
									</TabPane>
									<TabPane tab="Lucky Ticket" key="#LuckyTicket">
										<React.Suspense fallback={<Spin />}>
											<div className="item-menu-container" id="#LuckyTicket">
												<Lucky
													{...{ headText: "Lucky Ticket" }}
													{...{
														setTotalTicket,
														rewardAvailable,
														setRewardAvailable,
														luckyAvailable,
														setLuckyAvailable,
														jacketAvailable,
														setTotalTicketLose,
														totalTicketLose,
														setJacketAvailable,
														lucky,
														jacket,
													}}
												/>
											</div>
										</React.Suspense>
									</TabPane>
									<TabPane tab="Mining CROWN" key="#MiningCrown">
										<React.Suspense fallback={<Spin />}>
											<CROWN
												{...{
													crowns,
													setCrowns,
													paginationHandler: crownPaginationHandler,
													currentPage,
													pageSize: crownPageSize,
													setCrownsLength,
													crownsLength,
												}}
											/>
										</React.Suspense>
									</TabPane>
									<TabPane tab="CROWN Lucky" key="#CrownLucky">
										<React.Suspense fallback={<Spin />}>
											<LuckyCrown
												currentTab={currentTab}
												walletConnect={walletConnect}
												scepter={scepter}
												setScepter={setScepter}
											/>
										</React.Suspense>
									</TabPane>
								</Tabs>
							</div>
						</>
					)}
				</Space>
			</div>
		</section>
	);
};

export default Claim;
