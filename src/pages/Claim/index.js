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
import Staking from './Staking'
// const Lucky = React.lazy(() => import("./Lucky"));
// const CROWN = React.lazy(() => import("./CROWN"));
// const LuckyCrown = React.lazy(() => import("./LuckyCrown"));
// const Staking = React.lazy(() => import("./Staking"));

// const { TabPane } = Tabs;
const Claim = () => {
	const walletConnect = useSelector(wallet$);
	const [loading, setLoading] = useState(false);

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
							{/* <div className="total-container">
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
							</div> */}
							<div className="menu-container">
								{/* <Tabs
									type="card"
									activeKey={window.location.hash || "#Staking"}
									onChange={(e) => {
										setCurrentTab(e);
										window.location.hash = e;
									}}
								> */}
								{/* <TabPane tab="Staking" key="#Staking"> */}
								{/* <React.Suspense fallback={<Spin />}> */}
								<Staking />
								{/* </React.Suspense> */}
								{/* </TabPane> */}
								{/* <TabPane tab="Lucky Ticket" key="#LuckyTicket">
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
								</Tabs> */}
							</div>
						</>
					)}
				</Space>
			</div>
		</section>
	);
};

export default Claim;
