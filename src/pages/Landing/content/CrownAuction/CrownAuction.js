import { Row, Space } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SFEED_ANIMATION } from "src/constants/const";
import { makeQueryBuilder } from "src/utils/MoralisQuery";
import ICON from "./../../../../assets/images/landingPage/iconArrow.svg";
import CountdownClock from "./CountdownClock";

function CrownAuction({
  ticketJoinedAuctionCrown,
  walletConnect,
  totalJoinAuction,
}) {
  const [expiredTime, setExpiredTime] = useState();

  useEffect(async () => {
    await moralisInit();
  }, [walletConnect]);

  const moralisInit = async () => {
    const auction = await makeQueryBuilder("AuctionOpened", 1).find();
    const expiredTime = parseInt(`${auction[0]?.attributes.closingTime}000`);
    setExpiredTime(expiredTime);
  };
  return (
    <Space
      direction="vertical"
      data-aos="fade-left"
      data-aos-delay={SFEED_ANIMATION.DELAY - 300}
    >
      <Row justify="space-between">
        <div className="module-title module-title-res">CROWN Auction</div>
        <div className="module-blur">
          <Link to={"/products-crown-auction"}>
            {" "}
            <img src={ICON} />
            View More
          </Link>
        </div>
      </Row>
      <div className="module-line"></div>
      <div
        className="module-group-horizatol"
        data-aos="fade-up"
        data-aos-delay={SFEED_ANIMATION.DELAY - 850}
      >
        <Space direction="vertical" size={5} className="module-border-right">
          <div>
            <div className="module-title">{totalJoinAuction}</div>
          </div>
          <div className="module-blur">Total Joined</div>
        </Space>
        <Space direction="vertical" size={5}>
          <div className="module-title">
            {" "}
            <CountdownClock expiredTime={expiredTime} />
            {/* <CountdownClock expiredTime={expireLuckyAuctionCrown} /> */}
          </div>
          <div className="module-blur">Remaining Days</div>
        </Space>
      </div>
    </Space>
  );
}

export default CrownAuction;
