import { Button, Divider, message, Modal } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Exception } from "sass";
import {
  busdAbi,
  busdAddress, priavteAddress, privateAbi, seedAbi,
  seedAddress
} from "../../constants/constants";
import { wallet$ } from "../../redux/selectors";
import BaseHelper from "../../utils/BaseHelper";

function ModalBuy(props) {
  const {
    isModalVisible,
    hideModal,
    handelChangeAmount,
    amount,
    cost,
    type,
    min,
    max,
    balanceUser,
    setBalanceUser,
    setBuySuccess,
    setAmount,
  } = props;
  const [loading, setLoading] = useState(false);
  const walletConnect = useSelector(wallet$);
  const [stateBuy, setStateBuy] = useState("Approval");
  const [isDisable, setIsDisable] = useState(false)
  let address = seedAddress;
  let abi = seedAbi;

  if (type === "private-round") {
    address = priavteAddress;
    abi = privateAbi;
  }
  const buy = async () => {

    if (!amount) {
      return;
    } else {

    let __max = max-Number(balanceUser)
    if (amount < 0 || amount == "" || isNaN(amount)) {
      message.error("Invalid amount!");
      throw new Exception();
    } else if (amount < min) {
      message.error("Minimum quantity should be " + BaseHelper.numberToCurrencyStyle(min) + "!");
      throw new Exception();
    } else if (amount > __max) {
      message.error("Can't buy over limit " + BaseHelper.numberToCurrencyStyle(__max) + "!");
      throw new Exception();
    }
    }
    if (walletConnect) {
      const contract = new ethers.Contract(address, abi, walletConnect);
      if (contract && amount) {
        const amountToCost = parseFloat(cost) * parseInt(amount);
        const busd = new ethers.Contract(busdAddress, busdAbi, walletConnect);

        const contractSeed = new ethers.Contract(
          seedAddress,
          seedAbi,
          walletConnect
        );
        const max = await contractSeed._max();

        const amountToCostWei = ethers.utils.parseEther(
          amountToCost.toString()
        );
        const amountToWei = ethers.utils.parseEther(amount.toString());
        const busdTx = await busd.approve(address, amountToCostWei);
        await busdTx.wait();
        const buyTx = await contract.buy(amountToWei);
        setStateBuy("Buy now");
        await buyTx.wait().then(() => {
          setStateBuy("Approval");
        });
      }
    }
  };



  return (
    <Modal
      className="modal-wallet"
      title={null}
      visible={isModalVisible}
      onCancel={hideModal}
      footer={null}
      closable={false}
    >
      <div>
        <div className="back" onClick={hideModal}>
          <div className="icon-back"></div>
          <span>Cancel</span>
        </div>
        <div className="header">
          <span className="title-buy">Buy WDA token</span>
          <br></br>
          <span className="sub-title-buy">{cost} BUSD per WDA</span>
        </div>
        <Divider />
        <div>
          <input
            className="input-max-modal"
            type="number"
            value={amount}
            placeholder="WDA amount.."
            onChange={handelChangeAmount}
          />
        </div>

        <div className="footer-buy">
          <div>
            <div>
              <span className="text-buy">
                {parseInt(amount) * parseFloat(cost)} BUSD
              </span>
            </div>
            <div>
              <span style={{ color: "#b8b8b8" }}>for </span>
              <span style={{ color: "#F4F4F4" }}>{amount} WDA</span>
            </div>
          </div>
          <div>
            <Button
              className="btn-buy"
              style={{ height: "auto" }}
              loading={loading}
              disabled={isDisable}
              onClick={async () => {
                try {
                  if (!amount) return;
                  setLoading(true);
                  setIsDisable(true)
                  let bbbbbb = await buy();
                  setLoading(false);
                  message.success("Buy success");
                  hideModal();
                  setBuySuccess(Number(amount) + Number(balanceUser));
                  setAmount("");
                  setBalanceUser(Number(balanceUser) + Number(amount));
                } catch (error) {
                  console.log("bbbbbb: ", error);
                  setLoading(false);
                }
                finally {
                  setIsDisable(false)
                }
              }}
            >
              <span>{stateBuy}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default ModalBuy;
