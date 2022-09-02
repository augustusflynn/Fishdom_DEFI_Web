import IMAGES from "../../assets/images";
import logo from "../../assets/png/logo-header.svg";
import { BackTop, Col, Row, Space } from "antd";
import React, { Fragment } from "react";
import Container from "../../layout/grid/Container";
import { Link, useNavigate } from "react-router-dom";
import FadeAnimationOdd from "../fadeAnimation/FadeAnimationOdd";

function FooterLayout() {
  const navigate = useNavigate();

  const handleScroll = (key, hash) => {
    navigate(key);
    if (hash) {
      window.location.hash = hash;
    }
  };
  return (
    <Fragment>
      <div id="section-footer" className="section" data-aos="fade-up">
        <FadeAnimationOdd />
        <Container>
          <Space direction="vertical" size={50}>
            <div className="logo-footer" data-aos="fade-up">
              <Link to={"/"}>
                {" "}
                <img src={logo} alt="" />
              </Link>
            </div>
            <Row justify="space-between" gutter={[30, 30]}>
              <Col xs={24} sm={24} md={8} lg={10} data-aos="fade-up">
                <Space direction="vertical" size={20}>
                  <div className="module-title">Join the community</div>
                  <div className="module-blur">
                    Learn more about the WinDAO, chat with the team and others
                    in the community.
                  </div>
                </Space>
                <Row
                  justify="space-between"
                  style={{ maxWidth: 174, paddingTop: 50 }}
                  gutter={[10, 10]}
                >
                  <Col md={6} className="item-social">
                    <a href="https://www.facebook.com/windao.fi">
                      {" "}
                      <img src={IMAGES.CONTACT.FACEBOOK} alt="" />
                    </a>
                  </Col>
                  <Col md={6} className="item-social">
                    <img src={IMAGES.CONTACT.LINKED} alt="" />
                  </Col>
                  <Col md={6} className="item-social">
                    <a href=" https://twitter.com/TheWinDAO">
                      <img src={IMAGES.CONTACT.TWITTER} alt="" />
                    </a>
                  </Col>
                  <Col md={6} className="item-social">
                    <img src={IMAGES.CONTACT.GITHUB} alt="" />
                  </Col>
                  <Col md={6} className="item-social">
                    <a href="https://t.me/WinDAO_Offical">
                      <img src={IMAGES.CONTACT.TELEGRAM} alt="" />
                    </a>
                  </Col>
                  <Col md={6} className="item-social">
                    <a href="https://discord.gg/DuzVAbWS">
                      <img src={IMAGES.CONTACT.DISCORD} alt="" />
                    </a>
                  </Col>
                  <Col md={6} className="item-social">
                    <img src={IMAGES.CONTACT.FUNNY} alt="" />
                  </Col>
                  <Col md={6} className="item-social">
                    <img src={IMAGES.CONTACT.KINGSHIP} alt="" />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={8} lg={7} className="border-bottom">
                <ul className="list-contact" data-aos="fade-up">
                  <Col xs={24}>
                    <span
                      onClick={() => handleScroll("/about-team")}
                      className="module-blur"
                    >
                      Team
                    </span>
                  </Col>
                  <Col sm={24}>
                    <span
                      onClick={() =>
                        handleScroll("/about-team", "#section-partner")
                      }
                      className="module-blur"
                    >
                      Partners & Investors
                    </span>
                  </Col>
                  <Col sm={24}>
                    <a href="https://docs.windao.fi/" className="module-blur">
                      Documentation
                    </a>
                  </Col>
                </ul>
              </Col>
              <Col xs={24} sm={24} md={8} lg={7}>
                <ul className=" list-contact" data-aos="fade-up">
                  <Col>
                    <a href="" className="module-blur">
                      CROWN & SCEPTER
                    </a>
                  </Col>
                  <Col>
                    <a
                      href="https://docs.windao.fi/how-windao-work"
                      className="module-blur"
                    >
                      How WinDAO Works?
                    </a>
                  </Col>
                  <Col>
                    <a href="mailto: support@windao.fi" className="module-blur">
                      Contact Us
                    </a>
                  </Col>
                </ul>
              </Col>
            </Row>
            <div className="copy-right">
              © 2022 WinDAO. All rights reserved.
            </div>
          </Space>
        </Container>
      </div>
      <BackTop duration={2000} />
    </Fragment>
  );
}
export default FooterLayout;
