import React from "react";
import { Divider, Modal } from "antd";

function CheckNetwork(props) {
  const { isModalVisible } = props;


  return (
    <Modal
      className="modal-wallet"
      // title={"Wrong Network Detected"}
      visible={isModalVisible}
      // onCancel={handleCancel}
      footer={null}
      closable={false}
    >
      {/* <div className="flex-center">
        <div className="text-sub">
          Windao require you to swith over Ethereum Mainnet to be able to
          participate.
        </div>
      </div>
      <p className="text-title">
        To get started, please switch your network by following the instructions
        below: 1.Open Metamask 2.Click the network select dropdown 3. Click on
        "Ethereum Mainnet"
      </p> */}
      <div>
        <div className="back">
          <span className="text-title">Wrong Network Detected</span>
        </div>

        <Divider />
        <div>
          <div className="text-sub">
            Windao require you to swith over BSC Testnet to be able to
            participate.
          </div>
          <br />
          <div className="text-sub">
            To get started, please switch your network by following the
            instructions below:
          </div>
          <br />
          <div className="text-sub">1. Open Metamask</div>
          <div className="text-sub">2. Click the network select dropdown </div>
          <div className="text-sub">3. Click on "Ethereum Mainnet</div>
        </div>

        <div className="footer-buy">
          <div>
            <div>
              <span className="text-buy">
                {/* {parseInt(amount) * parseFloat(cost)} BUSD */}
              </span>
            </div>
            <div>
              {/* <span style={{ color: "#F4F4F4" }}>{amount} WDA</span> */}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default CheckNetwork;
