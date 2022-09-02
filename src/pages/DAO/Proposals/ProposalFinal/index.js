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
import { ethers } from "ethers";
import { toUtf8Bytes } from "ethers/lib/utils";
import _ from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseHelper from "src/utils/BaseHelper";
import * as MoralisQuery from "src/utils/MoralisQuery";
import iconFile from "./../../../../assets/images/landingPage/iconFile.svg";
/**
 * @AUTHOR DO VAN HUNG C2I
 */
function ProposalFinal(props) {
  /**
   * *HOOK
   */
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [listFinal, setListFinal] = useState([]);
  const [disable, setDisable] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disableClearState, setDisableClearState] = useState(false);

  /**
   * *EXTEND FROM PARENT
   */
  const { limitPage, contract, currentTab, walletConnect, setShowPopupWallet } =
    props;

  //Change Data When Change Tab
  useEffect(() => {
    if (contract) {
      setLoading(false);
    }
  }, [listFinal]);
  useEffect(() => {
    if (currentTab != 2) return;
    const init = async () => {
      setLoading(true);
      if (!contract) return;
      const resFinal = await MoralisQuery.makeQueryBuilder(
        "FinalProposals"
      ).find();
      const res = await MoralisQuery.makeQueryBuilder("Proposals")
        .containedIn(
          "proposalId",
          resFinal.map((item) => {
            return item.attributes.finalProposalId;
          })
        )
        .find();
      if (!res) return;
      if (res?.length == 0) {
        setListFinal([]);
        return;
      }
      fetchDataByTab(res, [0, 2, 5]);
    };
    init();
  }, [contract, loadData, currentTab]);

  const fetchDataByTab = (res, filter) => {
    //CASE TAB IDEA
    Promise.all([
      res.map(async (item) => {
        let checkError, id, state, title;
        checkError = false;
        id = item.attributes.proposalId;
        state = await contract.state(id);
        try {
          let info = JSON.parse(item.attributes.description);
          checkError = true;
          title = info?.title;
        } catch (error) {
          checkError = false;
        }
        //filter by state
        if (filter.includes(state) && checkError) return { id, state, title };
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
            ["state"],
            ["asc"]
          );
          setListFinal(_lstProposal);
        });
      })
      .catch((error) => {
        console.log(error);
        message.error(error);
      });
  };

  //Set Proposal Excute
  const setProposalExcute = async (proposalId) => {
    if (!walletConnect) {
      setShowPopupWallet(true);
      return;
    }
    if (contract) {
      try {
        setDisable(true);
        let values;
        const x = await MoralisQuery.makeQueryBuilder("Proposals")
          .equalTo("proposalId", proposalId)
          .first();
        var descriptionHash = ethers.utils.keccak256(
          toUtf8Bytes(x.attributes.description)
        );
        const excute = await contract.execute(
          x.attributes.targets,
          0,
          x.attributes.calldatas,
          descriptionHash
        );
        excute
          .wait()
          .then(() => {
            message.success("Excute success");
            setLoadData(true);
          })
          .catch((eror) => {
            console.log(eror);
          });
      } catch (error) {
        setDisable(false);
        message.error(error?.message);
      }
    }
  };
  //Redirect to ProposalDetail
  const handleRedirectDetail = (id) => {
    navigate("proposal-detail/" + id);
  };

  // const clearState = async () => {
  //   try {
  //     setDisableClearState(true);
  //     const ratings = await Moralis.Cloud.run("FilterProposalFinal");
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
          {listFinal
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
                    {item.state == 2 && (
                      <Button
                        loading={disable}
                        disabled={disable}
                        onClick={() => {
                          setProposalExcute(item.id);
                        }}
                        style={{
                          padding: "4px 12px",
                        }}
                      >
                        Excute
                      </Button>
                    )}
                  </Row>
                  <Row justify="space-between" align="middle">
                    <Col xs={20}>
                      <div className="text-title">#{" " + item.title}</div>
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
          {listFinal?.length == 0 && <Empty />}
        </Space>
      </div>
      {listFinal?.length > 0 && (
        <Space direction="vertical" className="pagination" align="center">
          <Pagination
            defaultCurrent={currentPage}
            pageSize={limitPage}
            onChange={(e) => {
              setCurrentPage(e);
              window.scrollTo(0, 0);
            }}
            total={listFinal.length}
          />
        </Space>
      )}
    </Fragment>
  );
}
export default React.memo(ProposalFinal);
