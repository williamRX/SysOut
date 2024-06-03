import React, { useState } from "react";
import FriendList from "../FriendsLayout/FriendsList";
import FriendRequest from "../FriendsLayout/FriendRequest";
import AddFriends from "./AddFriends";
import { Layout, Menu, theme } from 'antd';

const { Header } = Layout;

const items = new Array(3).fill(null).map((_, index) => {
  let label = "";
  if (index === 0) {
    label = "Friends";
  } else if (index === 1) {
    label = "Friend Requests";
  } else if (index === 2) {
    label = "Add Friends";
  }
  return {
    key: (index).toString(),
    label: label,
  };
});
const FriendLayout: React.FC<{ index?: number }> = ({ index }) => {
  const {
    token: {},
  } = theme.useToken();

  const [visibleFriendList, setVisibleFriendList] = useState(index === 0);
  const [visibleFriendRequest, setVisibleFriendRequest] = useState(false);
  const [visibleAddFriends, setVisibleAddFriends] = useState(false);
  console.log("visibleFriendList", visibleFriendList);
  console.log("index", index);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMenuClick = (event: any) => {
    console.log('Clicked on menu item:', event.key);
    switch (event.key) {
      case "0":
        setVisibleFriendList(true);
        setVisibleFriendRequest(false);
        setVisibleAddFriends(false);
        break;
      case "1":
        setVisibleFriendList(false);
        setVisibleFriendRequest(true);
        setVisibleAddFriends(false);
        break;
      case "2":
        setVisibleFriendList(false);
        setVisibleFriendRequest(false);
        setVisibleAddFriends(true);
        break;
      default:
        setVisibleFriendList(true);
        setVisibleFriendRequest(false);
        setVisibleAddFriends(false);
        break;
    }
  };

  return (
    <Layout style={{ height: "94.2vh", width: "118.59vh" }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['0']}
          onClick={handleMenuClick}  // Add onClick handler
          style={{ flex: 1, minWidth: 0 }}
        >
          {items.map(item => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
        </Menu>
      </Header>
      <div className="site-layout-content">
        {visibleFriendList && <FriendList />}
      </div>
      <div className="site-layout-content">
        {visibleFriendRequest && <FriendRequest />}
      </div>
      <div className="site-layout-content">
        {visibleAddFriends && <AddFriends />}
      </div>
    </Layout>
  );
}

export default FriendLayout;
