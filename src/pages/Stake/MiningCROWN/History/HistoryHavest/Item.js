import { Col, Image, Row, Space, Tag } from "antd";
import axios from "axios";
import { ethers } from "ethers";
import Identicon from "identicon.js";
import React, { useEffect, useState } from "react";
import { crownNFTAbi, crownNFTAdress } from "src/constants/constants";
import BaseHelper from "src/utils/BaseHelper";

import { ICON_HISTORY_STAKE as icon } from "../../../../../assets/images";
function Item({ item, CrownContract }) {
  const history = item.attributes;
  console.log(" item");
  console.log(history);
  const [reduce, setReduce] = useState(0);
  const [apr, setApr] = useState(0);
  const [image, setImage] = useState();
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
      if (history.nftId == 0) return;
      const tokenURI = await CrownContract.tokenURI(history.tokenId);
      const metadata = await axios.get(tokenURI).then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      });
      console.log(metadata);
      setImage(metadata.image);

      setReduce(
        metadata?.attributes && Object.keys(metadata?.attributes).length > 0
          ? metadata?.attributes.find((item) => item["trais_type"] == "Reduce")
              .value
          : 0
      );
      setApr(
        metadata?.attributes && Object.keys(metadata?.attributes).length > 0
          ? metadata?.attributes.find(
              (item) => item["trais_type"] == "AprBonus"
            ).value
          : 0
      );
    } catch (error) {
      console.log(error);
    }
  }, [CrownContract]);
  return (
    <Col xs={24} md={12}>
      <div className="item">
        {/* <div className="text-white" style={{ fontSize: "30" }}>
          {BaseHelper.numberWithDots(
            parseFloat(ethers.utils.formatEther(history?.amount)).toString()
          )}{" "}
        </div> */}
        <div className="text-title-default ">
          <span className="text-sub">Mining Days: </span>
          {BaseHelper.getTypeByDurationId(history.duration)} -
          <span className="text-title">
            {" "}
            {BaseHelper.numberWithDots(
              parseFloat(ethers.utils.formatEther(history?.amount)).toString()
            )}
          </span>
        </div>

        <div className="module-line"></div>

        <Space className="text-center" size={14} align="end">
          <div className="rectange">
            <img
              src={image}
              alt="crown"
              width={"54px"}
              height={"75px"}
              style={{ objectFit: "cover" }}
            />
          </div>
          <Space direction="vertical" size={20}>
            <div className="text-title" style={{ textAlign: "left" }}>
              CROWN {history.tokenId}
            </div>
            <Row>
              <Tag className="ant-Active  text-title-default">{apr}% APR</Tag>
              <Tag className="ant-Excuted  text-title-default">
                {reduce}% Reduce
              </Tag>
            </Row>
          </Space>
        </Space>
        <Row justify="" align="middle" style={{ marginTop: 20 }}></Row>
        <div className="text-title-default point">
          <span className="text-sub" style={{ paddingLeft: 23 }}>
            Held by:{" "}
          </span>
          {BaseHelper.shortTextAdress(history?.owner)}
        </div>
        <div className="text-title-default point">
          <span className="text-sub" style={{ paddingLeft: 23 }}></span>
          {BaseHelper.dateFormatVesting(history?.createdAt)}
        </div>
        {/* </Row> */}
      </div>
    </Col>
  );
}

export default Item;
