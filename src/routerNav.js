import { Menu } from "antd";
const { SubMenu } = Menu;
export const navigations = [
  {
    type: "SubMenu",
    title: "Launch Game",
    path: process.env.REACT_APP_FISHDOM_GAME_URL,
    isURLOnly: true
  },
  {
    type: "SubMenu",
    title: "Staking",
    childrent: [
      {
        type: "Item",
        title: "Staking",
        path: "stake",
      },
      {
        type: "Item",
        title: "Claim",
        path: "claim",
      },
    ],
  },
  {
    type: "SubMenu",
    title: "Trade",
    childrent: [
      {
        type: "Item",
        title: "Swap",
        path: "trade-swap",
      },
      {
        type: "Item",
        title: "Market",
        path: "/",
      },
      {
        type: "Item",
        title: "Your collection",
        path: "your-collection",
      },
    ],
  },
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
      }
    ]
  },
];

const getItem = (info, keySub) => {
  if (info.isURLOnly) {
    return (
      <Menu.Item key={info.path} onClick={() => { window.open(info.path, '_blank') }}>{info.title}</Menu.Item>
    )
  }
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
