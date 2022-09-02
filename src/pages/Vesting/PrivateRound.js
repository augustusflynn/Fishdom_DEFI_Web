import { Col, message, Row, Space } from 'antd';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { priavteAddress, privateAbi } from '../../constants/constants';
import { wallet$ } from '../../redux/selectors';
import BaseHelper from '../../utils/BaseHelper';

function PrivateRound(props) {
    const walletConnect = useSelector(wallet$);
    const [reload, setReload] = useState(false);

    const [data, setData] = useState({
        unlock: 0,
        released: 0,
        claimable: 0,
        nextDay: '',
    });

    const [isWhiteList, setWhiteList] = useState(true);

    useEffect(async () => {
        if (!walletConnect) {
            setWhiteList(false);
            return;
        }
        const contract = new ethers.Contract(priavteAddress, privateAbi, walletConnect);
        console.log('contractP: ', contract);
        if (contract) {
            try {
                const address = await walletConnect.getAddress();
                const whiteList1 = await contract.isWhiteList1(address);
                const whiteList2 = await contract.isWhiteList2(address);

                console.log('whiteList1: ', whiteList1);
                console.log('whiteList2: ', whiteList2);
                if (whiteList1 == true || whiteList2 === true) {
                    setWhiteList(true);
                } else {
                    setWhiteList(false);
                    return;
                }

                const _user = await contract.users(address);

                const userBalance = ethers.utils.formatEther(_user.balance);

                const _release = await contract.getRelease(address);
                let wdaReleaseToNumber = ethers.utils.formatEther(_release);

                const _claimable = await contract.getUnlocked(address);
                let claimableToNumber = ethers.utils.formatEther(_claimable);

                const _nextTimeClaim = await contract.nextTimeClaim();
                let nextTimeClaim = new Date(parseInt(_nextTimeClaim) * 1000);

                // console.log('_nextTimeClaim: ', _nextTimeClaim)

                setData({
                    unlock: Number(userBalance),
                    released: Number(wdaReleaseToNumber),
                    claimable: Number(claimableToNumber),
                    nextDay: nextTimeClaim,
                });
            } catch (error) {
                console.log('errorrrr: ', error);
                setWhiteList(false);
            }
        }
    }, [walletConnect, reload]);

    const claimTge = async () => {
        if (!walletConnect) return;
        try {
            // const addressP = await walletConnect.getAddress()
            const contract = new ethers.Contract(priavteAddress, privateAbi, walletConnect);

            await contract.vesting().then((data) => {
                console.log('nextVesting private: ', data);
                message.success('Claim Success');
                setReload(!reload);
            });
        } catch (error) {
            message.error(error?.message);
            console.log('private round claim tge error: ', error);
        }
    };

    // const vesting = async () => {
    //     if (!walletConnect)
    //         return;
    //     const contract = new ethers.Contract(priavteAddress, privateAbi, walletConnect)
    //     await contract.vesting().then(console.log())
    // }

    return (
        <div className="module-content">
            <Row justify="space-between" gutter={[30, 50]}>
                <Col xs={24} md={12}>
                    <Space direction="vertical" size={20}>
                        <div className="module-header-small">Private Round</div>
                        <div className="module-blur">20% at TGE, Lock for 1 month and vesting 10% , 10% vesting cycle every 2 months.</div>
                        <div className="module-title-small">
                            Next Claiming Day: {!isWhiteList ? '' : data.nextDay ? BaseHelper.dateFormatVesting(data.nextDay) : ''}
                        </div>
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
                                <div className="module-title" style={{ color: '#7AC7EB' }}>
                                    {BaseHelper.numberToCurrencyStyle(data.claimable)}
                                </div>
                                <div className="module-blur">WDA Claimable</div>
                            </Col>
                            <Col xs={14} md={14} lg={14}>
                                <button onClick={claimTge}
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
export default PrivateRound;
