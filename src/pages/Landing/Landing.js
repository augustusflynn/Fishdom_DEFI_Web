import { Button, Col, Row, Space } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Scroll from "react-scroll";
import { providerFake } from "src/constants/apiContants";
import BaseHelper from "./../../utils/BaseHelper";
import {
  auctionAbi,
  auctionAddress,
  crownNFTAbi,
  crownNFTAdress,
  luckyWDAAbi,
  luckyWDAAddress,
} from "src/constants/constants";
import { wallet$ } from "src/redux/selectors";
import IMAGES from "../../assets/images";
import CrownLuckyContract from "../../constants/abiCrownLucky.json";
import miningContact from "../../constants/abiMining.json";
import StakingContract from "../../constants/abiStaking.json";
import { SFEED_ANIMATION } from "../../constants/const";
import FadeAnimationEven from "../../layout/fadeAnimation/FadeAnimationEven";
import FadeAnimationOdd from "../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../layout/grid/Container";
import Banner from "./Banner";
import CrownAuction from "./content/CrownAuction/CrownAuction";
import CrownLucky from "./content/CrownLucky/CrownLucky";
import LuckyTicket from "./content/LuckyTicket/LuckyTicket";
import MiningCrown from "./content/MiningCrown/MiningCrown";

var scroll = Scroll.animateScroll;
let count = 0;
function Landing() {
  const walletConnect = useSelector(wallet$);
  const { stakingAddress, stakingAbi } = StakingContract;
  const { miningAddress, miningAbi } = miningContact;
  const { crownLuckyAddress, crownLuckyAbi } = CrownLuckyContract;
  const period = 5 * 24 * 60 * 60;
  //stake
  const [totalStaked, setTotalStaked] = useState(0);
  //lucky ticket
  const [ticketJoinedLucky, setTicketJoinedLucky] = useState(0);
  const [expireLucky, setExpireLucky] = useState();
  //dao treasury
  const [currentCrown, setCurrentCrown] = useState(0);
  //crown lucky
  const [ticketJoinedLuckyCrown, setTicketJoinedLuckyCrown] = useState(0);
  //crown auction
  const [totalJoinAuction, setTotalJoinAuction] = useState(0);
  const [ticketJoinedMiningCrown, setTicketJoinedMiningCrown] = useState(0);
  const _expiredTime = moment(
    `${moment(expireLucky)
      .add(parseInt(period), "second")
      .format("YYYY-MM-DD")} 7:00 PM`,
    "YYYY-MM-DD HH:mm"
  );
  const dailyExpiredTime = moment(
    `${moment().utc().format("YYYY-MM-DD")} 01:00 PM`,
    "YYYY-MM-DD HH:mm"
  ).utcOffset(0, true);
  const nowUTCDate = moment().utc().toDate().getTime();
  const expiredTimeCrown =
    dailyExpiredTime.toDate().getTime() < nowUTCDate
      ? dailyExpiredTime.add(1, "day")
      : dailyExpiredTime;
  useEffect(() => {
    var hash = window.location.hash;
    if (hash !== undefined) {
      let elem = document.getElementById(hash.slice(1));
      if (elem) {
        setTimeout(() => {
          var getOffset = elem.offsetTop - 150;
          scroll.scrollTo(getOffset);
        }, 1500);
      }
    } else {
      scroll.scrollToTop();
    }
  }, []);

  console.log("render");
  useEffect(async () => {
    let isSubcribe = true;
    // count++;
    // if (count == 1) {
    //   return;
    // }
    let provider;
    if (walletConnect) {
      provider = walletConnect;
    } else {
      provider = new ethers.providers.JsonRpcProvider(providerFake);
    }

    // provider = walletConnect;
    // if (!walletConnect) {
    //   return;
    // }

    const contractStake = new ethers.Contract(
      stakingAddress,
      stakingAbi,
      provider
    );

    const contractLucky = new ethers.Contract(
      luckyWDAAddress,
      luckyWDAAbi,
      provider
    );

    const contractNFT = new ethers.Contract(
      crownNFTAdress,
      crownNFTAbi,
      provider
    );

    const crownLuckyContract = new ethers.Contract(
      crownLuckyAddress,
      crownLuckyAbi,
      provider
    );
    const crownAuctionContract = new ethers.Contract(
      auctionAddress,
      auctionAbi,
      provider
    );

    const miningContact = new ethers.Contract(
      miningAddress,
      miningAbi,
      provider
    );
    if (!provider) {
      return;
    }
    if (
      !contractStake ||
      !contractLucky ||
      !contractNFT ||
      !crownLuckyContract ||
      !crownAuctionContract ||
      !miningContact
    ) {
      return;
    }
    const lastNftId = await crownAuctionContract.lastNftId();
    if (isSubcribe == false) return;
    Promise.all([
      await contractStake.totalStaked(),
      await contractLucky.totalTicketSoldPerPeriod(),
      await crownLuckyContract.ticketSoldPerDay(),
      await miningContact.mintedQuantity(),
      await contractNFT.totalSupply(),
      await contractLucky.lastTimeCheck(),
      await crownAuctionContract.auctions(lastNftId),
    ]).then((res) => {
      setTotalStaked(
        BaseHelper.numberWithDots(ethers.utils.formatEther(res[0].toString()))
      );
      setTicketJoinedLucky(res[1].toString());
      setTicketJoinedLuckyCrown(res[2].toString());
      setTicketJoinedMiningCrown(res[4].toString());
      setCurrentCrown(res[4].toString());
      setExpireLucky(parseInt(res[5].toString()) * 1000);
      setTotalJoinAuction(res[6].totalBid?.toString());
    });
    return () => (isSubcribe = false);
  }, [walletConnect]);

  return (
    <Fragment>
      <div className="fade-dotted-left-pink-main"></div>
      <div className="fade-dotted-right-blue-main"></div>
      <Banner />
      <section className="section" id="section-Staking-WDA">
        <FadeAnimationOdd />
        <Container>
          <Row justify="space-between" gutter={[30, 80]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size={30}>
                <div className="module-header-small" data-aos="zoom-in-left">
                  Staking WDA
                </div>
                <div
                  className="module-blur"
                  data-aos="fade-left"
                  data-aos-delay={SFEED_ANIMATION.DELAY - 800}
                >
                  Earn up to 250% APR when staking WDA by using CROWN.
                </div>
                <div
                  className="module-btn"
                  data-aos="fade-left"
                  data-aos-delay={SFEED_ANIMATION.DELAY - 500}
                >
                  <Button>
                    <Link to={"/stake-wda"}>Stake Now</Link>
                  </Button>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <div
                className="module-border-token-stake"
                data-aos="zoom-out"
                data-aos-delay={SFEED_ANIMATION.DELAY - 500}
              >
                <Space direction="vertical" size={30}>
                  <div className="module-title"> Staked Token</div>
                  <div className="module-number">{totalStaked}</div>
                  <div className="module-blur">$0 per WDA</div>
                  <div className="module-btn">
                    <Space size={32}>
                      <Button>
                        <Link to={"/trade-win-swap"}>WinSwap</Link>
                      </Button>
                      <Button>PancakeSwap</Button>
                    </Space>
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <LuckyTicket
        ticketJoinedLucky={ticketJoinedLucky}
        _expiredTime={_expiredTime}
      />
      <section className="section" id="section-DAO-Treasury">
        <FadeAnimationOdd />
        <Container>
          <Row justify="space-between" gutter={[30, 80]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size={30}>
                <div className="module-header-small" data-aos="zoom-in-left">
                  DAO Treasury
                </div>
                <div
                  className="module-blur"
                  data-aos-delay={SFEED_ANIMATION.DELAY - 800}
                  data-aos="fade-left"
                >
                  DAO Treasury is owned and managed by CROWN holders. Our policy
                  is to take actions only after a successful proposal and vote.
                </div>
              </Space>
              <div
                className="module-title"
                style={{ fontSize: "16px", fontFamily: "Circular Std" }}
                data-aos="fade-left"
                data-aos-delay={SFEED_ANIMATION.DELAY - 500}
              >
                Current CROWN: {currentCrown}
                <span className="module-blur"> / 5.000</span>
              </div>
            </Col>
            <Col xs={24} md={12} className="module-right-top">
              <Space direction="vertical" size={60}>
                <CrownLucky
                  expireLuckyCrown={expiredTimeCrown}
                  ticketJoinedLuckyCrown={ticketJoinedLuckyCrown}
                />
                <CrownAuction totalJoinAuction={totalJoinAuction} />
                <MiningCrown
                  ticketJoinedMiningCrown={ticketJoinedMiningCrown}
                />
              </Space>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section" id="section-info-Treasury">
        <FadeAnimationEven />

        <Container>
          <Row justify="space-between" gutter={[30, 80]}>
            <Col
              xs={24}
              md={12}
              className="treasury-balance"
              data-aos="fade-up"
            >
              <Space direction="vertical" size={30}>
                <Row justify="space-between" data-aos="fade-up">
                  <div className="module-title module-title-res">
                    {" "}
                    Treasury Balance
                  </div>
                  <div
                    className="module-blur-title module-blur"
                    data-aos="fade-up"
                    data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                  >
                    $0
                  </div>
                </Row>
                <Row
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                  data-aos="fade-up"
                  data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                >
                  <Col xs={1} md={2}>
                    <img src={IMAGES.COIN.BNB} alt="" />
                  </Col>
                  <Col xs={21} md={22} className="over-hidden">
                    <Row justify="space-between">
                      <div className="name-token">BNB</div>
                      <div className="module-blur">$0</div>
                    </Row>

                    <div className="module-progress ">
                      <div
                        className="progress-active"
                        data-aos="fade-right"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </Col>
                </Row>
                <Row
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                  data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                  data-aos="fade-up"
                >
                  <Col xs={1} md={2}>
                    <img src={IMAGES.COIN.WDA} alt="" />
                  </Col>
                  <Col xs={21} md={22} className="over-hidden">
                    <Row justify="space-between">
                      <div className="name-token">WDA</div>
                      <div className="module-blur">$0</div>
                    </Row>
                    <div className="module-progress ">
                      <div
                        className="progress-active"
                        data-aos="fade-right"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </Col>
                </Row>
                <Row
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                  data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                  data-aos="fade-up"
                >
                  <Col xs={1} md={2}>
                    <img src={IMAGES.COIN.BUSD} alt="" />
                  </Col>
                  <Col xs={21} md={22} className="over-hidden">
                    <Row justify="space-between">
                      <div className="name-token">BUSD</div>
                      <div className="module-blur">$0</div>
                    </Row>
                    <div className="module-progress ">
                      <div
                        className="progress-active"
                        data-aos="fade-right"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </Col>
                </Row>
                <Row
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                  data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                  data-aos="fade-up"
                >
                  <div
                    className="module-btn"
                    data-aos="fade-up"
                    data-aos-duration={SFEED_ANIMATION.DURATION + 500}
                    style={{ width: "100%" }}
                  >
                    <Button>See Treasury</Button>
                  </div>
                </Row>
              </Space>
            </Col>
            <Col
              xs={24}
              md={12}
              className="Investment-Funds"
              data-aos="fade-up"
            >
              <Space direction="vertical" size={30}>
                <Row justify="space-between" data-aos="fade-up">
                  <div className="module-title module-title-res">
                    Investment Funds
                  </div>
                  <div className="module-blur-title module-blur">$0</div>
                </Row>
                <Row
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                  data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                  data-aos="fade-up"
                >
                  <Col xs={1} md={2}>
                    <img src={IMAGES.COIN.BNB} alt="" />
                  </Col>
                  <Col xs={21} md={22} className="over-hidden">
                    <Row justify="space-between">
                      <div className="name-token">BNB</div>
                      <div className="module-blur">$0</div>
                    </Row>

                    <div className="module-progress ">
                      <div
                        className="progress-active"
                        data-aos="fade-right"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </Col>
                </Row>
                <Row
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                  data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                  data-aos="fade-up"
                >
                  <Col xs={1} md={2}>
                    <img src={IMAGES.COIN.BUSD} alt="" />
                  </Col>
                  <Col xs={21} md={22} className="over-hidden">
                    <Row justify="space-between">
                      <div className="name-token">BUSD</div>
                      <div className="module-blur">$0</div>
                    </Row>
                    <div className="module-progress ">
                      <div
                        className="progress-active"
                        data-aos="fade-right"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </Col>
                </Row>
                <Row
                  data-aos-duration={SFEED_ANIMATION.DURATION + 250}
                  data-aos="fade-up"
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                >
                  <Col xs={1} md={2}>
                    <img src={IMAGES.COIN.OTHER_TOKEN} alt="" />
                  </Col>
                  <Col xs={21} md={22} className="over-hidden">
                    <Row justify="space-between">
                      <div className="name-token">Other Token</div>
                      <div className="module-blur">$0</div>
                    </Row>
                    <div className="module-progress ">
                      <div
                        className="progress-active"
                        data-aos="fade-right"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </Col>
                </Row>
                <Row
                  className="pg-bar"
                  justify="space-between"
                  gutter={{ xs: 7 }}
                >
                  <div
                    className="module-btn"
                    data-aos="fade-up"
                    data-aos-duration={SFEED_ANIMATION.DURATION + 500}
                    style={{ width: "100%" }}
                  >
                    <Button>See Treasury</Button>
                  </div>
                </Row>
              </Space>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section" id="section-our-useCases">
        <FadeAnimationOdd />
        <Container>
          <Space direction="vertical" size={30}>
            <div className="module-header-small" data-aos="zoom-in-left">
              Our Use Cases
            </div>
            <div
              className="module-blur"
              data-aos="fade-left"
              data-aos-delay={SFEED_ANIMATION.DELAY - 800}
            >
              Now and forever, WinDAO always give the best experience to
              everyone.
            </div>
          </Space>
          <ul className="module-content">
            <Row justify="space-between" gutter={[80, 30]}>
              <Col md={4} className="item-case" xs={8} data-aos="fade-right">
                <img src={IMAGES.USECASE.DAO} alt="" className="icon-case" />
                <br />
                DAO
              </Col>
              <Col md={4} className="item-case" xs={8} data-aos="fade-right">
                <img src={IMAGES.USECASE.DAPP} alt="" className="icon-case" />
                <br />
                DAPP
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 100}
              >
                <img src={IMAGES.USECASE.STAKE} alt="" className="icon-case" />
                <br />
                STAKE
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 200}
              >
                <img src={IMAGES.USECASE.DEFI} alt="" className="icon-case" />
                <br />
                DEFI 2.0
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 300}
              >
                <img
                  src={IMAGES.USECASE.TRADING}
                  alt=""
                  className="icon-case"
                />
                <br />
                TRADING
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 400}
              >
                <img
                  src={IMAGES.USECASE.WINSWAP}
                  alt=""
                  className="icon-case"
                />
                <br />
                WINSWAP
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 500}
              >
                <img src={IMAGES.USECASE.LOTTERY} className="icon-case" />
                <br />
                LOTTERY
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 600}
              >
                <img
                  src={IMAGES.USECASE.AUCTION}
                  alt=""
                  className="icon-case"
                />
                <br />
                AUCTION
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 700}
              >
                <img src={IMAGES.USECASE.INVEST} alt="" className="icon-case" />
                <br />
                INVEST
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 800}
              >
                <img src={IMAGES.USECASE.COMMUNITY} className="icon-case" />
                <br />
                COMMUNITY ECONOMY
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 900}
              >
                <img src={IMAGES.USECASE.NFT} alt="" className="icon-case" />
                <br />
                NFT MINING
              </Col>
              <Col
                md={4}
                className="item-case"
                xs={8}
                data-aos="fade-right"
                data-aos-duration={SFEED_ANIMATION.DURATION + 1000}
              >
                <img src={IMAGES.USECASE.REWARD} alt="" className="icon-case" />
                <br />
                REWARD ECONOMY
              </Col>
            </Row>
          </ul>
        </Container>
      </section>
      <section className="section" id="section-audits">
        <FadeAnimationEven />
        <Container>
          <Space direction="vertical" size={30}>
            <div className="module-header-small" data-aos="zoom-in-left">
              Audits
            </div>
            <div
              className="module-blur"
              data-aos="fade-left"
              data-aos-delay={SFEED_ANIMATION.DELAY - 800}
            >
              WinDAO has been audited by leading experts in blockchain security.
            </div>
          </Space>
          <ul className="module-content">
            <Row justify="space-between" gutter={[40, 40]}>
              <Col xs={24} md={8} data-aos="fade-up">
                <div className="module-audit"></div>
                <div
                  className="module-btn"
                  data-aos="fade-left"
                  data-aos-delay={SFEED_ANIMATION.DELAY - 500}
                >
                  <Button>
                    <img src={IMAGES.ICON.FILE} alt="" />
                    See Report
                  </Button>
                </div>
              </Col>
              <Col
                xs={24}
                md={8}
                data-aos="fade-up"
                data-aos-delay={SFEED_ANIMATION.DELAY - 600}
              >
                <div className="module-audit"></div>
                <div
                  className="module-btn"
                  data-aos="fade-left"
                  data-aos-delay={SFEED_ANIMATION.DELAY - 500}
                >
                  <Button>
                    <img src={IMAGES.ICON.FILE} alt="" />
                    See Report
                  </Button>
                </div>
              </Col>
              <Col
                xs={24}
                md={8}
                data-aos="fade-up"
                data-aos-delay={SFEED_ANIMATION.DELAY - 400}
              >
                <div className="module-audit"></div>
                <div
                  className="module-btn"
                  data-aos="fade-left"
                  data-aos-delay={SFEED_ANIMATION.DELAY - 500}
                >
                  <Button>
                    <img src={IMAGES.ICON.FILE} alt="" />
                    See Report
                  </Button>
                </div>
              </Col>
            </Row>
          </ul>
        </Container>
      </section>
    </Fragment>
  );
}
export default Landing;
