import {
  Button,
  Col,
  Image,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Tag,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
// import { useMoralisCloudFunction } from "react-moralis";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { chanId } from "src/constants";
import { providerFake } from "src/constants/apiContants";
import {
  crownNFTAbi,
  crownNFTAdress,
  daoAbi,
  daoAddress,
} from "src/constants/constants";
import { wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import {
  default as FadeAnimationEven,
  default as FadeAnimationOdd,
} from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
import * as MoralisQuery from "./../../../utils/MoralisQuery";
/**
 * @AUTHOR DO VAN HUNG C2I
 */
const { Option } = Select;
//DEFINE CONTRACT GLOBAL
var contract;
var crownContract;
let count = 0;
function ProposalDetail() {
  /**
   * *HOOK
   */
  //Hook Util
  const location = useLocation().pathname.split("/");
  const walletConnect = useSelector(wallet$);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [listImageForVote, setListImageForVote] = useState([]);
  const [listImageAgainstVote, setListImageAgainstVote] = useState([]);
  const [listVoter, setListVoter] = useState([]);
  const [typeVote, setTypeVote] = useState(null);
  const [stateVote, setStateVote] = useState("Vote");
  const [resetAmountVote, setResetAmountVote] = useState(false);
  //Hook Proposal Detailt
  const [proposalId, setProposalId] = useState(() => {
    if (location.length > 2) {
      var proposalId = location[3];
      return proposalId;
    }
  });
  const [forVote, setForVote] = useState(0);
  const [againstVote, setAgainstVote] = useState(0);
  const [snapshot, setSnapshot] = useState(0);
  const [quorum, setQuorum] = useState(0);
  const [expiredTime, setExpiredTime] = useState();
  const [proposalTitle, setProposalTile] = useState("");
  const [stateProposal, setStateProposal] = useState();
  const [transactionHash, setTransactionHash] = useState();
  const [listProposalDescription, setListProposalDescription] = useState([]);
  const [timeCreated, setTimeCreated] = useState();
  const [addressCreated, setAddressCreated] = useState();
  const [address, setAddress] = useState();

  /**
   * *INITIALIZATION
   */

  // const { fetch } = useMoralisCloudFunction("getAddressesVote", {
  //   proposalId,
  // });

  const getVoter = async () => {
    await fetch({
      onSuccess: (data) => {
        setListVoter(data);
      }, // ratings should be 4.5
    });
  };

  useEffect(() => {
    (async () => {
      if (crownContract && listVoter.length > 0) {
        try {
          let list = [];
          new Promise(async (resolve) => {
            for (let index = 0; index < listVoter.length; index++) {
              const item = listVoter[index];

              const crownFistPerAddress = await crownContract.ownerToTokenArray(
                item.address
              );
              const tokenUri = await crownContract.tokenURI(
                crownFistPerAddress[0].toString()
              );
              const response = await axios.get(tokenUri);
              list.push({ ...response.data, type: item.support });
            }
            resolve(list);
          }).then((res) => {
            setListImageForVote(res.filter((item) => item.type == 1));
            setListImageAgainstVote(res.filter((item) => item.type != 1));
          });
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [crownContract, listVoter, stateVote]);
  useEffect(() => {
    (async () => {
      let isSubscribed = true;
      getVoter();
      const init = async () => {
        let provider;
        if (walletConnect) {
          provider = walletConnect;
        } else {
          provider = new ethers.providers.JsonRpcProvider(providerFake);
        }
        contract = new ethers.Contract(daoAddress, daoAbi, provider);
        crownContract = new ethers.Contract(
          crownNFTAdress,
          crownNFTAbi,
          provider
        );
        if (contract) {
          setLoading(true);
          try {
            //proposal
            const proposal = await MoralisQuery.makeQueryBuilder("Proposals")
              .equalTo("proposalId", proposalId)
              .first();
            //final proposal
            const proposalFinal = await MoralisQuery.makeQueryBuilder(
              "FinalProposals"
            )
              .equalTo("finalProposalId", proposalId)
              .find();
            const _object = proposal.attributes;
            const ProposalDescription = JSON.parse(_object.description);
            const _state = await contract.state(proposalId);
            const _snappsot = await contract.proposalSnapshot(proposalId);

            const _quorum = await contract.quorum(
              _snappsot,
              proposalFinal.length > 0
            );
            if (isSubscribed) {
              setStateProposal(_state);
              setQuorum(_quorum.toString());
              setTransactionHash(_object.transaction_hash);
              setProposalTile(ProposalDescription.title);
              setListProposalDescription(ProposalDescription.newDescriptionn);
              setSnapshot(proposal?.attributes?.startBlock);
              setAddressCreated(proposal?.attributes?.address);
            }
          } catch (error) {
            message.error(error);
            setLoading(false);
          } finally {
            setLoading(false);
          }
        }
      };
      isSubscribed && init();
      return () => (isSubscribed = false);
    })();
  }, [walletConnect]);

  useEffect(() => {
    let isSubcribe = true;
    (async () => {
      try {
        if (contract && isSubcribe) {
          const _proposalVote = await contract.proposalVotes(proposalId);
          setForVote(_proposalVote.forVotes.toString());
          setAgainstVote(_proposalVote.againstVotes.toString());
        }
      } catch (error) {}
    })();
    return () => (isSubcribe = false);
  }, [resetAmountVote, walletConnect]);
  useEffect(() => {
    (async () => {
      try {
        let provider;
        if (walletConnect) {
          provider = walletConnect;
        } else {
          provider = new ethers.providers.JsonRpcProvider(providerFake);
        }
        contract = new ethers.Contract(daoAddress, daoAbi, provider);
        const contractNFT = new ethers.Contract(
          crownNFTAdress,
          crownNFTAbi,
          provider
        );
        if (!contractNFT || !contract) return;
        let address;
        if (walletConnect) {
          address = await walletConnect.getAddress();
        }
        const minixiumNFT = await contract.proposalThreshold();
        const isVoted = await contract.hasVoted(proposalId, address);
        const balance = await contractNFT.getVotes(address);
        const totalSupply = await contractNFT.totalSupply();
        const _snappsot = await contract.proposalSnapshot(proposalId);
        const provider1 = new ethers.providers.Web3Provider(window.ethereum);
        const currentBlock = await provider1
          .getBlock
          // parseInt(_snappsot.toString())
          ();

        const votingPeriod = await contract.votingPeriod();
        const _expire = parseInt(_snappsot) + parseInt(votingPeriod.toString());

        if (_expire <= currentBlock.number) {
          setDisable(true);
        } else {
          setDisable(false);
        }
        if (isVoted) {
          setStateVote("Already voted");
          setDisable(true);
        } else {
          setStateVote("Vote");
          setDisable(false);
        }
        if (
          isVoted ||
          Number(totalSupply) < 50 ||
          Number(balance) < Number(minixiumNFT)
        ) {
          setDisable(true);
        } else {
          setDisable(false);
        }
        if (!walletConnect) {
          return;
        }
        if (walletConnect) {
          address = await walletConnect.getAddress();
          setAddress(address);
        }

        setExpiredTime(_expire);
      } catch (error) {
        message.error(error);
        console.log(error);
      }
    })();
  }, [walletConnect]);
  /**
   * * FUNCTION MAIN
   */
  //Cast Vote
  const Vote = async () => {
    if (!walletConnect) {
      message.error("connect wallet!");
      return;
    }
    if (contract) {
      if (typeVote == null) {
        message.error("Please choose type vote!");
        return;
      }
      try {
        setDisable(true);
        setIsLoading(true);
        const castVote = await contract.castVote(proposalId, typeVote);
        castVote
          .wait()
          .then(() => {
            message.success("Vote success");
            setResetAmountVote(!resetAmountVote);
            setDisable(true);
            setStateVote("Already voted");
            setIsLoading(false);
            setTypeVote(null);
            getVoter();
          })
          .catch((error) => {
            setDisable(false);
            setIsLoading(false);
            message.error(error.message);
          });
      } catch (error) {
        setDisable(false);
        setIsLoading(false);
        message.error(error.message);
      }
    }
  };

  /**
   * *FUNCTION UTIL
   */
  //Select Type Vote {1:for vote,0: against}
  const ontypeVoteChange = (value) => {
    setTypeVote(value);
  };
  return (
    <Fragment>
      <section
        className="section"
        id="section-dao-proposal-detail"
        data-aos="fade-up"
      >
        <div className="module-header text-center">Proposal Detail</div>
        <FadeAnimationEven />
        {
          <Container>
            {loading ? (
              <div style={{ minHeight: "250px", position: "relative" }}>
                <Spin style={{ top: "50%" }} />
              </div>
            ) : (
              <Row justify="center">
                <Col xs={24} md={14}>
                  <Space direction="vertical" size={20}>
                    <div>
                      <Row align="middle" justify="center">
                        <div className="module-header-small ">
                          {proposalTitle}
                        </div>
                        <Tag
                          className={
                            "ant-" + BaseHelper.getState(stateProposal)
                          }
                          style={{ marginLeft: 10 }}
                        >
                          {BaseHelper.getState(stateProposal)}
                        </Tag>
                      </Row>
                      <div
                        className="text-sub text-center"
                        style={{ marginTop: 10 }}
                      >
                        {/* id proposal */}#
                        {BaseHelper.shortTextAdress(proposalId)}
                      </div>
                    </div>
                    <Row justify="center">
                      <Col xs={24} md={16}>
                        <div className="c2i-form-group">
                          <div className="c2i-form-control">
                            <Select
                              placeholder="Select your vote.."
                              onChange={ontypeVoteChange}
                            >
                              <Option value={1}>For</Option>
                              <Option value={0}>Against</Option>
                            </Select>
                            <Button
                              onClick={Vote}
                              disabled={disable}
                              loading={isLoading}
                            >
                              {stateVote}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <div className="module-title">
                        {expiredTime ? `Time End: ${expiredTime}` : "Ended"}
                      </div>

                      <div className="module-blur">Time Remaining</div>
                    </div>
                  </Space>
                </Col>
              </Row>
            )}
            <Row gutter={[30, 60]} justify="center">
              <Col xs={24} sm={24} lg={12}>
                <div className="module-content">
                  <div className="module" style={{ minHeight: 570 }}>
                    <Row gutter={[16, 20]}>
                      {listImageForVote?.length > 0 ? (
                        listImageForVote?.slice(0, 6).map((item, index) => (
                          <Col span={8} key={index}>
                            <Image
                              src={item.image}
                              preview={false}
                              width="100%"
                            ></Image>
                          </Col>
                        ))
                      ) : (
                        <div
                          className="no-vote
                        "
                        >
                          No vote
                        </div>
                      )}
                    </Row>
                  </div>
                  <div className="module-line"></div>
                  <Col span={24}>
                    <Row justify="space-between">
                      <div className="module-title">For’s Vote</div>
                      <div className="amount-vote">{forVote}</div>
                    </Row>
                  </Col>
                </div>
              </Col>

              <Col xs={24} sm={24} lg={12}>
                <div className="module-content">
                  <div className="module" style={{ minHeight: 570 }}>
                    <Row gutter={[16, 20]}>
                      {listImageAgainstVote?.length > 0 ? (
                        listImageAgainstVote?.slice(0, 6).map((item, index) => (
                          <Col span={8} key={index}>
                            <Image
                              src={item.image}
                              preview={false}
                              width="100%"
                            ></Image>
                          </Col>
                        ))
                      ) : (
                        <div
                          className="no-vote
                        "
                        >
                          No vote
                        </div>
                      )}
                    </Row>
                  </div>
                  <div className="module-line"></div>
                  <Col span={24}>
                    <Row justify="space-between">
                      <div className="module-title">Against Vote</div>
                      <div className="amount-vote">{againstVote}</div>
                    </Row>
                  </Col>
                </div>
              </Col>

              <Col xs={20} sm={20}>
                <Row justify="center module-border-right-absolute">
                  <Col xs={12} sm={12}>
                    <div className="text-center ">
                      <div className="module-title">{snapshot}</div>
                      <div className="module-blur">Snapshot</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12}>
                    <div className="text-center">
                      <div className="module-title">{quorum}</div>
                      <div className="module-blur">Quorum</div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        }
      </section>
      {loading ? (
        ""
      ) : (
        <section
          className="section"
          id="section-dao-proposal-description"
          data-aos="fade-up"
        >
          <FadeAnimationOdd />
          <Container>
            <div className="module-header text-center">
              Proposal Description
            </div>
            <Row justify="center">
              <Col xs={24} md={11} className="list-description-proposalss">
                {listProposalDescription?.map((item, index) => (
                  <div className="item" key={index}>
                    <div style={{ margin: "24px 0px" }}>
                      {" "}
                      <div className="text-title">Header {index + 1}</div>
                      <div className="c2i-form-group">
                        <div className="c2i-form-control">
                          <Input
                            width="100%"
                            type="text"
                            readOnly
                            value={item.header ? item.header : ""}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ margin: "24px 0px" }}>
                      {" "}
                      <div className="text-title">Content {index + 1}</div>
                      <div className="c2i-form-group">
                        <div className="c2i-form-control">
                          <TextArea
                            readOnly
                            value={item?.content ? item.content : ""}
                            autoSize={{ minRows: 6, maxRows: 6 }}
                          />
                        </div>
                        <div style={{ margin: "141px 0px" }}></div>
                      </div>
                    </div>
                  </div>
                ))}

                <div>
                  <div style={{ margin: "24px 0px" }}>
                    <div className="text-title">Proposal Transaction</div>
                    <div className="text-sub">
                      {chanId == 42 ? (
                        <a
                          className="text-sub"
                          href={
                            "https://kovan.etherscan.io/tx/" + transactionHash
                          }
                        >
                          {transactionHash}
                        </a>
                      ) : chanId == 56 ? (
                        <a
                          className="text-sub"
                          href={"https://bscscan.com/tx/" + transactionHash}
                        >
                          {transactionHash}
                        </a>
                      ) : (
                        <a
                          className="text-sub"
                          href={
                            "https://testnet.bscscan.com/tx/" + transactionHash
                          }
                        >
                          {transactionHash}
                        </a>
                      )}
                    </div>
                  </div>
                  <div style={{ margin: "24px 0px" }}>
                    <div className="text-title">Proposal owner</div>
                    <div className="text-sub">
                      {addressCreated} at {snapshot}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </Fragment>
  );
}
export default ProposalDetail;
