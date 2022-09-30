import { Button, message, Space } from "antd";
import { ethers } from "ethers";
import React from "react";
import { useSelector } from "react-redux";
import { user$, wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import FishdomMarketAbi from '../../../../constants/contracts/FishdomMarket.sol/FishdomMarket.json'
import FishdomTokenAbi from '../../../../constants/contracts/token/FishdomToken.sol/FishdomToken.json'
import axios from "axios";

function Item(props) {
	const { infoItem } = props;
	const walletConnect = useSelector(wallet$)
	const userData = useSelector(user$)

	async function buyHandler() {
		try {
			const FishdomMarket = new ethers.Contract(
				FishdomMarketAbi.networks['97'].address,
				FishdomMarketAbi.abi,
				walletConnect
			);

			const FishdomToken = new ethers.Contract(
				FishdomTokenAbi.networks['97'].address,
				FishdomTokenAbi.abi,
				walletConnect
			);

			const approveTx = await FishdomToken.approve(
				FishdomMarketAbi.networks['97'].address,
				ethers.utils.parseEther(infoItem.price)
			);
			message.loading('Waiting approve FdT', 1)
			await approveTx.wait(1);

			const buyTx = await FishdomMarket.buyMarketItem(
				infoItem.itemId
			);
			message.loading("Please wait for transaction finised...", 1);
			await buyTx.wait();
			await axios.post(
				process.env.REACT_APP_API_URL + '/api/markets/buy',
				{
					txHash: buyTx.hash
				},
				{
					headers: {
						Authorization: `Bearer ${userData.token}`
					}
				}
			)
		} catch (error) {
			if (error.code == 4001) {
				message.error("Transaction cancelled!");
			} else {
				message.error("Transaction error!");
			}
			console.log('buy error', error);
		}
	}

	if (infoItem)
		return (
			<Space direction="vertical" size={16} className="market-item">
				<div className="c2i-pointer">
					<img
						src={`${process.env.REACT_APP_API_URL}/api/games/idle/${infoItem.tokenId}.json`}
						alt="Fishdom Fish"
						className="market-img"
					/>
				</div>
				<Space direction="vertical" size={12}>
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

					<Button
						onClick={buyHandler}
						className="w-100"
						disabled={infoItem.seller.toLowerCase() === walletConnect._address.toLowerCase()}
					>Buy</Button>
				</Space>
			</Space>
		);
	else return null;
}

export default Item;
