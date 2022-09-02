import { Col, Row, Space } from "antd";
import React from "react";
import IMAGES from "src/assets/images";
import { SFEED_ANIMATION } from "src/constants/const";
import Container from "src/layout/grid/Container";
import ContainerFluid from "src/layout/grid/ContainerFluid";

function Banner() {
  return (
    <section
      className="section"
      id="section-first-NFT"
      style={{ minHeight: "1100px" }}
    >
      <Container>
        <Row justify="space-between">
          <Col md={18}>
            <Space direction="vertical" size={40} className="over-hidden">
              <div className="module-header">
                The world's first NFT has power and always growing
              </div>
              <div className="module-blur">
                WinDAO - where everyone's a winner. Creating fairness, equality
                and sustainability is our mission.
              </div>
            </Space>
          </Col>
        </Row>
      </Container>
      <ContainerFluid>
        <Row className="banner-first-NFT" justify="end">
          <div
            className="border-banner-NFT"
            data-aos="fade-in-left"
            data-aos-delay={SFEED_ANIMATION.DELAY + 500}
          >
            <img src={IMAGES.BANNER_LANDING} alt="" />
          </div>
        </Row>
      </ContainerFluid>
    </section>
  );
}

export default React.memo(Banner);
