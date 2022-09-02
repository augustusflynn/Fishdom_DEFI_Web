import { Button, Input, message, Space } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SceptorImg from "src/assets/images/Scepter.jpg";
import { wallet$ } from "src/redux/selectors";
import {
  crownLuckyAbi, crownLuckyAddress
} from "../../../constants/abiCrownLucky.json";

const Scepter = (props) => {
  const { scepter, setScepter } = props;
  const walletConnect = useSelector(wallet$);
  const [isloading, setIsLoading] = useState(false);

  const buttonHandler = async () => {
    if (scepter == 0) {
      message.error("You have no scepter!");
      return;
    } else {
      const contract = new ethers.Contract(
        crownLuckyAddress,
        crownLuckyAbi,
        walletConnect
      );
      try {
        setIsLoading(true);
        message.warning("Please wait for execution...");
        console.log(contract);
        let tx = await contract.claimScepter();
        await tx.wait();
        message.success("Execution successfully!");
        setScepter(0);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        message.error("Scepter claim error!");
        setIsLoading(false);
      }
    }
  };
  return (
    <Space direction="horizontal" size={24} align="center">
      <img className="img-third" src={SceptorImg} alt="img" />
      <Space direction="vertical" size={16}>
        <Space direction="vertical" size={4} className="w-100">
          <h2 className="module-title c2i-no-margin">SCEPTER</h2>
          <div className="flex items-center">
            <div className="dot-green"></div>
            <p className="module-blur c2i-no-margin">
              Was mined on{" "}
              <span className="c2i-color-title">March 1st, 2022</span>
            </p>
          </div>
        </Space>
        <div className="line"></div>
        <Space direction="vertical" size={12}>
          <div className="c2i-form-group">
            <div className="c2i-form-control">
              <Input type="number" min={1} placeholder={scepter} disabled />
            </div>
          </div>
        </Space>
        <Button
          loading={isloading}
          className="confirm-btn"
          onClick={buttonHandler}
        >
          Claim Now
        </Button>
      </Space>
    </Space>
  );
};

export default Scepter;