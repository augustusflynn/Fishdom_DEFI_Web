import { Row, Space } from "antd";
import { Link } from "react-router-dom";
import { SFEED_ANIMATION } from "src/constants/const";
import ICON from "./../../../../assets/images/landingPage/iconArrow.svg";
import CountdownClock from "./CountdownClock";


function CrownLucky({ ticketJoinedLuckyCrown, expireLuckyCrown }) {
  return (
    <Space
      direction="vertical"
      data-aos="fade-left"
      data-aos-delay={SFEED_ANIMATION.DELAY - 300}
    >
      <Row justify="space-between">
        <div className="module-title module-title-res">CROWN Lucky</div>
        <div className="module-blur">
          <Link to={"/products-crown-lucky"}>
            {" "}
            <img src={ICON} /> View More
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
            <div className="module-title">
              {ticketJoinedLuckyCrown} / 50.000
            </div>
          </div>
          <div className="module-blur">Total Joined</div>
        </Space>
        <Space direction="vertical" size={5}>
          <div className="module-title">
            {" "}
            <CountdownClock
              expiredTime={expireLuckyCrown?.toDate()?.getTime()}
            />
          </div>
          <div className="module-blur">Remaining Days</div>
        </Space>
      </div>
    </Space>
  );
}

export default CrownLucky;
