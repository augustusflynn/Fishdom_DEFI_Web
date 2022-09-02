import { Col, Row, Space } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { wallet$ } from '../../redux/selectors';
import BaseHelper from '../../utils/BaseHelper';

function AdvisorRound(props) {
    const walletConnect = useSelector(wallet$);
    const [isWhiteList, setWhiteList] = useState(true);
    const [data, setData] = useState({
        unlock: 0,
        released: 0,
        claimable: 0,
        nextDay: '',
    });

    return (
        <div className="module-content">
            <Row justify="space-between" gutter={[30, 50]}>
                <Col xs={24} md={12}>
                    <Space direction="vertical" size={20}>
                        <div className="module-header-small">Advisor Round</div>
                        <div className="module-blur">Lock for 24 months, linear vesting for 24 months.</div>
                        <div className="module-title-small">Next Claiming Day: {data.nextDay ? BaseHelper.dateFormatVesting(data.nextDay) : ''}</div>
                    </Space>
                </Col>
                <Col xs={24} md={12}>
                    <Space direction="vertical" size={20}>
                        <div>
                            <div className="d-inline-block module-border-right">
                                <div className="module-title">{BaseHelper.numberToCurrencyStyle(data.unlock)}</div>
                                <div className="module-blur">WDA to be unlocked</div>
                            </div>

                            <div className="d-inline-block">
                                <div className="module-title">{BaseHelper.numberToCurrencyStyle(data.released)}</div>
                                <div className="module-blur">WDA Released</div>
                            </div>
                        </div>

                        <div className="module-line"></div>
                        <Row gutter={[30, 50]} justify="space-between" style={{ alignItems: 'end' }}>
                            <Col xs={10} md={10} lg={10}>
                                <div className="module-title" style={{ color: '#FBCB4E' }}>
                                    {BaseHelper.numberToCurrencyStyle(data.claimable)}
                                </div>
                                <div className="module-blur">WDA Claimable</div>
                            </Col>
                            <Col xs={14} md={14} lg={14}>
                                {/* <Button>Claim Now</Button> */}
                                <button
                                    // onClick={claimTge}
                                    disabled={data.claimable === 0 ? true : false}
                                    className={`${data.claimable === 0 ? 'disabled' : ''} btn-default`}>
                                    <span>
                                        Claim Now
                                    </span>
                                </button>
                            </Col>
                        </Row>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
export default AdvisorRound;
