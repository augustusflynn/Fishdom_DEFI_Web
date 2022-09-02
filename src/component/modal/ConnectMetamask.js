import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

import {
    LockOutlined,
    GlobalOutlined,
    AppstoreOutlined
} from '@ant-design/icons';

function ConnectMetamask(props) {
    const { isModalVisible, hideWallet } = props;

    const handleCancel = () => {
        hideWallet(false);
    };

    const openWeb = () => {
        window.open('https://metamask.io/download/')
    }

    return (
        <Modal className="modal-install" title={'Install MetaMask'} visible={isModalVisible} onCancel={handleCancel} footer={null} >
            <div className='flex-center'>
                <div className='modal-left'>
                    <span className='text-title'>Try the MetaMask extension</span>
                    <button className='btn-install' onClick={openWeb}>Install</button>
                </div>
                <div>
                    <div className='item-right'>
                        <AppstoreOutlined />
                        <span>Connect to crypto apps with one click</span>
                    </div>
                    <div className='item-right'>
                        <LockOutlined />
                        <span>Your private key is stored securely</span>
                    </div>
                    <div className='item-right'>
                        <GlobalOutlined />
                        <span>Works with Ethereum, Polygon, and more</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
export default ConnectMetamask;
