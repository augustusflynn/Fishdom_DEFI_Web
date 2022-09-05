import { Pagination, Row, Spin } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
// import { useMoralisSubscription } from "react-moralis";
import { useSelector } from "react-redux";
import AuctionHelper from "src/constants/auction";
import { wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import { makeQueryBuilder } from "src/utils/MoralisQuery";
import DaoModal from "../DaoModal";
import PreviousBidItem from "./PreviousBidItem";
const formatDataMoralis = (data) => {
	return Object.keys(data).length > 0
		? data.map((item) => item?.attributes)
		: [];
};

const PreviousBid = (props) => {
	const { setIsHidePrev, isHidePrev } = props;
	const [isShowModal, setShowModal] = useState(false);
	const walletConnect = useSelector(wallet$);
	const [previousLength, setPreviousLength] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [bidData, setBidData] = useState([]);
	const [previousBidData, setPreviousBidData] = useState([]);
	const [metaData, setMetaData] = useState();
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	let run = true;
	// 	run &&
	// 		(async () => {
	// 			setLoading(true);
	// 			const prevBid = await makeQueryBuilder(
	// 				"AuctionClose",
	// 				AuctionHelper.auctionLimit,
	// 				AuctionHelper.auctionLimit * (currentPage - 1)
	// 			)
	// 				.equalTo("confirmed", true)
	// 				.notEqualTo("highestBid", "0")
	// 				.find();
	// 			if (Object.keys(prevBid).length == 0 && currentPage == 1) {
	// 				setIsHidePrev(true);
	// 			} else {
	// 				setIsHidePrev(false);
	// 			}
	// 			console.log(prevBid);
	// 			setPreviousBidData(formatDataMoralis(prevBid));
	// 			const prevCount = await makeQueryBuilder("AuctionClose")
	// 				.equalTo("confirmed", true)
	// 				.notEqualTo("highestBid", "0")
	// 				.count();
	// 			console.log(prevCount);
	// 			setPreviousLength(prevCount);
	// 			setLoading(false);
	// 		})();
	// 	return () => {
	// 		run = false;
	// 	};
	// }, [walletConnect, currentPage]);

	// useMoralisSubscription(
	// 	"AuctionClose",
	// 	(query) => query.descending("createdAt").limit(1),
	// 	[],
	// 	{
	// 		live: true,
	// 		onUpdate: async (data) => {
	// 			// Because real-time of moralis have some stupid things it will listen 2 times
	// 			if (
	// 				Object.keys(previousBidData).length > 0 &&
	// 				!previousBidData.find(
	// 					(item) => item?.nftId == data?.attributes?.nftId
	// 				) &&
	// 				data?.attributes?.highestBid != 0
	// 			) {
	// 				let dataAfterPop = [...previousBidData];
	// 				if (AuctionHelper.auctionLimit == previousBidData.length) {
	// 					dataAfterPop.pop();
	// 				}
	// 				setPreviousBidData([data?.attributes, ...dataAfterPop]);
	// 				setPreviousLength(previousLength + 1);
	// 			}
	// 			if (Object.keys(previousBidData).length == 0) {
	// 				setPreviousBidData([data?.attributes]);
	// 				setPreviousLength(previousLength + 1);
	// 			}
	// 		},
	// 		onCreate: async (data) => {
	// 			// Because real-time of moralis have some stupid things it will listen 2 times
	// 			if (
	// 				Object.keys(previousBidData).length > 0 &&
	// 				!previousBidData.find(
	// 					(item) => item?.nftId == data?.attributes?.nftId
	// 				) &&
	// 				data?.attributes?.highestBid != 0
	// 			) {
	// 				let dataAfterPop = [...previousBidData];
	// 				if (AuctionHelper.auctionLimit == previousBidData.length) {
	// 					dataAfterPop.pop();
	// 				}
	// 				setPreviousBidData([data?.attributes, ...dataAfterPop]);
	// 				setPreviousLength(previousLength + 1);
	// 			}
	// 			if (Object.keys(previousBidData).length == 0) {
	// 				setPreviousBidData([data?.attributes]);
	// 				setPreviousLength(previousLength + 1);
	// 			}
	// 		},
	// 	}
	// );
	useEffect(() => {
		console.log(previousBidData.length);
		console.log("Changed", previousBidData);
	}, [previousBidData]);
	const fetchHistoryBid = async (id, metaData) => {
		setMetaData(metaData);
		setShowModal(true);
		const data = await makeQueryBuilder("AuctionPlaceBid")
			.equalTo("confirmed", true)
			.equalTo("nftId", id)
			.find();
		setBidData(BaseHelper.formatDataMoralis(data));
	};

	const showModal = () => {
		setShowModal(true);
	};
	return isHidePrev ? (
		<></>
	) : (
		<>
			<DaoModal
				isShowModal={isShowModal}
				setShowModal={setShowModal}
				bidData={bidData}
				metaData={metaData}
			/>
			<div className="crown-container" id="previous-bids">
				<h2
					className="crown-header"
					data-aos="fade-up"
					style={{ marginBottom: "56px" }}
				>{`Previous Bid`}</h2>
				{loading ? (
					<Spin />
				) : (
					<Row
						gutter={[24, 48]}
						className="previous-container-grid"
						data-aos="fade-up"
					>
						{Object.keys(previousBidData).length > 0 ? (
							previousBidData.map((item, idx) => {
								return (
									<PreviousBidItem
										key={idx}
										item={item}
										fetchHistoryBid={fetchHistoryBid}
										walletConnect={walletConnect}
										createdAt={item?.createdAt || moment().toDate()}
									/>
								);
							})
						) : (
							<></>
						)}
					</Row>
				)}
				<div
					className="pagination"
					style={{
						marginTop: "64px",
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					{previousLength == 0 ? (
						<></>
					) : (
						<Pagination
							defaultCurrent={1}
							total={previousLength}
							pageSize={parseInt(AuctionHelper.auctionLimit)}
							onChange={(e) => setCurrentPage(parseInt(e))}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default PreviousBid;
