import React, { useEffect, useState } from "react";
import { Col, Image, Row, Tag, Space } from "antd";
import { ICON_HISTORY_STAKE as icon } from "src/assets/images";
import { ethers } from "ethers";
import BaseHelper from "src/utils/BaseHelper";
import axios from "axios";
import { crownNFTAbi, crownNFTAdress } from "src/constants/constants";
import Identicon from "identicon.js";
import useViewportWidth from "src/hooks/useViewportWidth";

function Item({ item, CrownContract }) {
	const history = item.attributes;
	const [reduce, setReduce] = useState(0);
	const width = useViewportWidth();
	useEffect(async () => {
		try {
			if (!CrownContract) {
				const provider = new ethers.providers.JsonRpcProvider(
					"https://kovan.infura.io/v3/"
				);
				CrownContract = new ethers.Contract(
					crownNFTAdress,
					crownNFTAbi,
					provider
				);
			}
			if (history.receiveNFTId == 0) return;
			const tokenURI = await CrownContract.tokenURI(history.contributeNFTId);
			const metadata = await axios.get(tokenURI).then((res) => {
				if (res.status === 200) {
					return res.data;
				}
			});

			setReduce(
				metadata?.attributes && Object.keys(metadata?.attributes).length > 0
					? metadata?.attributes.find((item) => item["trais_type"] == "Reduce")
							.value
					: 0
			);
		} catch (error) {
			console.log(error);
		}
	}, [CrownContract, item]);
	return (
		<Col xs={24} md={12}>
			<div className="item">
				<Space
					direction={width > 576 ? "horizontal" : "vertical"}
					className="c2i-justify-between"
					size={8}
				>
					<div className="module-title">
						{BaseHelper.numberWithDots(
							ethers.utils.formatEther(history?.amount)
						)}{" "}
						WDA
					</div>
					<Tag className="ant-Active  text-title-default">{reduce}% Reduce</Tag>
				</Space>
				<div className="module-line"></div>
				<Row justify="space-between">
					<div className="text-title-default">
						<Image
							src={`data:image/png;base64,${
								history?.owner
									? new Identicon(history?.owner, 30).toString()
									: ""
							}`}
							preview={false}
							width={24}
							height={24}
							className="icon-avatar"
						></Image>
						{BaseHelper.shortTextAdress(history?.owner)}
					</div>
					<div className="text-title-default point">
						{BaseHelper.dateFormatVesting(history?.createdAt)}
					</div>
				</Row>
			</div>
		</Col>
	);
}

export default Item;
