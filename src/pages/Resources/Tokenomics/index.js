import { Col, Row } from "antd";
import React, { Fragment, useEffect } from "react";
import FadeAnimationEven from "../../../layout/fadeAnimation/FadeAnimationEven";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import BaseHelper from "../../../utils/BaseHelper";
import Container from "./../../../layout/grid/Container";
import listWheel from "./data/listWheel.json";
import dataVesting from "./data/vestingSchedule.json";
import { renderChart } from "./wheelChart";
import { SFEED_ANIMATION } from "../../../constants/const";

function Tokenomic() {
  //redirect page scroll on top and render chart wheel
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderChart();
  }, []);

  //data token allocation
  const dataAllocation = listWheel;

  // data token vesting
  const dataTokenVesting = dataVesting;
  const lstTotalVesting = {
    total_Seed: 0,
    total_Private: 0,
    total_Presale: 0,
    total_TotalPerMonth: 0,
  };
  const renderViewVesting = dataTokenVesting.map((item, index) => {
    let totalByMonth = 0;
    // total by month
    totalByMonth = item.Presale + item.Private + item.Seed;
    // total all vesting
    lstTotalVesting.total_Seed += item.Seed;
    // total all private
    lstTotalVesting.total_Private += item.Private;
    // total all presale
    lstTotalVesting.total_Presale += item.Presale;
    // total all permonth
    lstTotalVesting.total_TotalPerMonth += totalByMonth;

    ///add element td to last child
    if (index === dataTokenVesting.length - 1) {
      var totalLastChild = (
        <tr >
          <td>Total</td>
          <td></td>
          <td>
            {BaseHelper.numberToCurrencyStyle(lstTotalVesting.total_Seed)}
          </td>
          <td>
            {BaseHelper.numberToCurrencyStyle(lstTotalVesting.total_Private)}
          </td>
          <td>
            {BaseHelper.numberToCurrencyStyle(lstTotalVesting.total_Presale)}
          </td>
          <td>
            {BaseHelper.numberToCurrencyStyle(
              lstTotalVesting.total_TotalPerMonth
            )}
          </td>
        </tr>
      );
    }

    return (
      <Fragment>
        <tr key={index} data-aos="fade-left" data-aos-duration={SFEED_ANIMATION.DURATION+250} >
          <td>{index + 1}</td>
          <td>{item.month}</td>
          <td>
            {BaseHelper.numberToCurrencyStyle(item.Seed === 0 ? "" : item.Seed)}
          </td>
          <td>
            {BaseHelper.numberToCurrencyStyle(
              item.Private === 0 ? "" : item.Private
            )}
          </td>
          <td>
            {BaseHelper.numberToCurrencyStyle(
              item.Presale === 0 ? "" : item.Presale
            )}
          </td>
          <td>{BaseHelper.numberToCurrencyStyle(totalByMonth)}</td>
        </tr>
        {/* if exist => view */}
        {totalLastChild && totalLastChild}
      </Fragment>
    );
  });

  const DataVesting2 = [
    {
      year: "2022",
      distribution: "172.000.000",
      supply: "17.2%",
    },
    {
      year: "2023",
      distribution: "78.000.000",
      supply: "7.8%",
    },
    {
      year: "2024",
      distribution: "42.000.000",
      supply: "4.2%",
    },
    {
      year: "2025",
      distribution: "42.000.000",
      supply: "4.2%",
    },
    {
      year: "2026",
      distribution: "28.000.000",
      supply: "2.8%",
    },
  ];
  const renderDataAllocation = dataAllocation.map((item, index) => {
    return (
      <tr
        data-aos="fade-up"
        data-aos-duration={SFEED_ANIMATION.DURATION+250}
        key={index}
        className="content"
      >
        <td className="percent-content">{item.percent}%</td>
        <td className="Allocation-content">{item.name}</td>
        <td className="Vesting-content"> {item.vesting}</td>
      </tr>
    );
  });

  const renderDataVesting2 = DataVesting2.map((item, index) => {
    return (
      <tr
        data-aos="fade-up"
        data-aos-duration={SFEED_ANIMATION.DURATION+250}
        key={index}
        className="content"
      >
        <td className="year-content">{item.year}</td>
        <td className="Distribution-content">{item.distribution}</td>
        <td className="Supply-content"> {item.supply}</td>
      </tr>
    );
  });
  return (
    <Fragment>
      <section id="section-tokenomic" className="section">
      <FadeAnimationOdd />
        <Container>
          <div className="module " data-aos="fade-up">
            <div className="module-header text-center" data-aos="fade-up">
              WinDAO Tokenomics
            </div>
            <div className="module-content">
              <Row justify="center" className="text-center" gutter={[40, 40]}>
                <Col xs={24} sm={9}>
                  <div
                    className="module-blur"
                    data-aos="fade-up"
                    data-aos-duration={SFEED_ANIMATION.DURATION+250}
                  >
                    Token name
                  </div>
                  <div
                    className="module-header-small"
                    data-aos="fade-up"
                   data-aos-duration={SFEED_ANIMATION.DURATION+500}
                  >
                    WinDAO
                  </div>
                </Col>
                <Col xs={24} sm={9}>
                  <div
                    className="module-blur"
                    data-aos="fade-up"
                    data-aos-duration={SFEED_ANIMATION.DURATION+250}
                  >
                    Token symbol
                  </div>
                  <div
                    className="module-header-small"
                    data-aos="fade-up"
                   data-aos-duration={SFEED_ANIMATION.DURATION+500}
                  >
                    WDA
                  </div>
                </Col>
                <Col xs={24} sm={9}>
                  <div
                    className="module-blur"
                    data-aos="fade-up"
                    data-aos-duration={SFEED_ANIMATION.DURATION+250}
                  >
                    Token type  
                  </div>
                  <div
                    className="module-header-small"
                    data-aos="fade-up"
                   data-aos-duration={SFEED_ANIMATION.DURATION+500}
                  >
                    BEP-20
                  </div>
                </Col>
                <Col xs={24} sm={9}>
                  <div
                    className="module-blur"
                    data-aos="fade-up"
                    data-aos-duration={SFEED_ANIMATION.DURATION+250}
                  >
                    Platform
                  </div>
                  <div
                    className="module-header-small"
                    data-aos="fade-up"
                   data-aos-duration={SFEED_ANIMATION.DURATION+500}
                    style={{ width: 243 }}
                  >
                    Binance Smart Chain
                  </div>
                </Col>
                <Col xs={24} sm={24} className="text-center" data-aos="fade-up">
                  <div className="module-blur " data-aos-duration={SFEED_ANIMATION.DURATION+250}>
                    Total Token Supply
                  </div>
                  <div className="module-header-small"data-aos-duration={SFEED_ANIMATION.DURATION+500}>
                    1.000.000.000
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </section>
      <section id="section-Allocation" className="section">
      <FadeAnimationEven />
        <Container>
          <div className="module-header text-center" data-aos="fade-up">
            WinDAO Allocation
          </div>
          <div className="module-content">
            <div className="chart-wrapper">
              <h4 data-results-chart-title></h4>
              <canvas
                width="200" data-aos-delay={400}
                data-aos="fade-up"
                id="wheel-chart"
                height="200"
                aria-label="wheel chart"
                role="img"
                data-results-chart
              ></canvas>
            </div>
            <ul data-results-chart-legends />
          </div>
          <div className="module-content">
            <table id="table-allocation" data-aos="fade-up">
              <thead className="title">
                <th className="percent"> %</th>
                <th className="Allocation ">Allocation</th>
                <th className="Vesting"> Vesting Schedule</th>
              </thead>
              <tbody>{renderDataAllocation}</tbody>
            </table>
          </div>
        </Container>
      </section>
      <section id="section-token-vesting" className="section">
      <FadeAnimationOdd />
        <Container>
          <div className="module-header text-center" data-aos="fade-up">
            Token Vesting Schedule
          </div>
          <div className="module-content">
            <table
              id="table-token-vesting"
              data-aos="fade-up"
             data-aos-duration={SFEED_ANIMATION.DURATION+500}
            >
              <thead>
                <tr>
                  <th>Months</th>
                  <th>Seed</th>
                  <th>Private</th>
                  <th>Presale</th>
                  <th>Total Per Month</th>
                </tr>
              </thead>
              <tbody>{renderViewVesting}</tbody>
            </table>
          </div>
          <div className="module-content" style={{ display: "block" }}>
            <Row justify="center" gutter={[70, 50]}>
              <Col xs={24} sm={16} lg={10}>
                <table
                  id="table-vesting-2"
                  data-aos="fade-up"
                  data-aos-duration={SFEED_ANIMATION.DURATION+250}
                >
                  <thead className="title">
                    <th className="Year"> Year</th>
                    <th className="Distribution ">Distribution</th>
                    <th className="Supply"> Supply</th>
                  </thead>
                  <tbody>{renderDataVesting2}</tbody>
                </table>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </Fragment>
  );
}
export default Tokenomic;
