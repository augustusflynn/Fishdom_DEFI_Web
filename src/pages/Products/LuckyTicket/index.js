import { message } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import LuckyTicketHelper from "src/constants/lucky";
import ModalWallet from "src/layout/Topbar/ModalWallet";
import { makeQueryBuilder } from "src/utils/MoralisQuery";
import notif from "src/component/notif";
import {
	luckyWDAAbi,
	luckyWDAAddress,
	wdaAbi,
	wdaAddress,
} from "../../../constants/constants";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import { wallet$ } from "../../../redux/selectors";
import HistoryLucky from "./HistoryLucky/HistoryLucky";
import LuckyJoining from "./LuckyJoining";

const messageObject = {
	0: {
		message: "You can buy ticket at this time!",
		type: "success",
	},
	1: {
		message:
			"You shouldn't buy ticket at this time because the system is generating random winner, please reload after 3 minutes to see next state!",
		type: "warning",
	},
	2: {
		message:
			"You shouldn't buy ticket at this time because the system is paying winner, please reload after 3 minutes to see next state!",
		type: "warning",
	},
};

function LuckyTicket(props) {
	// MORALIS
	const [currentPage, setCurrentPage] = useState(1);
	const [timeData, setTimeData] = useState(
		moment(
			`${moment().utc().format("YYYY-MM-DD")} 00:00 AM`,
			"YYYY-MM-DD HH:mm"
		).toDate()
	);
	const [contractState, setContractState] = useState();
	//new Date(`${moment().utc().format("YYYY-MM-DD")} 00:00 AM`)
	const {
		data: historyData,
		error,
		isLoading: historyLoading,
	} = useMoralisQuery(
		"WDATicketWin",
		(query) => {
			if (timeData) {
				query = query
					.greaterThanOrEqualTo("createdAt", timeData)
					.lessThan("createdAt", moment(timeData).add(1, "day").toDate());
			}
			return query
				.ascending("amount")
				.limit(LuckyTicketHelper.historyLimit)
				.skip((currentPage - 1) * LuckyTicketHelper.historyLimit);
		},
		[timeData, currentPage],
		{ live: true }
	);
	// useEffect(() => {
	// 	console.log(timeData, moment(timeData).add(1, "day").toDate());
	// }, [timeData]);
	const {
		data: lastTimeRandom,
		error: randomError,
		isLoading: randomLoading,
	} = useMoralisQuery(
		"RandomLuckyTicket",
		(query) => {
			return query.descending("createdAt").limit(1);
		},
		[],
		{
			live: true,
			onLiveCreate: async (entity, all) => {
				await initData();
				return [entity, ...all];
			},
			onLiveUpdate: async (entity, all) => {
				await initData();
				return [entity, ...all];
			},
		}
	);
	useEffect(() => {
		if (lastTimeRandom && Object.keys(lastTimeRandom).length > 0) {
			setEndOnTime(
				parseInt(lastTimeRandom[0]?.attributes?.timestamp?.toString() + "000")
			);
		}
	}, [lastTimeRandom]);
	// CONTRACT
	const walletConnect = useSelector(wallet$);
	const [showWalletState, setShowWalletState] = useState(false);
	let contract;
	let wdaContract;
	contract = new ethers.Contract(luckyWDAAddress, luckyWDAAbi, walletConnect);
	wdaContract = new ethers.Contract(wdaAddress, wdaAbi, walletConnect);

	// LUCKY-JOIN HOOKS
	const [loadData, setLoadData] = useState(false);
	const [holdingTicket, setHoldingTicket] = useState(0);
	const [feePerTicket, setFeePerTicket] = useState(0);
	const [ticketAmount, setTicketAmount] = useState(0);
	const [endOnTime, setEndOnTime] = useState(); // 5 days after
	const [luckyTicketCount, setLuckyTicketCount] = useState(0);
	const [buyLoading, setBuyLoading] = useState(false);
	const location = useLocation().pathname;
	const pathname = location.split("/")[2];
	const [jackpotTicketCount, setJackpotTicketCount] = useState(0);
	const [ticketSoldPerPeriod, setTicketSoldPerPeriod] = useState(0);
	const [maxTicketAllMarket, setMaxTicketAllMarket] = useState(50000);
	const [wda, setWda] = useState(0);
	const [maxTicket, setMaxTicket] = useState(50);
	const [period, setPeriod] = useState(5 * 3600 * 24);
	const [errorData, setErrorData] = useState(false);
	// HISTORY HOOKS
	const [historyDataCount, setHistoryDataCount] = useState(0);

	// FUNCTIONS
	const showWallet = () => {
		setShowWalletState(true);
	};

	const hideWallet = () => {
		setShowWalletState(false);
	};
	const buyTicketHandler = async () => {
		console.log(contract);
		console.log(ticketAmount);
		if (ticketAmount == 0) {
			message.error("Please input ticket amount that is greater than 0!");
			return;
		}
		if (ticketSoldPerPeriod + ticketAmount > maxTicketAllMarket) {
			message.error("Over allowance Ticket in the market!");
			return;
		}
		if (ticketAmount > maxTicket) {
			message.error("Over allowance Ticket!");
			return;
		}
		try {
			const newWdaContract = new ethers.Contract(
				wdaAddress,
				wdaAbi,
				walletConnect
			);
			setBuyLoading(true);
			const wdaApprove = await newWdaContract.approve(
				luckyWDAAddress,
				ethers.utils.parseEther((ticketAmount * 1000).toString())
			);
			await wdaApprove.wait();

			console.log(
				
				
				
				
				"Ticket amount",
				ticketAmount,
				"Fee: ",
				ethers.utils
					.parseEther(
						parseFloat
			(ticketAmount * feePerTicket)
							.toFixed(4)
							.toString()
					)
					.toString()
			);
			const buyState = await contract.buyTicket(parseInt(ticketAmount) || 0, {
				value: ethers.utils
					.parseEther(
						parseFloat(ticketAmount * feePerTicket)
							.toFixed(4)
							.toString()
					)
					.toString(),
			});

			await buyState.wait();
			message.success("Buy ticket successfully!");
			setMaxTicket(parseInt(maxTicket) - parseInt(ticketAmount));
			setTicketSoldPerPeriod(
				parseInt(ticketSoldPerPeriod) + parseInt(ticketAmount)
			);
			setHoldingTicket(parseInt(holdingTicket) + parseInt(ticketAmount));
			setTicketAmount("");
			setBuyLoading(false);
		} catch (err) {
			setBuyLoading(false);
			if (err.code == 4001) {
				message.error("Transaction is cancelled!");
			} else {
				message.error("Transaction error!");
			}
		}
	};
	const claimTicket = async (ticketType) => {
		if (!walletConnect) {
			setShowWalletState(true);
		} else {
			try {
				const claimCoin = await contract.claimCoin(ticketType);
				await claimCoin.wait();
				if (ticketType == 0) {
					setLuckyTicketCount(luckyTicketCount - 1);
				} else {
					setJackpotTicketCount(jackpotTicketCount - 1);
				}
			} catch (err) {
				message.error(err?.data?.message);
			}
		}
	};

	// HOOKS
	useEffect(() => {
		let run = true;

		run &&
			(async () => {
				try {
					await initData();
				} catch (err) {}
			})();
		return () => {
			run = false;
		};
	}, [walletConnect]);
	useEffect(() => {
		// Scroll to top when go to this page
		window.scrollTo(0, 0);
	}, []);
	useEffect(() => {
		let run = true;
		run &&
			(async () => {
				if (timeData) {
					setCurrentPage(1);
					setHistoryDataCount(
						await makeQueryBuilder("WDATicketWin")
							.greaterThan("createdAt", timeData)
							.lessThan("createdAt", moment(timeData).add(1, "day").toDate())
							.count()
					);
				}
			})();
		return () => {
			run = false;
		};
	}, [timeData]);
	async function initData() {
		if (!walletConnect) {
			let provider = new ethers.providers.JsonRpcProvider(
				"https://kovan.infura.io/v3/"
			);
			contract = new ethers.Contract(luckyWDAAddress, luckyWDAAbi, provider);
			setLoadData(true);

			await Promise.all([
				await contract.lastTimeCheck(),
				await contract.getFeePerTicket(),
				await contract.totalTicketSoldPerPeriod(),
				await contract.contractState(),
			]).then((res) => {
				setEndOnTime(parseInt(res[0].toString() + "000"));
				setFeePerTicket(ethers.utils.formatEther(res[1]).toString());
				setTicketSoldPerPeriod(parseInt(res[2]));
				notif(res[3].toString(), messageObject);
			});
			setLoadData(false);

			return;
		}
		contract = new ethers.Contract(luckyWDAAddress, luckyWDAAbi, walletConnect);
		wdaContract = new ethers.Contract(wdaAddress, wdaAbi, walletConnect);
		setLoadData(true);
		const address = walletConnect?.provider?.provider?.selectedAddress;
		const maxTicketSold = 50000;
		await Promise.all([
			await wdaContract.balanceOf(address),
			await contract.getOwnerTicket(),
			await contract.getOwnerWinningTicket5000WDA(),
			await contract.getOwnerWinningTicket100000WDA(),
			await contract.lastTimeCheck(),
			await contract.getFeePerTicket(),
			await contract.totalTicketSoldPerPeriod(),
			await contract.contractState(),
		]).then(async (res) => {
			console.log("Owner", res[1]);
			console.log("Lucky", res[2]);
			setWda(ethers.utils.formatEther(res[0].toString()));
			setHoldingTicket(parseInt(res[1]));
			setLuckyTicketCount(parseInt(res[2]));
			setJackpotTicketCount(parseInt(res[3]));
			setEndOnTime(parseInt(res[4].toString() + "000"));
			setFeePerTicket(ethers.utils.formatEther(res[5]).toString());
			setTicketSoldPerPeriod(parseInt(res[6]));
			let holdingTicketCall = parseInt(res[1]);
			let wdaCall = parseInt(ethers.utils.formatEther(res[0].toString()));
			if (
				parseInt(parseInt(wdaCall) / 1000) <
				50 - parseInt(holdingTicketCall)
			) {
				setMaxTicket(parseInt(parseInt(wdaCall) / 1000));
			} else {
				setMaxTicket(50 - parseInt(holdingTicketCall));
			}
			notif(res[7].toString(), messageObject);
			setContractState(res[7].toString());
		});
		setMaxTicketAllMarket(maxTicketSold);
		setLoadData(false);
	}
	return (
		<>
			<>
				<Fragment>
					{showWalletState ? (
						<ModalWallet
							isModalVisible={showWalletState}
							hideWallet={hideWallet}
						/>
					) : (
						<></>
					)}
					<FadeAnimationOdd />
					<LuckyJoining
						showWallet={showWallet}
						setTicketAmount={setTicketAmount}
						walletConnect={walletConnect}
						holdingTicket={holdingTicket}
						buyTicketHandler={buyTicketHandler}
						feePerTicket={feePerTicket}
						ticketAmount={ticketAmount}
						maxTicket={maxTicket}
						period={period}
						setMaxTicket={setMaxTicket}
						ticketSoldPerPeriod={ticketSoldPerPeriod}
						wda={wda}
						maxTicketAllMarket={maxTicketAllMarket}
						endOnTime={endOnTime}
						setEndOnTime={setEndOnTime}
						buyLoading={buyLoading}
						loadData={loadData}
						contractState={contractState}
					/>
					<HistoryLucky
						luckyTicketCount={luckyTicketCount}
						jackpotTicketCount={jackpotTicketCount}
						claimTicket={claimTicket}
						setTimeData={setTimeData}
						dataState={{
							data: historyData,
							error,
							isLoading: historyLoading,
							length: historyDataCount,
							currentPage,
							setCurrentPage,
						}}
					/>
				</Fragment>
			</>
		</>
	);
}
export default LuckyTicket;
