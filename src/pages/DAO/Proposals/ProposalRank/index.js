import {
  Button,
  Col,
  Empty,
  Image,
  message,
  Pagination,
  Row,
  Space,
  Spin,
  Tag,
} from "antd";
import _ from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { useNavigate } from "react-router-dom";
import BaseHelper from "src/utils/BaseHelper";
import * as MoralisQuery from "src/utils/MoralisQuery";
import iconFile from "./../../../../assets/images/landingPage/iconFile.svg";
/**
 * @AUTHOR DO VAN HUNG C2I
 */
function ProposalIdea(props) {
  /**
   * *HOOK
   */
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [listRank, setListRank] = useState([]);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listMoralistRank, setListMoralistRank] = useState(null);
  const [stateFinal, setstateFinal] = useState();
  const [proposalId, setProposalId] = useState();
  let listtempMoralisRank = [];
  let list = [];
  /**
   * *EXTEND FROM PARENT
   */

  const { fetch } = useMoralisCloudFunction(
    "resetVoteCast",
    {
      proposalId,
    }
    // { autoFetch: false }
  );

  const clearVote = async () => {
    await fetch({
      onSuccess: (data) => {
        // setListVoter(data);
      }, // ratings should be 4.5
    });
  };

  const {
    limitPage,
    contract,
    changeTabProposal,
    currentTab,
    walletConnect,
    setShowPopupWallet,
  } = props;

  //Change Data When Change Tab
  useEffect(() => {
    if (contract) {
      setLoading(false);
    }
  }, [listRank]);
  useEffect(() => {
    if (walletConnect) {
      setDisable(false);
    }
  }, [walletConnect]);
  useEffect(async () => {
    try {
      setLoading(true);
      const res = await MoralisQuery.makeQueryBuilder("FinalProposals").first();
      const finalProposalId = res?.attributes?.finalProposalId;
      let stateFinal;
      if (finalProposalId) stateFinal = await contract.state(finalProposalId);
      let count = 0;
      setstateFinal(stateFinal);
      await recursiveLoadData(finalProposalId, count);
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  }, [currentTab]);
  useEffect(() => {
    const init = async () => {
      if (currentTab != 1) return;
      if (!listMoralistRank) {
        return;
      }
      if (contract) {
        var checkIsAcitveFinal = true;

        if (stateFinal == 0 || stateFinal == 2) {
          checkIsAcitveFinal = false;
        }
        // Check isFinalActive? and filter ProposalFinalID
        let _res = listMoralistRank;

        if (!_res) return;
        if (_res?.length == 0) {
          setListRank([]);
          return;
        }
        fetchDataByTab(_res, [0, 3], checkIsAcitveFinal);
      }
    };

    init();
  }, [contract, currentTab, listMoralistRank]);

  const fetchDataByTab = (res, filter, checkIsAcitveFinal) => {
    //CASE TAB IDEA
    Promise.all([
      res.map(async (item) => {
        let checkError, id, state, rate, title;
        checkError = false;
        //id
        id = item.attributes.proposalId;
        //state
        state = await contract.state(id);
        // rate
        rate = await contract.proposalForRate(id);
        rate = await rate?.toString();
        //title
        try {
          let info = JSON.parse(item.attributes.description);
          checkError = true;
          title = info?.title;
        } catch (error) {
          checkError = false;
        }
        // create at
        //proposal{id,state,rate,title,createAt}
        //filter by state
        if (filter.includes(state) && checkError)
          // console.table({ id, state, rate, title, checkIsAcitveFinal });
          return { id, state, rate, title, checkIsAcitveFinal };
        else {
          console.log("not state active and queded");
          console.log(id);
        }
        //when run over for loop => set list proposal
      }),
    ])
      .then(async (res) => {
        await Promise.all(
          res[0].map(async (data) => {
            return await data;
          })
        ).then((res) => {
          const _lstProposal = _.orderBy(
            res.filter((item) => item),
            ["state", "rate"],
            ["desc", "desc"]
          );
          setListRank(_lstProposal);
        });
      })
      .catch((error) => {
        console.log(error);
        message.error(error);
        setLoading(false);
      });
  };
  const recursiveLoadData = async (finalProposalId, count) => {
    list = await MoralisQuery.makeQueryBuilder("Proposals", 100, count * 100, {
      key: "asc",
      value: "createdAt",
    })
      .notContainedIn("proposalId", [finalProposalId])
      .find();
    listtempMoralisRank = [...listtempMoralisRank, ...list];
    if (list.length == 100) {
      count++;
      await recursiveLoadData(finalProposalId, count);
    } else {
      setListMoralistRank(listtempMoralisRank);
    }
  };
  /**
   * *FUNCTION UTILS
   */
  //Redirect to ProposalDetail
  const handleRedirectDetail = (id) => {
    navigate("proposal-detail/" + id);
  };
  const setProposalFinal = async () => {
    if (!walletConnect) {
      setShowPopupWallet(true);
      return;
    }
    if (contract) {
      setDisable(true);
      try {
        const setFinal = await contract.setFirstFinalProposal();
        setFinal.wait().then(() => {
          message.success("Set Final success");
          changeTabProposal("2");
          clearVote();
        });
      } catch (error) {
        setDisable(false);
        message.error(error?.message);
      }
    }
  };

  /**
   * *FUNCTION UTILS
   */
  // const clearState = async () => {
  //   try {
  //     setDisableClearState(true);
  //     const ratings = await Moralis.Cloud.run("FilterProposalRank");
  //     console.log(ratings);
  //     if (ratings) {
  //       message.success("clear success");
  //       setDisableClearState(false);
  //     }
  //   } catch (error) {
  //     setDisableClearState(false);
  //     console.log(error);
  //   }
  // };
  return loading ? (
    <Spin />
  ) : (
    <Fragment>
      {/* {walletConnect &&
        address == "0x80474c4703e16E2deC76d46B47f41DBB409c3bC2" && (
          <Button
            onClick={clearState}
            loading={disableClearState}
            disabled={disableClearState}
          >
            Clear state moralis
          </Button>
        )} */}
      <div className="propsal-content">
        <Space direction="vertical" size={20}>
          {listRank
            ?.slice(
              limitPage * (currentPage - 1),
              limitPage * (currentPage - 1) + limitPage
            )
            .map((item, index) => {
              let state = BaseHelper.getState(item.state);
              return (
                <Space direction="vertical" size={20} key={index}>
                  <Row justify="space-between">
                    <Tag className={"ant-" + state}>{state}</Tag>
                    {item.state == 3 &&
                      (currentPage - 1) * limitPage + (index + 1) == 1 &&
                      item.checkIsAcitveFinal == true && (
                        <Button
                          loading={disable}
                          disabled={disable}
                          onClick={() => {
                            setProposalId(item.id);
                            setProposalFinal();
                          }}
                          style={{
                            padding: "4px 12px",
                          }}
                        >
                          Final
                        </Button>
                      )}
                  </Row>
                  <Row justify="space-between" align="middle">
                    <Col xs={20}>
                      <div className="text-title">
                        #
                        {(currentPage - 1) * limitPage +
                          (index + 1) +
                          " " +
                          item.title}
                      </div>
                      <div className="text-sub">
                        #{BaseHelper.shortTextAdress(item.id)}
                      </div>
                    </Col>

                    <Col xs={4} style={{ textAlign: "end" }}>
                      <Image
                        src={iconFile}
                        preview={false}
                        onClick={() => {
                          handleRedirectDetail(item.id);
                        }}
                      ></Image>
                    </Col>
                  </Row>
                  <div className="module-line"></div>
                </Space>
              );
            })}
          {listRank?.length == 0 && <Empty />}
        </Space>
      </div>
      {listRank?.length > 0 && (
        <Space direction="vertical" className="pagination" align="center">
          <Pagination
            defaultCurrent={currentPage}
            pageSize={limitPage}
            onChange={(e) => {
              setCurrentPage(e);
              window.scrollTo(0, 0);
            }}
            total={listRank.length}
          />
        </Space>
      )}
    </Fragment>
  );
}
export default React.memo(ProposalIdea);
