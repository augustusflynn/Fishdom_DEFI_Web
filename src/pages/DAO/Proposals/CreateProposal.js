import { MinusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  _daoTresuryAbi,
  _daoTresuryAddress,
  _devAddress,
  _luckyTicketAbi,
  _luckyTicketAddress,
  _MiningAbi,
  _MiningAddress,
  _StakingAbi,
  _StakingAddress,
} from "src/constants/boxSelectProposal";
import { wallet$ } from "src/redux/selectors";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
import {
  crownNFTAbi,
  crownNFTAdress,
  daoAbi,
  daoAddress,
  daoTreasuryAddress,
  wdaAbi,
  wdaAddress,
} from "./../../../constants/constants";

/**
 * @AUTHOR DO VAN HUNG C2I
 */
const { Option } = Select;
//DEFINE CONTRACT GLOBAL
var contract;
function CreateProposal(props) {
  /**
   * *HOOK
   */
  //Hook Util
  const navigate = useNavigate();
  const [balanceWdaOfDaoTreasury, setBalanceDaoTreasury] = useState();
  const walletConnect = useSelector(wallet$);
  const [isDisable, setIsDisable] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [activeFunction, setActiveFunction] = useState();
  const [isCreate, setIsCreate] = useState(false);
  const [done, setDone] = useState();
  //Hook Create Proposal
  const [expiredTime, setExpiredTime] = useState();
  const [dataSelectFunction, setDataSelectFunction] = useState([
    {
      name: "Change % apr stake WDA (max 10%)",
      value: "1",
    },
    {
      name: "Change amount coins needed to mine CROWN (max 10%)",
      value: "2",
    },
    {
      name: "Change amount of bonus WDA token of 1 Lucky Ticket win (max 10%)",
      value: "3",
    },
    {
      name: "Transfer WDA tokens to Staking or Ecosystem Rewards ",
      value: "4",
    },
    {
      name: "Use BNB fund to buy depending on the amount of WDA on pancake (max 10%)",
      value: "5",
    },
    {
      name: "Sell depending on the amount of WDA on pancakes for BNB or USDT",
      value: "6",
    },
    // {
    //   name: "Reward holders of crown WDA or BNB depending on the amount",
    //   value: "7",
    // },
  ]);
  useEffect(() => {
    const init = async () => {
      if (!walletConnect) return;
      const contractNFT = new ethers.Contract(
        crownNFTAdress,
        crownNFTAbi,
        walletConnect
      );
      contract = new ethers.Contract(daoAddress, daoAbi, walletConnect);
      if (!contract || !contractNFT) return;
      const address = await walletConnect.getAddress();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractWDA = new ethers.Contract(
        wdaAddress,
        wdaAbi,
        walletConnect
      );
      const balanceWdaOfDaoTreasury = await contractWDA.balanceOf(
        daoTreasuryAddress
      );
      setBalanceDaoTreasury(balanceWdaOfDaoTreasury.toString());
      Promise.all([
        await contract.proposalThreshold(),
        await contractNFT.getVotes(address),
        await contractNFT.totalSupply(),
        await provider.getBlock(),
        await contract.getBlockToPropose(address),
      ]).then(async (res) => {
        if (Number(res[1] < Number(res[0])) || res[2] < 50) {
          navigate("/dao-proposals");
        } else setIsDisable(false);
        if (Number(res[4].toString()) > res[3].number) {
          console.log("block current");
          console.log(res[3].number);
          console.log("block to propose");
          console.log(Number(res[4].toString()));
          setIsDisable(true);
          setIsCreate(true);
        } else {
          setIsCreate(false);
          setIsDisable(false);
        }
        setDone(true);
      });
    };

    let isSubscribed = true;
    isSubscribed && init();
    return () => (isSubscribed = false);
  }, [walletConnect]);
  /**
   * *FUNCTION MAIN
   */
  const onchangeSelectBox = (value) => {
    setActiveFunction(value);
  };

  //Create Proposal
  const onFinish = async (values) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      let title = values.title;
      let desscription = values.description;
      let valueToChage = values.ValueChange;
      let funct = activeFunction;
      let ifaceBox;
      let _boxAddress;
      let encodeBox;
      let upAndDown = values.upAndDown;
      let BNBValue = values.BNBValue;
      let stakeOrEcosystem = values.stakeOrEcosystem;
      if (title == undefined || title.trim() == "") {
        message.error("Invalid title!");
        return;
      }
      if (!funct) {
        message.error("Invalid select function!");
        return;
      }
      if ([1, 2, 3].includes(parseInt(activeFunction))) {
        if (upAndDown != 0 && upAndDown != 1) {
          message.error("Invalid type function!");
          return;
        }
        if (parseInt(valueToChage) != valueToChage) {
          message.error("Invalid value to change!");
          return;
        }
        if (
          valueToChage <= 0 ||
          valueToChage > 10 ||
          valueToChage == "" ||
          valueToChage == undefined
        ) {
          message.error(
            "Requires value to change greater than 0 and less than 10!"
          );
          return;
        }
      }
      if ([4, 6].includes(parseInt(activeFunction))) {
        if (
          stakeOrEcosystem != 0 &&
          stakeOrEcosystem != 1 &&
          parseInt(activeFunction) == 4
        ) {
          message.error("Invalid choose function!");
          return;
        }
        if (
          valueToChage <= 0 ||
          valueToChage == "" ||
          valueToChage == undefined
        ) {
          message.error("Invalid value to change!");
          return;
        }
        if (
          parseInt(valueToChage) >
          (parseInt(ethers.utils.formatEther(balanceWdaOfDaoTreasury)) * 10) /
            100
        ) {
          message.error(
            `Current balance DAO Treasury: ${parseInt(
              ethers.utils.formatEther(balanceWdaOfDaoTreasury)
            )} \nExceed 10% of the balance!`
          );
          return;
        }
      }

      if ([5].includes(parseInt(activeFunction))) {
        if (BNBValue == "" || BNBValue <= 0 || BNBValue == undefined) {
          message.error("Invalid BNB value!");
          return;
        }
      }

      if (funct == 1) {
        ifaceBox = new ethers.utils.Interface(_StakingAbi);
        _boxAddress = _StakingAddress;
        encodeBox = ifaceBox.encodeFunctionData("setProposal", [
          valueToChage,
          upAndDown,
        ]);

        if (upAndDown == 0) {
          title += ` (Decrease Apr stake WDA: ${valueToChage}%)`;
        } else if (upAndDown == 1) {
          title += ` (Increase Apr stake WDA: ${valueToChage}%)`;
        }
      } else if (funct == 2) {
        ifaceBox = new ethers.utils.Interface(_MiningAbi);
        _boxAddress = _MiningAddress;
        encodeBox = ifaceBox.encodeFunctionData("setProposal", [
          valueToChage,
          upAndDown,
        ]);
        if (upAndDown == 0) {
          title += ` (Decrease amount coins need to mine CROWN: ${valueToChage}%)`;
        } else if (upAndDown == 1) {
          title += ` (Increase amount coins need to mine CROWN: ${valueToChage}%)`;
        }
      } else if (funct == 3) {
        //   name: "Change amount of bonus WDA token of 1 Lucky Ticket win",
        //   value: "3",
        ifaceBox = new ethers.utils.Interface(_luckyTicketAbi);
        _boxAddress = _luckyTicketAddress;
        encodeBox = ifaceBox.encodeFunctionData("setProposal", [
          valueToChage,
          upAndDown,
        ]);
        if (upAndDown == 0) {
          title += ` (Decrease amount bonus WDA of Lucky Ticket Win: ${valueToChage}%)`;
        } else if (upAndDown == 1) {
          title += ` (Increase amount bonus WDA of Lucky Ticket Win: ${valueToChage}%)`;
        }
      } else if (funct == 4) {
        //   name: "Transfer WDA tokens to Staking or Ecosystem Rewards ",
        //   value: "4",
        ifaceBox = new ethers.utils.Interface(_daoTresuryAbi);
        _boxAddress = _daoTresuryAddress;

        if (stakeOrEcosystem == 0) {
          encodeBox = ifaceBox.encodeFunctionData("sendWDA", [
            _StakingAddress,
            ethers.utils.parseEther(valueToChage.toString()),
          ]);
          title += ` (Transfer WDA to Staking: ${valueToChage} WDA)`;
        } else if (stakeOrEcosystem == 1) {
          encodeBox = ifaceBox.encodeFunctionData("sendWDA", [
            _luckyTicketAddress,
            ethers.utils.parseEther(valueToChage.toString()),
          ]);
          title += ` (Transfer WDA to Ecosystem: ${valueToChage} WDA)`;
        }
      } else if (funct == 5) {
        // name: "Use BNB fund to buy depending on the amount of WDA on pancake",
        ifaceBox = new ethers.utils.Interface(_daoTresuryAbi);
        // value: "5",
        _boxAddress = _daoTresuryAddress;
        encodeBox = ifaceBox.encodeFunctionData("transferBNB", [
          _devAddress,
          ethers.utils.parseEther(BNBValue.toString()),
        ]);
        console.log(encodeBox);
        title += ` (Use BNB fund to buy depending on the amount of WDA on pancake: ${BNBValue.toString()} BNB)`;

        console.log(ethers.utils.parseEther(BNBValue.toString()));
      } else if (funct == 6) {
        //   name: "Sell depending on the amount of WDA on pancakes for BNB or USDT",
        //   value: "6",
        ifaceBox = new ethers.utils.Interface(_daoTresuryAbi);
        _boxAddress = _daoTresuryAddress;
        encodeBox = ifaceBox.encodeFunctionData("sendWDA", [
          _devAddress,
          ethers.utils.parseEther(valueToChage.toString()),
        ]);
        title += ` (Sell depending on the amount of WDA on pancakes for BNB or USDT: ${valueToChage.toString()})`;
      }
      let newDescriptionn = [];
      desscription?.map((item) => {
        let header = item?.header?.trim();
        let content = item?.content?.trim();
        // if (header?.length > 0 && content?.length > 0) {
        newDescriptionn.push({
          header,
          content,
        });
        // }
      });
      const infoDescription = JSON.stringify({
        title,
        newDescriptionn,
      });
      if (contract) {
        setIsDisable(true);
        setLoadingCreate(true);
        let BNB = BNBValue ? ethers.utils.parseEther(BNBValue.toString()) : 0;
        console.log(typeof BNB);
        console.table(
          "_boxAddress: " + _boxAddress,
          "\nBNBValue: " + BNB,
          "\nencodeBox: " + encodeBox,
          "\ninfoDescription: " + infoDescription
        );

        const address = await walletConnect.getAddress();
        await Promise.all([
          await provider.getBlock(),
          await contract.getBlockToPropose(address),
        ]).then(async (res) => {
          if (Number(res[2]?.toString()) > res[1].number) {
            setIsCreate(true);
            return;
          }
        });
        if (isCreate) return;
        await contract
          .propose(_boxAddress, 0, encodeBox, infoDescription)
          .then(async (res) => {
            await res.wait().then((res) => {
              window.scrollTo(0, 0);
              message.success("Create proposal success!");
              navigate("/dao-proposals");
            });
          })
          .catch((error) => {
            message.error(error?.data?.message || error.message);
            console.log(error);
            setIsDisable(false);
            setLoadingCreate(false);
          });
      }
    } catch (error) {
      console.log(error);
      message.error(error?.data?.message || error.message);
      setIsDisable(false);
      setLoadingCreate(false);
    }
  };

  return done && !walletConnect ? (
    navigate("/dao-proposals")
  ) : (
    // <ComingSoon />
    <Fragment>
      <section
        className="section"
        id="section-dao-create-proposal"
        data-aos="fade-up"
      >
        <FadeAnimationOdd />
        <Container>
          <div className="module-header text-center" id="header-checkscroll">
            Create Proposal
          </div>
          <Row justify="center">
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={11}
              className="list-description-proposals"
            >
              <Form layout="vertical" onFinish={onFinish}>
                <p className="module-title">1. Basic Information</p>
                <Form.Item name="title" label="Proposal Title">
                  <div className="c2i-form-group">
                    <div className="c2i-form-control">
                      <Input
                        width="100%"
                        type="text"
                        placeholder="Enter proposal’s title.."
                      />
                    </div>
                  </div>
                </Form.Item>
                <Form.Item label="Function" name="function">
                  <div id="proposal-select-data">
                    <Select
                      placeholder="Select proposal’s function.."
                      onChange={onchangeSelectBox}
                      getPopupContainer={() =>
                        document.querySelector("#proposal-select-data")
                      }
                    >
                      {dataSelectFunction?.map((item, index) => (
                        <Option key={index} value={item.value}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Form.Item>
                {[1, 2, 3].includes(parseInt(activeFunction)) && (
                  <Form.Item label="Type" name="upAndDown">
                    <Select placeholder="Select type..">
                      <Option value={0}>Decreasing</Option>
                      <Option value={1}>Increasting</Option>
                    </Select>
                  </Form.Item>
                )}
                {[4].includes(parseInt(activeFunction)) && (
                  <Form.Item label="choose" name="stakeOrEcosystem">
                    <Select placeholder="Select type..">
                      <Option value={0}>To Staking</Option>
                      <Option value={1}>To Ecosystem Rewards</Option>
                    </Select>
                  </Form.Item>
                )}
                {[5].includes(parseInt(activeFunction)) && (
                  <Form.Item label="BNB Value" name="BNBValue">
                    <div className="c2i-form-group">
                      <div className="c2i-form-control">
                        <Input
                          width="100%"
                          type="number"
                          placeholder="Enter value.."
                        />
                      </div>
                    </div>
                  </Form.Item>
                )}
                {[1, 2, 3, 4, 6].includes(parseInt(activeFunction)) && (
                  <Form.Item label="Value to Change" name="ValueChange">
                    <div className="c2i-form-group">
                      <div className="c2i-form-control">
                        <Input
                          width="100%"
                          type="number"
                          placeholder="Enter value.."
                        />
                      </div>
                    </div>
                  </Form.Item>
                )}
                <p className="module-title">2. Description</p>
                <Form.List name="description">
                  {(fields, { add, remove }) => (
                    <>
                      {fields?.map(({ key, name, ...restField }) => (
                        <div className="description" key={key}>
                          <MinusCircleOutlined
                            style={{
                              color: "white",
                              display: "flex",
                              justifyContent: "end",
                            }}
                            onClick={() => remove(name)}
                          />
                          <Form.Item
                            label={"Header " + (key + 1)}
                            name={[name, "header"]}
                            {...restField}
                          >
                            <div className="c2i-form-group">
                              <div className="c2i-form-control">
                                <Input
                                  min={0}
                                  max={250}
                                  width="100%"
                                  type="text"
                                  placeholder={"Proposal’s Header " + (key + 1)}
                                />
                              </div>
                            </div>
                          </Form.Item>
                          <Form.Item
                            label={"Content " + (key + 1)}
                            name={[name, "content"]}
                            {...restField}
                          >
                            <div className="c2i-form-group">
                              <div className="c2i-form-control">
                                <TextArea
                                  placeholder="Autosize height with minimum and maximum number of lines"
                                  autoSize={{ minRows: 8, maxRows: 8 }}
                                />
                              </div>
                              <div style={{ margin: "141px 0px" }}></div>
                            </div>
                          </Form.Item>
                        </div>
                      ))}
                      <Form.Item>
                        <Button
                          style={{ width: "100%" }}
                          onClick={() => add()}
                          block
                        >
                          + Add description
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <p className="module-line"></p>
                <Form.Item className="float-right">
                  <Button
                    htmlType="submit"
                    disabled={isDisable}
                    loading={loadingCreate}
                  >
                    {isCreate ? (
                      <span>Already created</span>
                    ) : (
                      <span>Create Proposal</span>
                    )}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}
export default CreateProposal;
