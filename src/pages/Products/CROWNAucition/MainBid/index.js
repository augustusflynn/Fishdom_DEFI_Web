import { message } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
// import { useMoralisSubscription } from "react-moralis";
import { useSelector } from "react-redux";
import {
	auctionAbi,
	auctionAddress,
	crownNFTAbi,
	crownNFTAdress,
	wdaAbi,
	wdaAddress,
} from "src/constants/constants";
import { wallet$, walletFake$ } from "src/redux/selectors";
import { apiService } from "src/utils/api";
import BaseHelper from "src/utils/BaseHelper";
import { makeQueryBuilder } from "src/utils/MoralisQuery";
import AfterEnd from "./AfterEnd";
import BeforeEnd from "./BeforeEnd";

const formatDataMoralis = (data) => {
	return data?.length && data?.length > 0
		? data.map((item) => item?.attributes)
		: data;
};

const MainBid = (props) => {
	const { isEnd, setIsEnd } = props;
	const walletConnect = useSelector(wallet$);
	const walletConnectFake = useSelector(walletFake$);
	let auctionContract;
	let crownContract;
	// Main Bid State
	const [tokenId, setTokenId] = useState();
	const [success, setSuccess] = useState(false);
	const [auctionData, setAuctionData] = useState([]);
	const [expiredTime, setExpiredTime] = useState();
	const [metaData, setMetaData] = useState({});
	const [historyBidData, setHistoryBidData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [closeAuctionData, setCloseAuctionData] = useState({});
	const [metaLoading, setMetaLoading] = useState(false);
	const [dataLoading, setDataLoading] = useState(false);
	const [notHaveAuction, setNotHaveAuction] = useState(false);
	// HOOKS
	useEffect(() => {
		if (expiredTime && expiredTime != 0) {
			if (
				parseInt(expiredTime) - moment().toDate().getTime() < 3600 * 1000 &&
				parseInt(expiredTime) - moment().toDate().getTime() > 0
			) {
				message.warning(
					`${parseInt(
						(parseInt(expiredTime) - moment().toDate().getTime()) / 60000
					)} minutes before the end of session`
				);
			}
		}
	}, [expiredTime]);
	// useEffect(() => {
	// 	let run = true;
	// 	run &&
	// 		(async () => {
	// 			try {
	// 				setMetaLoading(true);
	// 				setDataLoading(true);
	// 				await moralisCheckClosed();
	// 				await moralisInit().then(async (res) => {
	// 					setDataLoading(false);
	// 					let provider = new ethers.getDefaultProvider("kovan");
	// 					let crownContract = new ethers.Contract(
	// 						crownNFTAdress,
	// 						crownNFTAbi,
	// 						provider
	// 					);
	// 					if (walletConnect) {
	// 						// get auction again because of setAuctionData is waiting time
	// 						crownContract = new ethers.Contract(
	// 							crownNFTAdress,
	// 							crownNFTAbi,
	// 							walletConnect
	// 						);
	// 					}
	// 					const totalSupply = await crownContract.totalSupply();
	// 					const maxSupply = await crownContract.maxSupply();
	// 					if (parseInt(maxSupply) < parseInt(totalSupply)) {
	// 						setIsEnd(true);
	// 					}

	// 					const uri = await crownContract.tokenURI(
	// 						res.auction[0]?.attributes.nftId
	// 					);

	// 					await apiService("get", uri).then((res) => {
	// 						if (res?.status == 200) {
	// 							setMetaData(res.data);
	// 							setMetaLoading(false);
	// 						}
	// 					});
	// 				});
	// 			} catch (err) {}
	// 		})();
	// 	return () => {
	// 		run = false;
	// 	};
	// }, [walletConnect]);
	// // SUBSCRIPTION MORALIS HOOK
	// useMoralisSubscription(
	// 	"AuctionPlaceBid",
	// 	(query) =>
	// 		query.descending("block_number").descending("createdAt").limit(1),
	// 	[],
	// 	{
	// 		live: true,
	// 		onUpdate: (data) => {
	// 			if (!BaseHelper.checkHasItemInArrayMoralis(historyBidData, data)) {
	// 				setHistoryBidData([data, ...historyBidData]);
	// 			}
	// 		},
	// 	}
	// );
	// useMoralisSubscription(
	// 	"AuctionClose",
	// 	(query) =>
	// 		query.descending("block_number").descending("createdAt").limit(1),
	// 	[],
	// 	{
	// 		live: true,
	// 		onUpdate: async () => {
	// 			// Because real-time of moralis have some stupid things it will listen 2 times
	// 			await moralisCheckClosed();
	// 		},
	// 	}
	// );
	// useMoralisSubscription(
	// 	"AuctionOpened",
	// 	(query) =>
	// 		query.descending("block_number").descending("createdAt").limit(1),
	// 	[],
	// 	{
	// 		live: true,
	// 		onUpdate: async (data) => {
	// 			// Update all data from scratch
	// 			setMetaLoading(true);
	// 			const expiredTime = parseInt(`${data?.attributes.closingTime}000`);
	// 			setExpiredTime(expiredTime);
	// 			setHistoryBidData([]);
	// 			setAuctionData([data]);
	// 			setSuccess(false);
	// 			setDataLoading(false);
	// 			setNotHaveAuction(false);
	// 			crownContract = new ethers.Contract(
	// 				crownNFTAdress,
	// 				crownNFTAbi,
	// 				walletConnect
	// 			);
	// 			const totalSupply = await crownContract.totalSupply();
	// 			const maxSupply = await crownContract.maxSupply();
	// 			if (parseInt(maxSupply) < parseInt(totalSupply)) {
	// 				setIsEnd(true);
	// 			}
	// 			const uri = await crownContract.tokenURI(data?.attributes.nftId);
	// 			await apiService("get", uri).then((res) => {
	// 				if (res?.status == 200) {
	// 					setMetaData(res.data);
	// 					setMetaLoading(false);
	// 				}
	// 			});
	// 		},
	// 	}
	// );

	// FUNCTIONS
	const moralisCheckClosed = async () => {
		const auction = await makeQueryBuilder("AuctionOpened", 1)
			.equalTo("confirmed", true)
			.find();
		const closeAuction = await makeQueryBuilder("AuctionClose", 1)
			.equalTo("confirmed", true)
			.find();
		if (auction[0]?.attributes?.nftId === closeAuction[0]?.attributes?.nftId) {
			setSuccess(true);
			setCloseAuctionData(closeAuction[0]);
		}
	};
	const moralisInit = async () => {
		const auctionData = await makeQueryBuilder("AuctionOpened", 1)
			.equalTo("confirmed", true)
			.descending("block_number")
			.find();
		const closeData = await makeQueryBuilder("AuctionClose", 1)
			.equalTo("confirmed", true)
			.descending("block_number")
			.find();
		// Check whether we should get lastest auction close (having bidders) or get lastest auction
		let auction = auctionData;
		if (closeData[0]?.attributes?.nftId == auctionData[0]?.attributes?.nftId) {
			if (closeData[0]?.attributes?.highestBid == "0") {
				const unBurnedCloseData = await makeQueryBuilder("AuctionClose", 1)
					.equalTo("confirmed", true)
					.descending("block_number")
					.notEqualTo("highestBid", "0")
					.find();
				const unBurnedAuctionData = await makeQueryBuilder("AuctionOpened", 1)
					.equalTo("confirmed", true)
					.descending("block_number")
					.equalTo("nftId", unBurnedCloseData[0]?.attributes?.nftId)
					.find();

				// Check whether have current auction or lastest close auction
				if (Object.keys(unBurnedAuctionData).length == 0) {
					setNotHaveAuction(true);
				} else {
					setNotHaveAuction(false);
				}

				auction = unBurnedAuctionData;
			}
		}
		// console.log(auction);
		setAuctionData(auction);
		// Check is End
		if (auction?.length && auction?.length == 0) {
			setIsEnd(true);
		}
		let expiredTime;
		if (auction) {
			setTokenId(auction[0]?.attributes?.nftId);
			expiredTime = parseInt(`${auction[0]?.attributes.closingTime}000`);
		}
		setExpiredTime(expiredTime);
		let bidData = [];
		if (auction) {
			bidData = await makeQueryBuilder("AuctionPlaceBid")
				.ascending("bidPrice")
				.descending("createdAt")
				.equalTo("nftId", auction[0]?.attributes.nftId)
				.find();
		}
		console.log("Bid data", bidData);
		setHistoryBidData(bidData);
		return {
			auction: auction,
			bidData: bidData,
		};
	};
	const placeBidHandler = async (e, targetDom, setE) => {
		console.log("Place bid", e);
		let currentBid = 0;
		if (Object.keys(historyBidData).length > 0) {
			currentBid = parseInt(
				ethers.utils.formatEther(historyBidData[0]?.attributes?.bidPrice)
			);
		}
		if (e <= currentBid) {
			message.error("Your bid has to be greater than current bid!");
			return;
		}
		if (!walletConnect) {
			message.error("Please connect wallet!");
			return;
		}

		try {
			if (e == "") {
				message.error("Please input integer number!");
				return;
			}
			if (!e) {
				message.error("Please input integer number!");
				return;
			}
			if (e && e?.length == 0) {
				message.error("Please input integer number!");
				return;
			}
			if (!Number.isInteger(parseFloat(e))) {
				message.error("Please input integer number!");
				return;
			} else if (e < 0) {
				message.error("Bid Amount is greater than 0!");
				return;
			} else if (e?.length <= 0) {
				message.error("Invalid Bid Amount!");
				return;
			}
			const wdaContract = new ethers.Contract(
				wdaAddress,
				wdaAbi,
				walletConnect
			);
			setIsLoading(true);
			message.warning("Please waiting for auction execution...");
			const wdaTx = await wdaContract.approve(
				auctionAddress,
				ethers.utils.parseEther(e.toString())
			);
			await wdaTx.wait();
			auctionContract = new ethers.Contract(
				auctionAddress,
				auctionAbi,
				walletConnect
			);
			let withBnb = parseInt((await auctionContract.priceBnb()).toString());
			const tx = await auctionContract.placeBid(
				ethers.utils.parseEther(e.toString()),
				{
					value:
						Object.keys(auctionData).length > 0
							? auctionData[0]?.attributes?.withBnb
							: withBnb,
				}
			);
			await tx.wait();
			setIsLoading(false);
			message.success("Place bid successfully!");
			if (targetDom?.current) {
				targetDom.current.value = "";
				setE();
			}
		} catch (err) {
			setIsLoading(false);
			if (targetDom?.current) {
				targetDom.current.value = "";
				setE();
			}
			if (err.code == 4001) {
				message.error("Transaction cancelled!");
			} else {
				message.error(
					err?.data?.message || "Error in place bid, please try again!"
				);
			}
		}
	};

	return (
		<>
			<div className="crown-container" id="current-bid" data-aos="fade-up">
				<h2 className="crown-header">{"CROWN Auction"}</h2>
				{!isEnd ? (
					<BeforeEnd
						{...{
							auctionData: formatDataMoralis(auctionData),
							expiredTime,
							success,
							tokenId,
							dataLoading,
							metaData: metaData,
							metaLoading: metaLoading,
							placeBidHandler,
							walletConnect,
							notHaveAuction,
							placeBidLoading: isLoading,
							bidData: formatDataMoralis(historyBidData),
							closeAuctionData,
						}}
					/>
				) : (
					<AfterEnd />
				)}
			</div>
		</>
	);
};

export default MainBid;
