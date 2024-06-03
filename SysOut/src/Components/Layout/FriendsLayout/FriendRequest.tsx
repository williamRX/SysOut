import type { FC } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { LikeOutlined, MessageOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { Avatar, List, Skeleton, Button } from "antd";

interface IconTextProps {
  icon: typeof LikeOutlined | typeof MessageOutlined | typeof StarOutlined;
  text: React.ReactNode;
}

const FriendRequest: FC = () => {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [listData, setListData] = useState([]);

  const IconText: React.FC<IconTextProps> = ({ icon, text }) => (
    <>
      {React.createElement(icon, { style: { marginRight: 8 } })}
      {text}
    </>
  );

  const acceptFriendRequest = (friendUsername: string) => {
    axios
      .post("http://localhost:5000/api/acceptFriendRequest", {
        friendUsername,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response: { data: any }) => {
        console.log(response.data);
        // Remove the accepted friend from the friends list
        const updatedFriends = friends.filter((friend: { username: string }) => friend.username !== friendUsername);
        setFriends(updatedFriends);
        // Remove the accepted friend from the listData
        const updatedListData = listData.filter((item: { title: string }) => item.title !== friendUsername);
        setListData(updatedListData);
      })
      .catch((error: any) => {
        console.error("Error accepting friend request:", error);
      });
  };

  const refuseFriendRequest = (friendUsername: string) => {
    axios
      .post("http://localhost:5000/api/refuseFriendRequest", {
        friendUsername,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response: { data: any }) => {
        console.log(response.data);
        // Remove the refused friend from the friends list
        const updatedFriends = friends.filter((friend: { username: string }) => friend.username !== friendUsername);
        setFriends(updatedFriends);
        // Remove the refused friend from the listData
        const updatedListData = listData.filter((item: { title: string }) => item.title !== friendUsername);
        setListData(updatedListData);
      })
      .catch((error: any) => {
        console.error("Error refusing friend request:", error);
      });
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getFriendRequest", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const updatedFriends = friends.concat(response.data);
        setFriends(updatedFriends);

        const responses = await Promise.all(
          updatedFriends
            .filter((friend: { accepted: boolean }) => friend.accepted === false)
            .map((friend: { username: string }) =>
              axios.get(
                `http://localhost:5000/api/userPublicInfo/${friend.username}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
            )
        );

        const listData = responses.map((response) => ({
          href: response.data?.user?.username,
          title: response.data?.user?.username,
          avatar: response.data?.user?.pfp,
          description: response.data?.user?.bio,
          content: "hi",
          backgroundImg: response.data?.user?.cover,
          link: response.data?.user?.link,
        }));
        setListData(listData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriendRequests();
    console.log("Friends:", friends);
  }, []);

  return (
    <div style={{ maxWidth: "100vh", overflow: "auto" }}>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        renderItem={(item: { title: string }) => (
          <List.Item
            key={item.title}
            actions={[
              !loading && (
                <>
                  <Button type="primary" href={item.link} onClick={() => acceptFriendRequest(item.title)}>
                    Accept
                  </Button>
                  <Button type="dashed" href={item.link} onClick={() => refuseFriendRequest(item.title)}>
                    Refuser
                  </Button>
                </>
              ),
            ]}
            extra={
              !loading && (
                <img
                  width={500}
                  height={150}
                  alt="logo"
                  src={item.backgroundImg}
                />
              )
            }
          >
            <Skeleton loading={loading} active avatar>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} size={80} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              {item.content}
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
};

export default FriendRequest;
