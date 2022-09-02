import { Row, Space } from "antd";
import { Link } from "react-router-dom";
import { SFEED_ANIMATION } from "src/constants/const";
import ICON from "./../../../../assets/images/landingPage/iconArrow.svg";

function MiningCrown({ ticketJoinedMiningCrown }) {
  return (
    <Space
      direction="vertical"
      data-aos="fade-left"
      data-aos-delay={SFEED_ANIMATION.DELAY - 100}
    >
      <Row justify="space-between">
        <div className="module-title module-title-res">Mining CROWN</div>
        <div className="module-blur">
          <Link to={"/stake-mining-crown"}>
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
        data-aos-delay="400"
      >
        <Space direction="vertical" size={5}>
          <div>
            <div className="module-title">{ticketJoinedMiningCrown}</div>
          </div>
          <div className="module-blur">Total Joined</div>
        </Space>
      </div>
    </Space>
  );
}

export default MiningCrown;
