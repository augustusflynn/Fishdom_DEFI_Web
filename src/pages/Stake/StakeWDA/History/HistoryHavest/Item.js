import { Col, Image, Row } from "antd";
import { ethers } from "ethers";
import Identicon from "identicon.js";

import BaseHelper from "src/utils/BaseHelper";
function Item({ item }) {
	const history = item.attributes;
	return (
		<Col xs={24} md={12}>
			<div className="item">
				<Row justify="space-between" align="middle">
					<div className="module-title">
						{/* {parseFloat(ethers.utils.formatEther(history?.amount)).toFixed(2)}{" "} */}
						{BaseHelper.numberWithDots(
							parseFloat(ethers.utils.formatEther(history?.amount))
								.toFixed(8)
								.toString()
						)}{" "}
						WDA
					</div>
					{/* <Tag className="ant-Active  text-title-default">
            {history?.apr}% APR
          </Tag> */}
				</Row>
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
