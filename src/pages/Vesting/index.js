import { Space } from "antd";
import React, { Fragment } from "react";
import FadeAnimationOdd from "../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../layout/grid/Container";
import AdvisorRound from "./AdvisorRound";
import PrivateRound from "./PrivateRound";
import SeedRound from "./SeedRound";

function Vesting(props) {
  return (
    <Fragment>
      <section className="section" id="section-vesting">
        <FadeAnimationOdd />
        <Container>
          <Space direction="vertical" size={90}>
            <div className="module-header text-center" data-aos="fade-up">
              Vesting
            </div>
            <SeedRound />
            <PrivateRound />
            <AdvisorRound />

          </Space>
        </Container>
      </section>
    </Fragment>
  );
}
export default Vesting;
