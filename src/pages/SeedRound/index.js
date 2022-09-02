import { Col, message, Row, Space, Spin } from "antd";
import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { seedAbi, seedAddress } from "../../constants/constants";
import FadeAnimationOdd from "../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../layout/grid/Container";
import { wallet$ } from "../../redux/selectors";
import BaseHelper from "../../utils/BaseHelper";
import ModalBuy from "./ModalBuy";


function SeedRound(props) {
  const walletConnect = useSelector(wallet$);
  const [boughtWda, setBoughtWda] = useState(0);
  const [cost, setCost] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [buySuccess, setBuySuccess] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isWhiteList, setWhiteList] = useState(true);
  const [isShowBuy, setShowBuy] = useState(false);
  const [balanceUser, setBalanceUser] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSoldOut, setSoldOut] = useState(true);

  // useEffect(async () => {
  //   if (!walletConnect) {
  //     setMin(0);
  //     setMax(0);
  //     setCost(0);
  //     setBoughtWda(0);
  //     setTotalBalance(0);
  //     setWhiteList(false);
  //     return;
  //   }
  //   setLoading(true);
  //   const contract = new ethers.Contract(seedAddress, seedAbi, walletConnect);
  //   if (contract) {
  //     // if (Number(boughtWda) === Number(totalBalance)) {
  //     //   setMin(0);
  //     //   setMax(0);
  //     //   setCost(0);
  //     //   setBoughtWda(0);
  //     //   setTotalBalance(0);
  //     // }
  //     const totalBoughtWDA = await contract.getTotalBoughtWDA();
  //     const totalBoughtWDAToEther = ethers.utils.formatEther(totalBoughtWDA);
  //     setBoughtWda(Number(totalBoughtWDAToEther));
  //   }
  //   setLoading(false);
  // }, [buySuccess]);

  useEffect(async () => {
    window.scrollTo(0, 0);
    if (!walletConnect) {
      setMin(0);
      setMax(0);
      setCost(0);
      setBoughtWda(0);
      setTotalBalance(0);
      setWhiteList(false);
      return;
    }
    setLoading(true);
    const contract = new ethers.Contract(seedAddress, seedAbi, walletConnect);
    if (contract) {
      try {
        const address = await walletConnect.getAddress();

        const whiteList1 = await contract.isWhiteList(address);
        if (whiteList1 == true) {
          setWhiteList(true);
        } else {
          setWhiteList(false);
          setMin(0);
          setMax(0);
          setCost(0);
          setBoughtWda(0);
          setTotalBalance(0);
          return;
        }

        const totalBoughtWDA = await contract.getTotalBoughtWDA();
        const totalBoughtWDAToEther = ethers.utils.formatEther(totalBoughtWDA);
        const _cost = await contract._cost();
        const costToNumber = ethers.utils.formatEther(_cost);

        const _min = await contract._min();
        const minToNumber = ethers.utils.formatEther(_min);

        const _max = await contract._max();
        const maxToNumber = ethers.utils.formatEther(_max);

        const _totalBalances = await contract._totalBalances();
        const _totalBalancesToNumber = ethers.utils.formatEther(_totalBalances);
        const __buySuccess = await contract.getWDABalance(address);
        const _buySuccess = ethers.utils.formatEther(__buySuccess);

        const users = await contract.users(address);
        const __balanceUser = await users.balance._hex;
        const _balanceUser = ethers.utils.formatEther(__balanceUser);

        const _soldOut = await contract._soldOut();

        // console.log('_soldOut: ', _soldOut);
        setSoldOut(_soldOut);

        setBalanceUser(_balanceUser);
        setMin(Number(minToNumber));
        setMax(Number(maxToNumber));
        setCost(Number(costToNumber));
        setBoughtWda(Number(totalBoughtWDAToEther));
        setTotalBalance(Number(_totalBalancesToNumber));
        setBuySuccess(Number(_buySuccess));
      } catch (error) {
        console.log("errorrrr: ", error);
        setWhiteList(false);
        setMin(0);
        setMax(0);
        setCost(0);
        setBoughtWda(0);
        setTotalBalance(0);
      } finally {
        setLoading(false);
      }
    }
  }, [walletConnect, buySuccess]);

  const showBuy = () => {
    let __max = max - Number(balanceUser);
    if (Number(balanceUser) === max) {
      message.error("You have bought all the allowed quantity!");
      return;
    }
    if (amount < 0 || amount == "" || isNaN(amount)) {
      message.error("Invalid amount!");
      return;
    } else if (amount < min) {
      message.error(
        "Minimum quantity should be " +
          BaseHelper.numberToCurrencyStyle(min) +
          "!"
      );
      return;
    } else if (amount > __max) {
      message.error(
        "Can't buy over limit " + BaseHelper.numberToCurrencyStyle(__max) + "!"
      );
      return;
    }

    setShowBuy(true);
  };

  const hideBuy = () => {
    setShowBuy(false);
  };

  const handelChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const SetMaxAmount = (e) => {
    e.preventDefault();
    setAmount(max - Number(balanceUser));
  };

  const openLearnMore = () => {
    window.open("https://t.me/WinDAO_Offical");
  };

  return (
    <Fragment>
      {isShowBuy && (
        <ModalBuy
          balanceUser={balanceUser}
          isModalVisible={isShowBuy}
          setBalanceUser={setBalanceUser}
          hideModal={hideBuy}
          setHideModal={setShowBuy}
          amount={amount}
          cost={cost}
          max={max}
          setAmount={setAmount}
          setMax={setMax}
          setBuySuccess={setBuySuccess}
          handelChangeAmount={handelChangeAmount}
          type="seed-round"
          min={min}
        />
      )}
      <section className="section" id="section-seed-round">
        <FadeAnimationOdd />
        <Container>
          <Row justify="center">
            <Col md={12}>
              <Space direction="vertical" size={15}>
                <div className="module-header text-center">Seed Round</div>
                {loading ? (
                  <Spin style={{ margin: "auto" }} />
                ) : (
                  <Row justify="center">
                    <Col className="seed-round-content">
                      <div
                        className="module-content"
                        data-aos="fade-up"
                        data-aos-duration="1500"
                      >
                        <div className="module-blur">
                          {Number(boughtWda) !== Number(totalBalance) &&
                            isWhiteList && (
                              <span
                                className="text-center"
                                style={{ maxWidth: 200 }}
                              >
                                {" "}
                                10% at TGE, lock for 6 months, linear vesting
                                for 9 months
                              </span>
                            )}
                        </div>
                        <Space direction="vertical" size={15}>
                          <div className="price">
                            <div style={{ display: "inline-block" }}>
                              <span style={{ color: "#F4F4F4" }}>
                                {BaseHelper.numberToCurrencyStyle(boughtWda)}
                              </span>
                              <span style={{ color: "#b8b8b8" }}>
                                {" "}
                                /{" "}
                                {BaseHelper.numberToCurrencyStyle(
                                  totalBalance
                                )}{" "}
                                WDA
                              </span>
                              <div className="module-line"></div>
                            </div>
                          </div>
                          <Row justify="space-between">
                            <div className="module-blur item">Pricing</div>
                            <div className="module-title">
                              1 WDA = {cost} BUSD
                            </div>
                          </Row>
                          <Row justify="space-between">
                            <div className="module-blur item">Minimum Buy</div>
                            <div className="module-title">
                              {BaseHelper.numberToCurrencyStyle(min)}
                            </div>
                          </Row>
                          <Row justify="space-between">
                            <div className="module-blur item">Maximum Buy </div>
                            <div className="module-title">
                              {BaseHelper.numberToCurrencyStyle(max)}
                            </div>
                          </Row>
                          <div className="module-line"></div>
                          <Row
                            justify="space-between"
                            style={{ alignItems: "end" }}
                          >
                            <div
                              className="module-progress"
                              style={{ marginBottom: 10 }}
                            >
                              <div
                                className="progress-active"
                                style={{
                                  width: `${
                                    max === 0
                                      ? "100%"
                                      : (buySuccess / max) * 100 + "%"
                                  }`,
                                  background: "#FE84CF",
                                }}
                              ></div>
                            </div>
                            {isWhiteList &&
                              Number(boughtWda) !== Number(totalBalance) && (
                                <div>
                                  <span style={{ color: "#F4F4F4" }}>
                                    {BaseHelper.numberToCurrencyStyle(
                                      buySuccess
                                    )}{" "}
                                  </span>
                                  <span style={{ color: "#b8b8b8" }}>
                                    {" "}
                                    / {BaseHelper.numberToCurrencyStyle(max)}
                                  </span>
                                </div>
                              )}
                          </Row>
                          {isWhiteList && !isSoldOut && (
                            <React.Fragment>
                              <Row className="max-content">
                                <input
                                  className="input-max"
                                  type="number"
                                  value={amount}
                                  placeholder="WDA amount.."
                                  onChange={handelChangeAmount}
                                />
                                <button
                                  className="btn-max"
                                  onClick={SetMaxAmount}
                                >
                                  <span>Max</span>
                                </button>
                              </Row>
                              <Row>
                                <button
                                  className="btn-join-now"
                                  onClick={showBuy}
                                >
                                  <span> Buy Now</span>
                                </button>
                              </Row>
                            </React.Fragment>
                          )}
                          {/* {console.log('isWhiteList: ', isWhiteList)}
                          {console.log('isSoldOut: ', isSoldOut)} */}
                          {isWhiteList && isSoldOut && (
                            <div>
                              <span className="color-text-default">
                                Sold Out!
                              </span>
                            </div>
                          )}
                          {!isWhiteList && (
                            <div className="text-center">
                              <span className="color-text-default">
                                You are not on the Whitelist!{" "}
                                <span
                                  onClick={openLearnMore}
                                  className="learn-more"
                                >
                                  Contact Us
                                </span>
                              </span>
                            </div>
                          )}
                        </Space>
                      </div>
                    </Col>
                  </Row>
                )}
              </Space>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}
export default SeedRound;
