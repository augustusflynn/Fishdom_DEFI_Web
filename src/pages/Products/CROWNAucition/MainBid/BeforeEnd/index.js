import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, message, Space } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import CrownBurger from "src/assets/images/dao/crown-burger.svg";
import ConnectWallet from "src/component/button/ConnectWallet";
import { InputWaiting } from "src/component/skeleton/Skeleton";
import CountdownClock from "src/layout/grid/CountdownClock";
import BaseHelper from "src/utils/BaseHelper";
import DaoModal from "../../DaoModal";

const BeforeEnd = (props) => {
	const [isShowModal, setShowModal] = useState(false);
	const [endTime, setEndTime] = useState();
	const [bidPlaceValue, setBidPlaceValue] = useState(0);
	const inputRef = useRef(null);
	const {
		success,
		auctionData,
		expiredTime,
		metaData,
		placeBidHandler,
		notHaveAuction,
		placeBidLoading,
		walletConnect,
		dataLoading,
		metaLoading,
		bidData,
		closeAuctionData,
	} = props;

	const showModal = () => {
		setShowModal(true);
	};
	useEffect(() => {
		setEndTime(
			BaseHelper.optionsDateJs(
				expiredTime,
				{ month: "long", day: "numeric", year: "numeric" },
				"UTC"
			)
		);
	}, [expiredTime]);
	console.log(metaData);

	return (
		<>
			<DaoModal
				isShowModal={isShowModal}
				setShowModal={setShowModal}
				bidData={bidData}
				metaData={metaData}
			/>

			{notHaveAuction ? (
				<>
					<h2
						className="crown-header"
						style={{ whiteSpace: "normal", textAlign: "center" }}
					>
						{"No Auction has been opened!"}
					</h2>
					<div
						style={{
							textAlign: "center",
							marginTop: "32px",
						}}
					>
						<p className="module-blur">
							Let’s check out the winners from all{" "}
							<span className="break-line">
								the previous Bid Auction below.
							</span>
						</p>
					</div>
				</>
			) : (
				<div className="subcontainer">
					{metaLoading ? (
						<InputWaiting
							className="img-main-bid"
							animate={true}
							height={472}
						/>
					) : (
						<img
							src={`${metaData?.image}`}
							alt="img-main-bid"
							className="img-main-bid"
						/>
					)}
					<div className="main-content">
						{dataLoading ? (
							<InputWaiting />
						) : endTime ? (
							<p className="crown-text-16">
								{`Ends on`}{" "}
								<span className="crown-text-16-white">{`${BaseHelper.removeCommaString(
									endTime
								)}`}</span>
							</p>
						) : (
							<></>
						)}
						{metaLoading ? (
							<InputWaiting className="crown-main-content-text-header" />
						) : (
							<h3 className="crown-main-content-text-header">{`${metaData?.name}`}</h3>
						)}
						<div style={{ display: "flex" }}>
							{metaLoading ? (
								<InputWaiting />
							) : (
								<p className="frame-percentage picked">{`${
									metaData?.attributes
										? metaData?.attributes.find(
												(item) => item["trais_type"] == "AprBonus"
										  ).value
										: 0
								}% APR`}</p>
							)}
							{metaLoading ? (
								<InputWaiting />
							) : (
								<p className="frame-percentage">{`${
									metaData?.attributes
										? metaData?.attributes.find(
												(item) => item["trais_type"] == "Reduce"
										  ).value
										: 0
								}% Reduce`}</p>
							)}
						</div>
						{dataLoading ? (
							<InputWaiting className="price-container" />
						) : (
							<div className="price-container">
								<div>
									<p className="text-price">{`${
										Object.keys(bidData).length > 0
											? BaseHelper.numberWithRealDots(
													parseInt(
														ethers.utils.formatEther(
															bidData[0]?.bidPrice?.toString()
														)
													)
											  )
											: BaseHelper.numberWithRealDots(
													parseInt(auctionData[0]?.startingBid?.toString())
											  )
									} WDA`}</p>
									<p className="crown-text-16">{`Current Bid`}</p>
								</div>
								<div
									style={{
										maxWidth: "80px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: "100%",
									}}
								>
									<div className="crown-space-line"></div>
								</div>
								<div>
									<p className="text-price">{`${
										auctionData[0]?.withBnb
											? BaseHelper.numberToCurrencyStyle(
													ethers.utils.formatEther(auctionData[0]?.withBnb)
											  )
											: auctionData[0]?.withBnb
									} BNB`}</p>
									<p className="crown-text-16">
										<span className="crown-underline">{`Fix Bid`}</span>
										<span>
											{" "}
											<QuestionCircleOutlined
												style={{
													width: "18px",
													height: "18px",
													color: "#999999",
												}}
											/>
										</span>
									</p>
								</div>
							</div>
						)}
						{dataLoading ? (
							<InputWaiting />
						) : (
							<>
								<CountdownClock
									expiredTime={expiredTime}
									className="crown-header-24"
									messageWarning="Auction is expired"
								></CountdownClock>
								<p className="crown-text-16">{`Days remaining`}</p>
							</>
						)}

						{!success ? (
							<div style={{ display: "flex", alignItems: "center" }}>
								<input
									type="number"
									className="crown-input-wda"
									placeholder="WDA amount.."
									ref={inputRef}
									onChange={(e) => {
										setBidPlaceValue(e.target.value);
									}}
								/>
								<>
									{walletConnect ? (
										<Button
											className="crown-btn-place-bid"
											onClick={(e) => {
												const now = moment().utc().toDate().getTime();
												const distance = expiredTime - now;
												if (distance < 0) {
													message.error("Auction is expired!");
													return;
												}
												if (distance <= 30000) {
													message.warning(
														"You should bid when time is greater than 30 seconds, you may lose money!"
													);
												}
												placeBidHandler(
													bidPlaceValue,
													inputRef,
													setBidPlaceValue
												);
											}}
											loading={placeBidLoading}
										>
											{`Place a bid`}
										</Button>
									) : (
										<div className="crown-btn-place-bid-frame">
											<ConnectWallet />
										</div>
									)}
								</>
							</div>
						) : (
							<Space direction="vertical" size={8} style={{ margin: "24px 0" }}>
								<Space direction="horizontal" size={8}>
									<div className="small-square"></div>
									<p className="crown-text-16">
										{`Born on`}{" "}
										<span className="crown-text-16-white">{`${
											Object.keys(auctionData).length > 0
												? BaseHelper.optionsDateJs(
														new Date(`${auctionData[0]?.createdAt}000`),
														{ month: "long", day: "numeric", year: "numeric" },
														"UTC"
												  )
												: BaseHelper.optionsDateJs(
														new Date(),
														{ month: "long", day: "numeric", year: "numeric" },
														"UTC"
												  )
										}`}</span>
									</p>
								</Space>
								<Space direction="horizontal" size={8}>
									<div className="small-square"></div>
									<p className="crown-text-16">
										{`Held by`}{" "}
										<span className="crown-text-16-white">{`${BaseHelper.shortTextAdress(
											`${closeAuctionData?.attributes?.highestBidder}`
										)}`}</span>
									</p>
								</Space>
							</Space>
						)}
						<div className="crown-cross-line"></div>
						<div className="crown-address-container">
							{Object.keys(bidData).length > 0 ? (
								bidData.slice(0, 3).map((item, idx) => (
									<div
										key={idx}
										style={{
											display: "flex",
											marginTop: "16px",
											justifyContent: "space-between",
										}}
									>
										<div style={{ display: "flex" }}>
											<div className="profile-img-small"></div>
											<p className="crown-text-16-white">
												{BaseHelper.shortTextAdress(`${item.bidder}`)}
											</p>
										</div>
										<div className="crown-flex">
											<img src={CrownBurger} alt="" />
											<p className="crown-text-16-white">{`${BaseHelper.numberWithDots(
												parseInt(
													ethers.utils.formatEther(item?.bidPrice?.toString())
												)
											)}`}</p>
										</div>
									</div>
								))
							) : (
								<></>
							)}
						</div>
						<div
							className="crown-flex"
							style={{ display: "flex", justifyContent: "flex-end" }}
						>
							<p
								className="crown-text-16"
								onClick={() => showModal()}
								style={{ cursor: "pointer" }}
							>
								<span className="crown-underline">{`View Bid History`}</span>
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default BeforeEnd;
