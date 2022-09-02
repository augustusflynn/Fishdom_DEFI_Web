import React, { useState, useEffect } from "react";
import { Row, Col, Empty, Spin, Pagination, message } from "antd";
import Scepter from "./Scepter";
import {
	crownLuckyAbi,
	crownLuckyAddress,
} from "src/constants/abiCrownLucky.json";
import { ethers } from "ethers";
import { apiService } from "src/utils/api";
import CrownItem from "./CrownItem";
import { crownNFTAbi, crownNFTAdress } from "../../../constants/constants";
import _ from "lodash";

function ClaimCrownLucky({ currentTab, walletConnect, scepter, setScepter }) {
	const LIMIT_DISPLAY = 8;
	const [listCrownLuckyId, setListCrownLuckyId] = useState([]);
	const [listCrownLucky, setListCrownLucky] = useState({
		data: [],
		count: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isClaimLoading, setIsClaimLoading] = useState(false);

	async function fulFillList(data, currentIndex) {
		const CrownContract = new ethers.Contract(
			crownNFTAdress,
			crownNFTAbi,
			walletConnect
		);
		if (!CrownContract) {
			setIsLoading(false);
			return;
		}
		new Promise(async (resolve) => {
			let result = [];
			let i = 0;
			// fetch den khi nao du 8 item / 1 page
			while (result.length < LIMIT_DISPLAY && i < data.length) {
				if (data[currentIndex + i] && data[currentIndex + i].item) {
					let itemAttr = {};
					const uri = await CrownContract.tokenURI(data[currentIndex + i].item);
					const metadata = await apiService("get", uri)
						.then((res) => {
							if (res?.status === 200) {
								return res.data;
							} else {
								return null;
							}
						})
						.catch((err) => {
							console.log("err", err);
						});
					if (metadata) {
						itemAttr.image = metadata.image;
						itemAttr.name = metadata.name;
						itemAttr.index = data[currentIndex + i].index;
						let apr = await metadata.attributes.find(
							(item) => item.trais_type === "AprBonus"
						);
						let reduce = await metadata.attributes.find(
							(item) => item.trais_type === "Reduce"
						);
						itemAttr.apr = apr.value;
						itemAttr.reduce = reduce.value;
						result.push(itemAttr);
					}
				}
				i++;
			}
			resolve(result);
		})
			.then(async (res) => {
				setListCrownLucky((prev) => ({
					...prev,
					data: res,
				}));
				setIsLoading(false);
			})
			.catch(() => {
				setIsLoading(false);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	useEffect(() => {
		async function init() {
			if (!walletConnect) return;
			if (
				currentTab === "#CrownLucky" ||
				window.location.hash === "#CrownLucky"
			) {
				setIsLoading(true);
				const contract = new ethers.Contract(
					crownLuckyAddress,
					crownLuckyAbi,
					walletConnect
				);

				const count = await contract.getOwnerCrownNFT();
				setListCrownLucky({ count: count });
				let data = await contract.getListOwnerCrownNFT();
				let convertedData = [];
				for (let i = 0; i < data.length; i++) {
					let parseItem = data[i].toString();
					if (parseItem !== '0') {
						convertedData.push({
							item: parseItem,
							index: i
						})
					}
				}
				setListCrownLuckyId(convertedData);
				await fulFillList(convertedData, 0);
			}
		}
		init();
	}, [currentTab, walletConnect]);

	async function handleClaimCrown(index) {
		try {
			setIsClaimLoading(true);
			console.log("Go go");
			const contract = new ethers.Contract(
				crownLuckyAddress,
				crownLuckyAbi,
				walletConnect
			);
			const txClaim = await contract.claimCrown(index);
			await txClaim
				.wait()
				.then(() => {
					message.success("Claim CROWN successfully!");
					setIsClaimLoading(false);
					setListCrownLucky((prev) => {
						let newData = prev.data.filter((item) => item.index !== index);
						return {
							...prev,
							data: newData
						}
					});
				})
				.catch((error) => {
					if (error.code == 4001) {
						message.error("Transaction cancelled!");
					} else {
						message.error(
							error?.data?.message || "Error in place bid, please try again!"
						);
					}
					setIsClaimLoading(false);
				});
		} catch (error) {
			if (error.code == 4001) {
				message.error("Transaction cancelled!");
			} else {
				message.error(
					error?.data?.message || "Error in place bid, please try again!"
				);
			}
			setIsClaimLoading(false);
		}
	}

	return (
		<>
			<div className="item-menu-container" id="scepter">
				<Scepter {...{ scepter, setScepter }} />
			</div>
			<div className="claim-crown">
				<div className="title">CROWN</div>
				{isLoading ? (
					<Row gutter={[24, 24]} id="crown" justify="center">
						<Spin />
					</Row>
				) : (
					<Row gutter={[24, 24]} id="crown" justify="center">
						{listCrownLucky?.data?.length > 0 ? (
							listCrownLucky.data.map((item, idx) => {
								if (item && !_.isEmpty(item))
									return (
										<Col xl={6} lg={8} md={12} sm={24} xs={24} key={idx}>
											<CrownItem
												infoItem={item}
												index={idx}
												isLoading={isClaimLoading}
												onClick={(itemIdx) => {
													handleClaimCrown(itemIdx);
												}}
											/>
										</Col>
									);
							})
						) : (
							<>
								<Empty />
							</>
						)}
					</Row>
				)}
				<div className="pagination">
					<Pagination
						defaultCurrent={1}
						pageSize={LIMIT_DISPLAY}
						onChange={(num) => {
							fulFillList(listCrownLuckyId, +num * LIMIT_DISPLAY);
						}}
						total={listCrownLucky.count}
					/>
				</div>
			</div>
		</>
	);
}

export default ClaimCrownLucky;
