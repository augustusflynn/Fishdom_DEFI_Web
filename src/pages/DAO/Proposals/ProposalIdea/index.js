import {
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
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseHelper from "src/utils/BaseHelper";
import * as MoralisQuery from "src/utils/MoralisQuery";
import iconFile from "./../../../../assets/images/landingPage/iconFile.svg";
/**
 * @AUTHOR DO VAN HUNG C2I
 */
function ProposalIdea({ limitPage, contract, currentTab, setShowPopupWallet }) {
  /**
   * *HOOK
   */

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [listIdea, setListIdea] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countList, setCountList] = useState(0);
  /**
   * *EXTEND FROM PARENT
   */
  useEffect(() => {
    contract && setLoading(false);
  }, [listIdea]);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let res;
      if (!contract) return;
      const query = MoralisQuery.makeQueryBuilder(
        "Proposals",
        limitPage, // 5
        limitPage * (currentPage - 1),
        { key: "desc", value: "createdAt" }
      );
      res = await query.find();
      if (!res || res?.length == 0) {
        setListIdea([]);
        return;
      }
      fetchDataByTab(res);
      setCountList(await query.count("Proposals"));
    };
    init();
  }, [contract, currentPage, currentTab]);
  //setup date from moralist

  ///fetch data
  const fetchDataByTab = async (res) => {
    //CASE TAB IDEA
    Promise.all([
      res?.map(async (item) => {
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
        if (checkError) return { id, state, title };
      }),
    ])
      .then(async (res) => {
        const data = await Promise.all(res[0].map(async (data) => await data));
        setListIdea(data);
      })
      .catch((error) => {
        console.log(error);
        message.error(error);
        setLoading(false);
      });
  };
  //Redirect to ProposalDetail
  const handleRedirectDetail = (id) => {
    navigate("proposal-detail/" + id);
  };

  return loading ? (
    <Spin />
  ) : (
    <Fragment>
      <div className="propsal-content">
        <Space direction="vertical" size={20}>
          {listIdea?.map((item, index) => {
            let state = BaseHelper.getState(item.state);
            return (
              <Space direction="vertical" size={20} key={index}>
                <Tag className={"ant-" + state}>{state}</Tag>
                <Row justify="space-between" align="middle">
                  <Col xs={20}>
                    <div className="text-title">{item.title}</div>
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
          {listIdea?.length == 0 && <Empty />}
        </Space>
      </div>
      {listIdea?.length > 0 && (
        <Space direction="vertical" className="pagination" align="center">
          <Pagination
            defaultCurrent={currentPage}
            pageSize={limitPage}
            onChange={(e) => {
              setCurrentPage(e);
              window.scrollTo(0, 0);
            }}
            total={countList}
          />
        </Space>
      )}
    </Fragment>
  );
}
export default React.memo(ProposalIdea);
