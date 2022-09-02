import { Empty, Pagination, Space, Tabs } from "antd";
import FadeAnimationOdd from "src/layout/fadeAnimation/FadeAnimationOdd";
import Container from "src/layout/grid/Container";
import HistoryHavest from "./HistoryHavest/index";
import * as MoralisQuery from "src/utils/MoralisQuery";
import { useEffect, useState } from "react";
import HistoryMining from "./HistoryMining/index";
import IconWallet from "./../../../../assets/png/topbar/icon-wallet-white.svg";

const { TabPane } = Tabs;
const LIMIT_DISPLAY_ITEM = 6;

function History({
  CrownContract,
  history,
  newMining,
  walletConnect,
  showWallet,
}) {
  const [skip, setSkip] = useState(0);
  const [tabKey, setTabKey] = useState("1");
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState();

  const [listHistoryHavestData, setListHistoryHavestData] = useState({
    data: null,
    count: 0,
  });
  const [listHistoryMiningData, setListHistoryMiningData] = useState({
    data: null,
    count: 0,
  });

  useEffect(() => {
    history.current = setTabKey;
  }, []);
  useEffect(async () => {
    if (walletConnect) {
      const address = await walletConnect.getAddress();
      setAddress(address);
    }
  }, [walletConnect]);

  useEffect(async () => {
    if (address) {
      try {
        await handleFetchData("HistoryMining", skip);
      } catch (error) {
        console.log(error);
      }
    }
  }, [tabKey, newMining, address]);

  const handleFetchData = async (tableName, skip) => {
    setLoading(true);
    const query = MoralisQuery.makeQueryBuilder(
      tableName,
      LIMIT_DISPLAY_ITEM,
      skip
    ).equalTo("owner", address?.toLowerCase());
    const data = await query.find();
    const count = await query.count();
    if (tableName === "HavestMining") {
      setListHistoryHavestData({
        data,
        count,
      });
    } else {
      setListHistoryMiningData({
        data,
        count,
      });
    }
  };
  return (
    <section className="section" id="section-stake-history" data-aos="fade-up">
      <FadeAnimationOdd />
      <Container>
        <div className="module-header text-center">History</div>
        {!walletConnect ? (
          <div className="wallet-button" onClick={showWallet}>
            <img src={IconWallet} />
            <span> Connect Wallet </span>
          </div>
        ) : (
          <Tabs
            type="card"
            activeKey={tabKey}
            onChange={(key) => {
              handleFetchData(
                key === "1" ? "HistoryMining" : "HavestMining",
                0
              );
              setTabKey(key);
              skip > 0 && setSkip(0);
            }}
          >
            <TabPane tab="Mining" key="1">
              <HistoryMining
                {...{ loading, setLoading }}
                CrownContract={CrownContract}
                data={listHistoryMiningData.data}
                count={listHistoryMiningData.count}
                tabKey={tabKey}
                handleFetchData={handleFetchData}
                setSkip={setSkip}
              />
            </TabPane>
            <TabPane tab="Havest" key="2">
              <HistoryHavest
                {...{ loading, setLoading }}
                CrownContract={CrownContract}
                data={listHistoryHavestData.data}
                count={listHistoryHavestData.count}
                tabKey={tabKey}
                handleFetchData={handleFetchData}
                setSkip={setSkip}
              />
            </TabPane>
          </Tabs>
        )}
      </Container>
    </section>
  );
}

export default History;
