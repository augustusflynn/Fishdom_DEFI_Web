import React from "react";
import { Col, Image, Row, Tag } from "antd";
import BaseHelper from "src/utils/BaseHelper";
import { ethers } from "ethers";
import Identicon from "identicon.js";

function Item({ item }) {

	return (
		<Col xs={24} md={12}>
			<div className="item">
				<Row justify="space-between" align="middle">
					<div className="module-title">
						{BaseHelper.numberWithDots(
							parseFloat(ethers.utils.formatEther(item?.amount))
								.toFixed(8)
								.toString()
						)}{" "}
						FDT
					</div>
					<Tag className="ant-Active  text-title-default">
						{item?.apr || 0}% APR
					</Tag>
				</Row>
				<div className="module-line"></div>
				<Row justify="space-between">
					<div className="text-title-default">
						<Image
							src={`data:image/png;base64,${item?.walletAddress
								? new Identicon(item?.walletAddress, 30).toString()
								: ""
								}`}
							preview={false}
							width={24}
							height={24}
							className="icon-avatar"
						></Image>
						{BaseHelper.shortTextAdress(item?.walletAddress)}
					</div>
					<div className="text-title-default point">
						{BaseHelper.dateFormatVesting(item?.createdAt)}
					</div>
				</Row>
			</div>
		</Col>
	);
}

export default Item;
