import { Button, Col, message, Space } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { InputWaiting } from "src/component/skeleton/Skeleton";
import { miningAbi, miningAddress } from "src/constants/abiMining.json";
import { crownNFTAbi, crownNFTAdress } from "src/constants/constants";
import { durationData } from "src/constants/mining";
import CountdownClock from "src/layout/grid/CountdownV2";
import { crownClaim } from "src/redux/actions";
import { apiService } from "src/utils/api";
import BaseHelper from "src/utils/BaseHelper";

const CrownItem = ({
	crownId,
	walletConnect,
	crowns,
	setCrownsLength,
	setCrowns,
	miningId,
	crownsLength,
	item,
	idx,
}) => {
	const [crownData, setCrownData] = useState();
	const [contributeCrown, setContributeCrown] = useState();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [txLoading, setTxLoading] = useState(false);
	const [expiredTime, setExpiredTime] = useState(
		moment(item?.createdAt)
			.add(item?.duration || 0, "hour")
			.toDate()
			.getTime()
	);
	const [disableClaim, setDisableClaim] = useState(
		moment().toDate().getTime() < expiredTime
	);
	const dispatch = useDispatch();
	useEffect(() => {
		setDisableClaim(moment().toDate().getTime() < expiredTime);
	}, [expiredTime]);
	useEffect(() => {
		if (item) {
			setExpiredTime(
				moment(item?.createdAt)
					.add(item?.duration || 0, "hour")
					.toDate()
					.getTime()
			);
		}
		console.log(item);
		console.log(
			item?.contributeNFTId,
			expiredTime,
			moment().toDate().getTime()
		);
	}, [item]);
	useEffect(() => {
		let run = true;
		run &&
			(async () => {
				if (walletConnect) {
					setLoading(true);
					const contract = new ethers.Contract(
						crownNFTAdress,
						crownNFTAbi,
						walletConnect
					);
					if (item?.contributeNFTId != 0) {
						const uriX = await contract.tokenURI(item?.contributeNFTId);
						await apiService("get", uriX).then((res) => {
							if (res?.status == 200) {
								console.log(res.data);
								setContributeCrown(res?.data || []);
							} else {
							}
						});
					}
					const uri = await contract.tokenURI(crownId);

					await apiService("get", uri).then((res) => {
						if (res?.status == 200) {
							setCrownData(res.data);
							setLoading(false);
							setError(false);
						} else {
							setError(true);
							setLoading(true);
						}
					});
				}
			})();
		return () => {
			run = false;
		};
	}, [walletConnect, crownId]);

	const buttonHandler = async () => {
		if (!walletConnect) {
			message.error("Please connect wallet!");
			return;
		}
		if (walletConnect) {
			try {
				const crownContract = new ethers.Contract(
					crownNFTAdress,
					crownNFTAbi,
					walletConnect
				);
				const contract = new ethers.Contract(
					miningAddress,
					miningAbi,
					walletConnect
				);
				setTxLoading(true);
				if (item?.contributeNFTId != 0) {
					const tx = await crownContract.approve(
						miningAddress,
						item?.contributeNFTId
					);
					await tx.wait();
				}
				console.log("Iam minig id: ", miningId);
				const tx = await contract.claim(miningId);
				await tx.wait();

				setTxLoading(false);
				setCrownsLength(crownsLength - 1);
				message.success(
					"Successfully! Please wait 2-3 minutes for actually claimation!!"
				);
				setCrowns((crowns) =>
					Object.keys(crowns).length > 0
						? crowns.filter((item) => item?.receiveNFTId?.toString() != crownId)
						: crowns
				);
				dispatch(crownClaim.crownClaimed([miningId]));
			} catch (err) {
				console.log("Hi bo m la loi");
				console.log(err);
				message.error(err?.data?.message || "Claim Error!");
				setTxLoading(false);
			}
		}
	};
	return !error ? (
		<Col
			xs={24}
			md={crowns.length == 1 ? 24 : 12}
			lg={crowns.length == 2 ? 12 : crowns.length == 1 ? 24 : 8}
		>
			<Space direction="vertical" size={16} className="frame w-100 wrap">
				{loading ? (
					<InputWaiting className="skeleton-img img" />
				) : (
					<img
						className="img"
						src={crownData?.image}
						alt="crown-img"
						style={{ maxWidth: "319px" }}
					/>
				)}

				<Space direction="vertical" size={4}>
					{loading ? (
						<InputWaiting />
					) : (
						<h2 className="module-title c2i-no-margin">{`${crownData?.description}`}</h2>
					)}

					<Space direction="horizontal" size={12}>
						{loading ? (
							<InputWaiting />
						) : (
							<>
								<div
									className="attribute module-blur c2i-no-margin"
									style={{ color: "#72DE99", borderColor: "#72DE99" }}
								>
									{`${
										crownData?.attributes &&
										Object.keys(crownData?.attributes).length > 0
											? crownData?.attributes.find(
													(item) => item["trais_type"] == "AprBonus"
											  )?.value || 0
											: 0
									}`}
									% APR
								</div>
								<div
									className="attribute module-blur c2i-no-margin"
									style={{ color: "#fff", borderColor: "#fff" }}
								>
									{`${
										crownData?.attributes &&
										Object.keys(crownData?.attributes).length > 0
											? crownData?.attributes.find(
													(item) => item["trais_type"] == "Reduce"
											  )?.value || 0
											: 0
									}`}
									% Reduce
								</div>
							</>
						)}
					</Space>
				</Space>
				<Space direction="vertical" size={8}>
					<div className="flex items-center">
						{loading ? (
							<InputWaiting />
						) : (
							<>
								<div className="dot-green"></div>
								<p className="module-blur c2i-no-margin">
									Was mined on{" "}
									<span className="c2i-color-title">
										{`${BaseHelper.optionsDateJs(
											new Date(item?.createdAt),
											{ month: "long", day: "numeric", year: "numeric" },
											"UTC"
										)}`}{" "}
									</span>
								</p>
							</>
						)}
					</div>
					<div className="flex items-center">
						{loading ? (
							<InputWaiting />
						) : (
							<>
								<div className="dot-green"></div>
								<p className="module-blur c2i-no-margin flex wrap">
									<span className="mr-8">Available on</span>
									{expiredTime - moment().toDate().getTime() <= 86400000 ? (
										<span>
											<CountdownClock
												expiredTime={expiredTime}
												id={`timer ${item?.block_number || 0}`}
												endText="Now"
												className="c2i-color-title"
												hookFunction={setDisableClaim}
												hookFunctionValue={false}
											/>
										</span>
									) : (
										<span className="c2i-color-title">
											{`${moment(expiredTime).format("LLL")}`}
										</span>
									)}
								</p>
							</>
						)}
					</div>
					<div className="flex items-center">
						{loading ? (
							<InputWaiting />
						) : (
							<>
								<div className="dot-green"></div>
								<p className="module-blur c2i-no-margin flex wrap">
									<span className="mr-8">Final earning: </span>
									<span className="c2i-color-title">{`${
										item?.amount
											? BaseHelper.numberToCurrencyStyle(
													ethers.utils.formatEther(item?.amount)
											  )
											: 0
									} WDA`}</span>
								</p>
							</>
						)}
					</div>
					<div className="flex items-center">
						{loading ? (
							<InputWaiting />
						) : (
							<>
								<div className="dot-green"></div>
								<p className="module-blur c2i-no-margin flex wrap">
									<span className="mr-8">Contribute NFT Reduce: </span>
									<span className="c2i-color-title">{`${
										contributeCrown?.attributes &&
										Object.keys(crownData?.attributes).length > 0
											? contributeCrown?.attributes.find(
													(item) => item["trais_type"] == "Reduce"
											  )?.value || 0
											: 0
									}%`}</span>
								</p>
							</>
						)}
					</div>
					<div className="flex items-center">
						{loading ? (
							<InputWaiting />
						) : (
							<>
								<div className="dot-green"></div>
								<p className="module-blur c2i-no-margin flex wrap">
									<span className="mr-8">Contribute NFT: </span>
									<span className="c2i-color-title">{`${
										contributeCrown ? contributeCrown.name : "No Crown"
									}`}</span>
								</p>
							</>
						)}
					</div>
				</Space>
				<div className="line"></div>
				<Button
					className="confirm-btn c2i-no-margin"
					onClick={buttonHandler}
					loading={txLoading}
					disabled={disableClaim}
				>
					Claim Now
				</Button>
			</Space>
		</Col>
	) : (
		<></>
	);
};

export default CrownItem;
