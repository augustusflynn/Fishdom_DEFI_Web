import { Button, message, Space } from "antd";
import React from "react";

function MarketItem({
	infoItem,
	title,
	onClick,
	isLoading,
	currentTabKey
}) {

	if (infoItem) {
		return (
			<Space size={16} direction="vertical" className="market-item">
				<div>
					<img
						src={`${process.env.REACT_APP_API_URL}/api/games/idle/${infoItem?.tokenId || infoItem?.nftId || 0}.json`}
						alt="crown" className="market-img" />
				</div>
				<Space direction="vertical" size={8}>
					<div>
						<label className="module-title">{infoItem.name}</label>
					</div>
					<div>
						ID:{" "}{infoItem?.tokenId || infoItem?.nftId || 0}
					</div>
					{(currentTabKey === "#marketItem" || !currentTabKey) ? (
						<>
							<div style={{ overflow: 'hidden' }}>
								<a href={`${process.env.REACT_APP_EXPLORE_SCAN_URL}/tx/${infoItem.txHash}`} target="_blank">
									Tx Hash:{" "}{infoItem.txHash}
								</a>
							</div>
							<div className="price">
								Price: {" "}
								{infoItem?.price}{" "}FdT
							</div>
						</>
					) : (
						<></>
					)}
				</Space>
				<Button
					className="button c2i-no-margin"
					disabled={isLoading}
					onClick={() => {
						onClick(infoItem);
					}}
				>
					{title}
				</Button>
			</Space>
		);
	} else return <></>;
}

export default MarketItem;
