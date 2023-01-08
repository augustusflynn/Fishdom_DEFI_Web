import { Col, Row } from "antd";
import React, { Fragment, useEffect } from "react";
import Scroll from "react-scroll";
import IMAGES from "../../../assets/images";
import { SFEED_ANIMATION } from "../../../constants/const";
import FadeAnimationEven from "../../../layout/fadeAnimation/FadeAnimationEven";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
var scroll = Scroll.animateScroll;
function Team() {
  useEffect(() => {
    var hash = window.location.hash;
    if (hash !== undefined) {
      window.scrollTo(0, 0);
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
  return (
    <Fragment>
      <section id="section-core-team" className="section">
        <FadeAnimationOdd />
        <Container>
          <div className="module-header text-center" data-aos="fade-up">
            Core Team
          </div>
          <div className="module-content">
            <div
              data-aos="fade-up"
              data-aos-duration={SFEED_ANIMATION.DURATION + 250}
            >
              <div className="avt-image">
                <img
                  src={require("../../../assets/images/core-team/BuiHuyTung.jpg").default}
                  width="200px"
                  alt=""
                  data-aos-delay="1000"
                  data-aos="flip-left"
                  data-offset="150"
                />
              </div>
              <div
                className="name-member text-center"
                data-aos="fade-up"
                data-offset="150"
              >
                Bui Huy Tung
              </div>
              <div
                className="module-blur text-center role"
                data-aos="fade-up"
                data-offset="150"
              >
                Owner
              </div>
              <div
                className="module-blur text-center"
                data-aos="fade-up"
                data-offset="150"
                style={{ maxWidth: "500px" }}
              >
                Experienced research and developer, has contributed in many medium-large projects.
                Over 1 years of experience in Software and Blockchain Development, has knowledge in other technologies: Machine Learning, AI, Game Development ...
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section id="section-Advisors" className="section">
        <FadeAnimationEven />

        {/* <Container>
          <div className="module ">
            <div className="module-header text-center" data-aos="fade-up">
              Advisors
            </div>
            <div className="module-content">
              {/* <Row
                justify="space-between"
                gutter={[60, 50]}
                className="text-center"
              >
                <Col md={12} lg={8} data-aos="fade-up" data-aos-duration={SFEED_ANIMATION.DURATION+250}>
                  <div
                    className="name-advisor"
                    data-aos="fade-up"
                    data-offset="150"
                  >
                    SOME ONE
                  </div>
                </Col>
                <Col md={12} lg={8} data-aos="fade-up" data-aos-duration={SFEED_ANIMATION.DURATION+250}>
                  <div
                    className="name-advisor"
                    data-aos="fade-up"
                    data-offset="150"
                  >
                    SOME ONE
                  </div>
                </Col>
                <Col md={12} lg={8} data-aos="fade-up" data-aos-duration={SFEED_ANIMATION.DURATION+250}>
                  <div
                    className="name-advisor text-center"
                    data-aos="fade-up"
                    data-offset="150"
                  >
                    SOME ONE
                  </div>
                </Col>
              </Row> 
            </div>
          </div>
        // </Container> */}
      </section>
      <section id="section-partner" className="section">
        <FadeAnimationOdd />

        <Container>
          <div className="module ">
            <div className="module-header text-center" data-aos="fade-up">
              Partners
            </div>
            <div className="module-content">
              <Row justify="center" gutter={[70, 50]}>
                <Col xs={24} sm={12} lg={6}>
                  <div
                    className="logo-partner"
                    data-aos="fade-up"
                    data-offset="150"
                  >
                    <img src={IMAGES.PARTNER.PARTNER_3} alt="" />
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div
                    className="logo-partner"
                    data-aos="fade-up"
                    data-offset="150"
                  >
                    <img src={IMAGES.PARTNER.PARTNER_4} alt="" />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </section>
    </Fragment>
  );
}
export default Team;
