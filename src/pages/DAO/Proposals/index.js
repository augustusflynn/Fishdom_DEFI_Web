import { Button, Col, Image, message, Row, Tabs } from "antd";
import { ethers } from "ethers";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { providerFake } from "src/constants/apiContants";
import {
  crownNFTAbi,
  crownNFTAdress,
  daoAbi,
  daoAddress,
} from "src/constants/constants";
import ModalWallet from "src/layout/Topbar/ModalWallet";
import { wallet$ } from "src/redux/selectors";
import FadeAnimationEven from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
import iconQuestion from "./../../../assets/images/landingPage/iconQuestion.svg";
import ModalDelegation from "./ModalDelegation";
import ProposalFinal from "./ProposalFinal";
import ProposalIdea from "./ProposalIdea";
import ProposalRank from "./ProposalRank";
const { TabPane } = Tabs;

/**
 * @AUTHOR DO VAN HUNG C2I
 */
var contract;
var contractNFT;
let count = 0;
const Proposalss = () => {
  /**
   * *HOOK
   */
  //Hook Util
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/");
  const walletConnect = useSelector(wallet$);
  const [showModalDelegate, setShowModalDelegate] = useState(false);
  const [limitPage, setlimitPage] = useState(4);
  const [currentTab, setCurrentTab] = useState("0");
  const [ShowPopupWallet, setShowPopupWallet] = useState(false);
  //Hook Proposal
  const [balanceNFT, setBalanceNFT] = useState(0);
  const [miniumNFT, setMiniumNFT] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [delegatevote, setdelegatevote] = useState(false);
  const [done, setDone] = useState(false);
  /**
   * * INITIALIZATION
   */
  useEffect(() => {
    let isSubscribed = true;
    try {
      const init = async () => {
        // count++;
        // if (count == 1) {
        //   return;
        // }
        const provider = walletConnect
          ? walletConnect
          : new ethers.providers.JsonRpcProvider(providerFake);
        contract = new ethers.Contract(daoAddress, daoAbi, provider);
        contractNFT = new ethers.Contract(
          crownNFTAdress,
          crownNFTAbi,
          provider
        );
        if (!contract) return;
        Promise.all([
          await contract.proposalThreshold(),
          walletConnect &&
            (await contractNFT.getVotes(await walletConnect.getAddress())),
          await contractNFT.totalSupply(),
        ]).then((res) => {
          setMiniumNFT(res[0].toString());
          walletConnect && setBalanceNFT(res[1].toString());
          setTotalSupply(res[2].toString());
          walletConnect && console.log(res[1].toString() + " balance");
          console.log(res[2].toString() + " total supply");
          setDone(true);
        });
      };

      init();
    } catch (error) {
      console.log(error);
    }
    return () => (isSubscribed = false);
  }, [walletConnect, delegatevote]);
  /**
   * *FUNCTION UTIL
   */
  //Change Current Tab
  const changeTabProposal = useCallback((value) => {
    setCurrentTab(value);
  }, []);
  //Redirect To View Create Proposal
  const handleRedirectCreateProposal = useCallback(() => {
    if (!walletConnect) {
      ShowPopupWallet(true);
      return;
    }
    if (Number(totalSupply) < 50) {
      message.error(
        `The total number of NFT Crown issued by the whole system must be greater than 50`
      );
      return;
    }

    if (Number(balanceNFT) < Number(miniumNFT)) {
      message.error(
        `Crown must be greater than ${miniumNFT} to create proposalss`
      );
      return;
    }
    navigate("create-proposals");
  });
  //Hide modal delegate
  const hideShowModalDelegate = useCallback(() => {
    setShowModalDelegate(false);
  });
  const hideWallet = () => setShowPopupWallet(false);
  return done && location.length > 2 ? (
    <Outlet />
  ) : (
    <Fragment>
      {ShowPopupWallet && (
        <ModalWallet isModalVisible={ShowPopupWallet} hideWallet={hideWallet} />
      )}
      <section className="section" id="section-dao-proposal" data-aos="fade-up">
        <FadeAnimationEven />
        <Container>
          <div className="module-header text-center">DAO Proposal</div>
          <Row justify="center">
            <Col lg={14}>
              <Tabs
                type="card"
                onChange={changeTabProposal}
                activeKey={currentTab}
              >
                <TabPane tab="Proposal Idea" key="0">
                  {currentTab == 0 && (
                    <>
                      <Button onClick={handleRedirectCreateProposal}>
                        + Create Proposal
                      </Button>
                      <div
                        className="d-inline-block text-center"
                        style={{ marginTop: 20 }}
                      >
                        <span className="text-sub module-border-bottom">
                          I can’t create proposal{" "}
                        </span>

                        <Image
                          preview={false}
                          src={iconQuestion}
                          style={{ verticalAlign: "middle" }}
                        ></Image>
                        <br />
                        <br />
                        <button
                          onClick={() => setShowModalDelegate(true)}
                          className="text-title  module-border-bottom delegate"
                          style={{
                            background: "transparent",
                            border: "1px solid #b8b8b8",
                          }}
                        >
                          Delegate for vote
                        </button>
                      </div>
                      <ProposalIdea
                        contract={contract}
                        limitPage={limitPage}
                        currentTab={currentTab}
                      />
                    </>
                  )}
                </TabPane>
                <TabPane tab="Proposal Rank" key="1">
                  {currentTab == 1 && (
                    <ProposalRank
                      walletConnect={walletConnect}
                      contract={contract}
                      limitPage={limitPage}
                      changeTabProposal={changeTabProposal}
                      currentTab={currentTab}
                      setShowPopupWallet={setShowPopupWallet}
                    />
                  )}
                </TabPane>
                <TabPane tab="Final Proposal" key="2">
                  {currentTab == 2 && (
                    <ProposalFinal
                      walletConnect={walletConnect}
                      contract={contract}
                      limitPage={limitPage}
                      currentTab={currentTab}
                      changeTabProposal={changeTabProposal}
                      setShowPopupWallet={setShowPopupWallet}
                    />
                  )}
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </section>
      {showModalDelegate && (
        <ModalDelegation
          setShowPopupWallet={setShowPopupWallet}
          isShowModal={showModalDelegate}
          contractNFT={contractNFT}
          hideModal={hideShowModalDelegate}
          walletConnect={walletConnect}
          delegatevote={delegatevote}
          setdelegatevote={setdelegatevote}
        />
      )}
    </Fragment>
  );
};
export default Proposalss;
