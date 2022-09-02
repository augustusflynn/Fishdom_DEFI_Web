import { Button, Input, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
function ModalDelegation(props) {
  const {
    hideModal,
    isShowModal,
    walletConnect,
    contractNFT,
    setdelegatevote,
    setShowPopupWallet,
    delegatevote,
  } = props;
  const [deleagateAddress, setDelegateAddress] = useState("");
  const [addressOwner, setAddressOwner] = useState("");
  const [disable, setDisable] = useState(false);
  const [loadingDelegateSelf, setLoadingDelegateSelf] = useState(false);
  const [loadingDelegateVote, setLoadingDelegateVote] = useState(false);
  const onchangeDelegateAddress = (value) => {
    setDelegateAddress(value);
  };
  useEffect(async () => {
    try {
      if (walletConnect) {
        const address = await walletConnect.getAddress();
        setAddressOwner(address);
      }
    } catch (error) {
      console.log(error);
    }
  }, [walletConnect]);
  const delegateVotes = async () => {
    if (!walletConnect) {
      setShowPopupWallet(true);
      return;
    }
    if (deleagateAddress?.trim() == "") {
      message.error("Invalid address!");
      return;
    }
    if (!contractNFT) return;
    setDisable(true);
    setLoadingDelegateVote(true);
    try {
      await contractNFT.delegate(deleagateAddress).then(async (res) => {
        await res.wait().then(() => {
          message.success("Delegate success");
          setDisable(false);
          setLoadingDelegateVote(false);
          hideModal();
          setdelegatevote(!delegatevote);
        });
      });
    } catch (error) {
      console.log(error);
      setDisable(false);
      message.error(error?.message);
      setLoadingDelegateVote(false);
    }
  };
  const selfDelegate = async () => {
    if (!walletConnect) {
      setShowPopupWallet(true);
      return;
    }
    if (!contractNFT) return;
    setDisable(true);
    setLoadingDelegateSelf(true);
    try {
      await contractNFT.delegate(addressOwner).then(async (res) => {
        await res.wait();
        message.success("Delegate success");
        setDisable(false);
        setLoadingDelegateSelf(false);
        hideModal();
        setdelegatevote(!delegatevote);
      });
    } catch (error) {
      setLoadingDelegateSelf(false);
      setDisable(false);
      message.error(error?.message);
      console.log(error);
    }
  };
  return (
    <Modal
      visible={isShowModal}
      title={null}
      footer={null}
      closable={null}
      onCancel={hideModal}
      className="c2i-modal"
    >
      <div className="c2i-header-modal">
        <div className="back" onClick={hideModal}>
          <div className="icon-back"></div>
          <span className="text-sub" onClick={hideModal}>
            Go Back
          </span>
        </div>
        <div className="module-title" style={{ marginTop: 8 }}>
          Update Delegation
        </div>
        <div className="module-line"></div>
      </div>
      <div className="c2i-body-modal">
        <div className="text-title">
          You can ether vote on each proposal yourself or delegate your votes to
          a third party.
        </div>
      </div>

      <div className="c2i-footer-modal" style={{ marginTop: 30 }}>
        <Button
          onClick={selfDelegate}
          loading={loadingDelegateSelf}
          disabled={disable}
        >
          Self Delegate
        </Button>
        <div className="c2i-form-group">
          <div className="c2i-form-control">
            <Input
              type="text"
              width="100%"
              className="text-sub"
              value={deleagateAddress}
              placeholder="Delegate address..."
              onChange={(e) => {
                onchangeDelegateAddress(e.target.value);
              }}
            />
            <Button
              style={{ alignItems: "center", display: "flex" }}
              onClick={delegateVotes}
              loading={loadingDelegateVote}
              disabled={disable}
            >
              Delegate Votes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalDelegation;
