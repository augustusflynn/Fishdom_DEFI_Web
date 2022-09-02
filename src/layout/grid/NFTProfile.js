import React, { useEffect, useState } from "react";
import { Card, Image } from "antd";
import moment from "moment";
import { ethers } from "ethers";
import { crownNFTAbi, crownNFTAdress } from "src/constants/constants";
import Identicon from "identicon.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { InputWaiting } from "src/component/skeleton/Skeleton";
import { wallet$ } from "src/redux/selectors";
import { providerFake } from "src/constants/apiContants";

function NFTProfile({ nftId, profileAddress, profileBornOn, blockHash }) {
  const [nftDetail, setNftDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const walletConnect = useSelector(wallet$);
  function handleAddress(address) {
    if (!address) return " ";

    let addressLength = address.length;
    return (
      address.slice(0, 3) +
      "..." +
      address.slice(addressLength - 4, addressLength)
    );
  }

  useEffect(async () => {
    async function init() {
      let provider;
      if (walletConnect) {
        provider = walletConnect;
      } else {
        provider = new ethers.providers.JsonRpcProvider(providerFake);
      }

      const crownNFTContract = new ethers.Contract(
        crownNFTAdress,
        crownNFTAbi,
        provider
      );
      if (!crownNFTContract || !nftId) return;
      try {
        const nftUri = await crownNFTContract.tokenURI(nftId);
        const data = await axios
          .get(nftUri)
          .then((res) => {
            if (res.status === 200) {
              return res.data;
            } else {
              return {};
            }
          })
          .catch((e) => {
            console.log("get detail nft err", e);
          });
        setNftDetail(data);
      } catch (error) {
        console.log("get uri nft error", error);
      }
    }
    setLoading(true);
    await init();
    setLoading(false);
  }, [walletConnect, blockHash]);
  if (!nftId || !profileAddress || !profileBornOn) {
    return <Card className="NFT_profile_container" />;
  }

  return (
    <Card className="NFT_profile_container">
      {loading ? (
        <InputWaiting className="c2i-nft-profile" />
      ) : (
        <Image
          src={nftDetail?.image || ""}
          preview={false}
          width="100%"
          className="NFT_profile_image"
        />
      )}
      <div className="NFT_profile_info">
        <div className="NFT_profile_info__name">
          {loading ? <InputWaiting></InputWaiting> : nftDetail?.name || "CROWN"}
        </div>
        <div className="NFT_profile_info__winner">
          <Image
            src={`data:image/png;base64,${
              profileAddress ? new Identicon(profileAddress, 30).toString() : ""
            }`}
            width={24}
            height={24}
            preview={false}
          />
          <span className="NFT_profile_info__winner__address">
            {loading ? <InputWaiting /> : handleAddress(profileAddress)}
          </span>
          <div className="NFT_profile_info__winner__tag">Winner</div>
        </div>
        <div className="NFT_profile_info__born">
          <div className="point" />
          <div className="NFT_profile_info__born__time">
            Born on
            <span>
              {loading ? (
                <InputWaiting />
              ) : (
                moment(profileBornOn || new Date()).format("LL")
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default NFTProfile;
