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
            <Row
              justify="space-between"
              gutter={[50, 50]}
              className="text-center"
            >
              <Col
                md={12}
                lg={8}
                data-aos="fade-up"
                data-aos-duration={SFEED_ANIMATION.DURATION + 250}
              >
                <div className="avtar-member">
                  <img
                    src={IMAGES.TEAM.MEMBER_1}
                    width="200px"
                    alt=""
                    data-aos-delay="1000"
                    data-aos="flip-left"
                    data-offset="150"
                  />
                </div>
                <div
                  className="name-member"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Pham Quang Phuc
                </div>
                <div
                  className="module-blur text-center role"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Founder
                </div>
                <div
                  className="module-blur"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Experienced investor and developer, has invested in and
                  advised many domestic and foreign projects in many fields. 7
                  years of experience in trading stocks and crypto currencies.
                  10 years of real estate investment experience.
                </div>
              </Col>
              <Col
                md={12}
                lg={8}
                data-aos="fade-up"
                data-aos-duration={SFEED_ANIMATION.DURATION + 250}
              >
                <div className="avtar-member">
                  <img
                    src={IMAGES.TEAM.MEMBER_2}
                    width="200px"
                    alt=""
                    data-aos-delay="1000"
                    data-aos="flip-left"
                    data-offset="150"
                  />
                </div>
                <div
                  className="name-member"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Luong Tu
                </div>
                <div
                  className=" module-blur text-center role"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Growth
                </div>
                <div
                  className="module-blur"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  PhD in Technology Management from Polytechnic University.
                  Intelligent traffic management in the country. 6 years of
                  forex trading and investment experience. 5 years of real
                  estate business experience.
                </div>
              </Col>
              <Col
                md={12}
                lg={8}
                data-aos="fade-up"
                data-aos-duration={SFEED_ANIMATION.DURATION + 250}
              >
                <div className="avtar-member">
                  <img
                    src={IMAGES.TEAM.MEMBER_3}
                    width="200px"
                    alt=""
                    data-aos-delay="1000"
                    data-aos="flip-left"
                    data-offset="150"
                  />
                </div>
                <div
                  className="name-member"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Samuel Kernel
                </div>
                <div
                  className="module-blur text-center role"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Tech Lead
                </div>
                <div
                  className="module-blur"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Invention engineer. 15 years of experience in the field of
                  informatics, 5 years of experience in the field of blockchain
                  technology.
                </div>
              </Col>
              <Col
                md={12}
                lg={8}
                data-aos="fade-up"
                data-aos-duration={SFEED_ANIMATION.DURATION + 250}
              >
                <div className="avtar-member">
                  <img
                    src={IMAGES.TEAM.MEMBER_4}
                    width="200px"
                    alt=""
                    data-aos-delay="1000"
                    data-aos="flip-left"
                    data-offset="150"
                  />
                </div>
                <div
                  className="name-member"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Pauline Metton
                </div>
                <div
                  className=" module-blur text-center role"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Marketing
                </div>
                <div
                  className="module-blur"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Master of Culture, 10 years of experience as a marketing
                  director and multi-project development.
                </div>
              </Col>
              <Col
                md={12}
                lg={8}
                data-aos="fade-up"
                data-aos-duration={SFEED_ANIMATION.DURATION + 250}
              >
                <div className="avtar-member">
                  <img
                    src={IMAGES.TEAM.MEMBER_5}
                    width="200px"
                    alt=""
                    data-aos-delay="1000"
                    data-aos="flip-left"
                    data-offset="150"
                  />
                </div>
                <div
                  className="name-member"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Dao Huyen
                </div>
                <div
                  className=" module-blur text-center role"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Community Coordinator
                </div>
                <div
                  className="module-blur"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Master of Business Administration. 6 years of sales and
                  management experience.
                </div>
              </Col>
              <Col
                md={12}
                lg={8}
                data-aos="fade-up"
                data-aos-duration={SFEED_ANIMATION.DURATION + 250}
              >
                <div className="avtar-member">
                  <img
                    src={IMAGES.TEAM.MEMBER_6}
                    width="200px"
                    alt=""
                    data-aos-delay="1000"
                    data-aos="flip-left"
                    data-offset="150"
                  />
                </div>
                <div
                  className="name-member"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Ngoc Phuong
                </div>
                <div
                  className=" module-blur text-center role"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Community Manager
                </div>
                <div
                  className="module-blur"
                  data-aos="fade-up"
                  data-offset="150"
                >
                  Bachelor of Science in Natural Resources and Environment. 5
                  years of community management experience.
                </div>
              </Col>
            </Row>
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
