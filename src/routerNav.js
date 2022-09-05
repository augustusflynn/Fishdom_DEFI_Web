import { Menu } from "antd";
const { SubMenu } = Menu;
export const navigations = [
  {
    type: "SubMenu",
    title: "Stake",
    childrent: [
      {
        type: "Item",
        title: "Stake WDA",
        path: "stake-wda",
      },
      // {
      //   type: "Item",
      //   title: "Mining CROWN",
      //   path: "stake-mining-crown",
      // },
      // {
      //   type: "Item",
      //   title: "Claim",
      //   path: "claim",
      // },
    ],
  },
  // {
  //   type: "SubMenu",
  //   title: "Products",
  //   childrent: [
  //     {
  //       type: "Item",
  //       title: "CROWN Lucky",
  //       path: "products-crown-lucky",
  //     },
  //     {
  //       type: "Item",
  //       title: "CROWN Auction",
  //       path: "products-crown-auction",
  //     },
  //     {
  //       type: "Item",
  //       title: "Lucky Ticket",
  //       path: "products-lucky-ticket",
  //     },
  //   ],
  // },
  // {
  //   type: "SubMenu",
  //   title: "DAO",
  //   childrent: [
  //     {
  //       type: "Item",
  //       title: "Proposals",
  //       path: "dao-proposals",
  //     },
  //   ],
  // },
  {
    type: "SubMenu",
    title: "Trade",
    childrent: [
      {
        type: "Item",
        title: "WinSwap",
        path: "trade-win-swap",
      },
      // {
      //   type: "Item",
      //   title: "WinMarket",
      //   path: "trade-win-market",
      // },
      {
        type: "Item",
        title: "Your collection",
        path: "your-collection",
      },
    ],
  },
  // {
  //   type: "SubMenu",
  //   title: "Resources",
  //   childrent: [
  //     {
  //       type: "Item",
  //       title: "Documents",
  //       redirect: "https://docs.windao.fi/",
  //     },
  //     {
  //       type: "Item",
  //       title: "Tokenomics",
  //       path: "resources-tokenomics",
  //     },
  //     {
  //       type: "Item",
  //       title: "FAQ",
  //       redirect: "https://docs.windao.fi/faq",
  //     },
  //   ],
  // },
  {
    type: "SubMenu",
    title: "About",
    childrent: [
      {
        type: "Item",
        title: "Team",
        path: "/about-team",
      },
      {
        type: "Item",
        title: "Partners & Investors",
        path: "about-team",
        hash: "section-partner",
      },
      // {
      //   type: "Item",
      //   title: "Audits",
      //   path: "/",
      //   hash: "section-audits",
      // },
    ],
  },
];

const getItem = (info, keySub) => {
  if (info.childrent && info.childrent.length > 0) {
    return (
      <SubMenu
        key={keySub}
        title={info.title}
        popupClassName="sub-menu-popup-top"
      >
        {info.childrent.map((item, key) => getItem(item, keySub + "-" + key))}
      </SubMenu>
    );
  }
  return <Menu.Item key={info.path}>{info.title}</Menu.Item>;
};

export function RenderNav(routes) {
  return routes.map((info, key) => getItem(info, key));
}
