import { Empty, Modal, Pagination, Row, Space, Spin, Tag } from "antd";
import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { providerFake } from "src/constants/apiContants";
import { wallet$ } from "src/redux/selectors";

function ModalStaking({
  isShowModal,
  setShowModal,
  setValueSelectNFT,
  CrownContract,
}) {
  const walletConnect = useSelector(wallet$);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [listCrown, setListCrown] = useState([]);
  const [countList, setCountList] = useState();
  const [loading, setLoading] = useState(true);
  const [currentBlock, setCurrentBlock] = useState();
  const hideModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    try {
      (async () => {
        if (walletConnect) {
          // const blockTimeCurrent
          // const provider = new ethers.providers(walletConnect.provider.network);
          // console.log(provider);
          // console.log(" provider");
          // console.log(provider);
          const network = await walletConnect.provider.getNetwork();
          console.log(network);
          const provider = new ethers.providers.JsonRpcProvider(providerFake);
          console.log(provider);
          const blockCurrent = await provider.getBlock();
          console.log("blockCurrent");
          console.log(blockCurrent.number);
          setCurrentBlock(blockCurrent.number);
        }
      })();
    } catch (error) {
      console.log(error);
    }
  }, [walletConnect]);

  function handleSelectNFT(nft) {
    setValueSelectNFT(nft);
    hideModal();
  }
  useEffect(() => {
    setLoading(false);
  }, [listCrown]);
  useEffect(() => {
    let isSubscribed = true;
    try {
      async function init() {
        setLoading(true);
        try {
          if (!CrownContract) return;
          //calll list owner token
          let listOwnerToken = await CrownContract.ownerToTokenArray(
            await walletConnect.getAddress()
          );
          if (listOwnerToken.length == 0) {
            setListCrown([]);
          }
          if (!isSubscribed) return;
          setCountList(listOwnerToken.length);

          if (listOwnerToken && listOwnerToken.length > 0) {
            new Promise(async (resolve) => {
              let result = [];
              for (
                let i = (currentPage - 1) * limit;
                i < currentPage * limit;
                i++
              ) {
                //get NFT id
                const NFTId = listOwnerToken[i]?.toString();
                if (!NFTId) {
                  break;
                }
                const tokenURI = await CrownContract.tokenURI(NFTId);
                const metadata = await axios.get(tokenURI).then((res) => {
                  if (res.status === 200) {
                    return res.data;
                  } else {
                    return {};
                  }
                });
                const NFTTraits = await CrownContract.getTraits(NFTId);
                if (NFTTraits) {
                  result.push({
                    ...metadata,
                    ...NFTTraits,
                    aprBonus: NFTTraits.aprBonus.toString(),
                    id: NFTId,
                  });
                }
              }
              resolve(result);
            }).then((data) => {
              if (!isSubscribed) return;
              setListCrown(data);
            });
          }
        } catch (error) {
          console.log("get owner crown error", error);
        }
      }
      isSubscribed && init();
    } catch (error) {
      console.log(error);
    }
    return () => (isSubscribed = false);
  }, [walletConnect, currentPage]);
  const renderListCrown = (
    <Space direction="vertical" size={20}>
      {listCrown && listCrown.length > 0 ? (
        listCrown.map((item, index) => {
          return (
            <OwnerCrown
              currentBlock={currentBlock}
              key={index}
              {...item}
              onSelect={(nft) => handleSelectNFT(nft)}
            />
          );
        })
      ) : (
        <Empty />
      )}
    </Space>
  );

  return (
    <Modal
      visible={isShowModal}
      title={null}
      footer={null}
      closable={null}
      onCancel={hideModal}
      className="c2i-modal"
    >
      <div className="c2i-header-modal">
        <div className="back" onClick={hideModal}>
          <div className="icon-back"></div>
          <span className="text-sub" onClick={hideModal}>
            Go Back
          </span>
        </div>
        <div className="module-title" style={{ marginTop: 8 }}>
          Choose Your NFT
        </div>
        <div className="module-line"></div>
      </div>
      <div className="c2i-body-modal">
        {loading ? (
          <div
            className="text-center"
            style={{ position: "relative", height: 250 }}
          >
            <Spin style={{ top: "49%" }} />
          </div>
        ) : (
          renderListCrown
        )}
      </div>
      <div className="c2i-footer-modal">
        <Space direction="vertical" className="pagination" align="center">
          {listCrown.length > 0 && walletConnect && (
            <Pagination
              defaultCurrent={currentPage}
              total={countList}
              pageSize={limit}
              onChange={(pageNumber) => {
                setCurrentPage(pageNumber);
              }}
            />
          )}
        </Space>
      </div>
    </Modal>
  );
}
function OwnerCrown(props) {
  return (
    <Row justify="space-between">
      <div>
        <Space className="text-center" size={14} align="end">
          <div className="rectange">
            <img
              src={props?.image || ""}
              alt="crown"
              width={"100%"}
              height={"100%"}
            />
          </div>
          <Space direction="vertical" size={6}>
            <div className="text-title">{props?.name || "CROWN"}</div>
            <Tag
              style={{ color: "#72DE99", borderColor: "#72DE99" }}
              className="ant-active"
            >
              {props?.aprBonus || "0"}% APR
            </Tag>
          </Space>
          {/* <Tag style={{ color: "#F4F4F4" }} className="ant-executed">
            {props?.attributes[0].value || "0"}% Reduce
          </Tag> */}
        </Space>
      </div>
      {parseInt(props.lockDeadline.toString()) > 0 &&
      parseInt(props.lockDeadline.toString()) > props.currentBlock ? (
        <div className="border-round align-center">
          <div
            className="text-sub item-round"
            style={{ color: "#444b51", cursor: "not-allowed" }}
          >
            Locked
          </div>
        </div>
      ) : props.staked ? (
        <div className="border-round align-center">
          <div
            className="text-sub item-round"
            style={{ color: "#444b51", cursor: "not-allowed" }}
          >
            Staked
          </div>
        </div>
      ) : (
        <div
          className="border-round align-center"
          onClick={() => {
            props.onSelect && props.onSelect(props);
          }}
        >
          <div className="text-sub item-round choose">Choose</div>
        </div>
      )}
    </Row>
  );
}

export default ModalStaking;
