import { QuestionCircleOutlined } from "@ant-design/icons";
import { Col, Space } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import fakeImg from "src/assets/images/fake-img-profile.svg";
import { InputWaiting } from "src/component/skeleton/Skeleton";
import { crownNFTAbi, crownNFTAdress } from "src/constants/constants";
import { apiService } from "src/utils/api";
import BaseHelper from "src/utils/BaseHelper";

const PreviousBidItem = (props) => {
	const [metaData, setMetaData] = useState();
	const [loading, setLoading] = useState(false);
	const { item, walletConnect, createdAt, fetchHistoryBid } = props;

	useEffect(async () => {
		setLoading(true);

		let provider = new ethers.getDefaultProvider("kovan");
		let crownContract = new ethers.Contract(
			crownNFTAdress,
			crownNFTAbi,
			provider
		);
		if (walletConnect) {
			crownContract = new ethers.Contract(
				crownNFTAdress,
				crownNFTAbi,
				walletConnect
			);
		}
		let uri;
		if (item?.nftId) {
			uri = await crownContract.tokenURI(item?.nftId);
			await apiService("get", uri).then((res) => {
				if (res?.status == 200) {
					// console.log(res.data);
					setMetaData(res?.data);
				}
			});
		}

		setLoading(false);
	}, [walletConnect, item]);
	return (
		<Col
			xl={8}
			md={12}
			xs={24}
			// className="crown-flex crown-aligns-center crown-flex-column"
			data-aos="fade-up"
		>
			<div className="crown-flex crown-flex-column crown-aligns-center">
				{!metaData ? (
					<InputWaiting className="img-previous-bid" height={438} />
				) : (
					<img
						src={metaData?.image}
						onClick={() => fetchHistoryBid(item?.nftId, metaData)}
						alt="img-previous-bid"
						className="img-previous-bid crown-pointer"
					/>
				)}
				<div className="main-small-content">
					{!metaData ? (
						<InputWaiting />
					) : (
						<>
							<h3 className="crown-header-24">{`${metaData?.name}`}</h3>
						</>
					)}
					{loading ? (
						<InputWaiting />
					) : (
						<h3 className="text-price">{`${BaseHelper.numberWithRealDots(
							parseInt(ethers.utils.formatEther(item?.highestBid?.toString()))
						)} WDA`}</h3>
					)}

					{loading ? (
						<InputWaiting />
					) : (
						<p className="crown-text-16">{`Winning Bid`}</p>
					)}
					{loading ? (
						<InputWaiting />
					) : (
						<p className="text-price">{`${
							item?.withBnb
								? BaseHelper.numberToCurrencyStyle(
										ethers.utils.formatEther(item?.withBnb)
								  )
								: item?.withBnb
						} BNB`}</p>
					)}
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
					{loading ? (
						<InputWaiting />
					) : (
						<Space
							direction="horizontal"
							size={8}
							style={{ display: "flex", marginTop: "24px" }}
						>
							<img src={fakeImg} alt="profile-img" className="profile-img" />
							<h4 className="crown-header-24">
								{BaseHelper.shortTextAdress(`${item?.highestBidder}`)}
							</h4>
						</Space>
					)}
					<p className="module-blur c2i-no-margin">{`Winner`}</p>
					{loading ? (
						<InputWaiting />
					) : (
						<Space
							direction="horizontal"
							size={8}
							style={{ display: "flex", marginTop: "16px" }}
						>
							<div className="c2i-small-square"></div>
							<p className="crown-text-16">
								{`Born on `}
								<span className="crown-text-16-white">{`${BaseHelper.optionsDateJs(
									new Date(`${createdAt}`),
									{ month: "long", day: "numeric", year: "numeric" },
									"UTC"
								)}`}</span>
							</p>
						</Space>
					)}
				</div>
			</div>
		</Col>
	);
};

export default PreviousBidItem;
