import { Button, message, Space } from "antd";
import React from "react";

function MarketItem({
	infoItem,
	title,
	onClick,
	isLoading,
	currentTabKey,
	blocknumber,
}) {
	if (infoItem) {
		return (
			<Space size={16} direction="vertical" className="market-item">
				<div>
					<img
						src={`${process.env.REACT_APP_API_URL}/api/games/idle/${infoItem.tokenId}.json`}
						alt="crown" className="market-img" />
				</div>
				<Space direction="vertical" size={8}>
					{(currentTabKey === "#marketItem" || !currentTabKey) ? (
						<>
							<div>
								<label className="module-title">{infoItem.name}</label>
							</div>
							<div>
								ID:{" "}{infoItem.tokenId}
							</div>
							<div style={{ overflow: 'hidden' }}>
								<a href={`https://testnet.bscscan.com/tx/${infoItem.txHash}`} target="_blank">
									Tx Hash:{" "}{infoItem.txHash}
								</a>
							</div>
							<div className="price">
								Price: {" "}
								{infoItem.price}{" "}FdT
							</div>
						</>
					) : (
						<></>
					)}
				</Space>
				<Button
					className="button c2i-no-margin"
					disabled={
						isLoading ||
						infoItem.staked ||
						parseInt(infoItem?.lockDeadline || 0) - parseInt(blocknumber || 0) >
						0
					}
					onClick={() => {
						if (infoItem.staked) {
							message.error("Item was staked!");
						} else {
							onClick(infoItem);
						}
					}}
				>
					{infoItem.staked
						? "Staked"
						: parseInt(infoItem?.lockDeadline || 0) -
							parseInt(blocknumber || 0) >
							0
							? `Locked ${parseInt(infoItem?.lockDeadline || 0) -
							parseInt(blocknumber || 0)
							} blocks`
							: title}
				</Button>
			</Space>
		);
	} else return <></>;
}

export default MarketItem;
