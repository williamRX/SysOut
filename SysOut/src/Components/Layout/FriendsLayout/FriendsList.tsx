import type { FC } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import React from "react";
import { Avatar, List, Skeleton, Button } from "antd";
import ChannelLayout from './ChannelLayout';
import ChatLayout from '../ChatLayout'; // Import ChatLayout component
import { useNavigate } from 'react-router-dom';

// Inside your component


const FriendsList: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [listData, setListData] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [showFriendsLayout, setShowFriendsLayout] = useState(true); // Add state for showing/hiding FriendsLayout
  const [showChatLayout, setShowChatLayout] = useState(false); // Add state for showing/hiding ChatLayout

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getAllFriends", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const updatedFriends = friends.concat(response.data);
        setFriends(updatedFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (friends.length > 0) {
      const fetchUserInformation = async () => {
        setLoading(true);
        try {
          const uniqueFriends = Array.from(new Set(friends)); // Remove duplicates from friends array
          const responses = await Promise.all(
            uniqueFriends.map((friend) =>
              axios.get(`http://localhost:5000/api/userPublicInfo/${friend}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
            )
          );
          const listData = responses.map((response) => ({
            href: response.data.user.username,
            title: response.data.user.username,
            avatar: response.data.user.pfp,
            description: response.data.user.bio,
            content: "hi",
            backgroundImg: response.data.user.cover,
            link: response.data.user.link,
          })).filter((item) => item.title !== localStorage.getItem("username")); // Filter out the current user
          setListData(listData);
        } catch (error) {
          console.error("Error fetching user information:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserInformation();
    }
  }, [friends]);

  const handleButtonClick = (receiver: string) => {
    window.location.href = `/FriendMsg?initialSelectedReceiver=${encodeURIComponent(receiver)}`;
  };

  const renderContent = () => {
    return (
      showChatLayout && <ChatLayout key={selectedReceiver} selectedReceiver={selectedReceiver} />
    );
  };

  const addFriend = () => {
    axios
      .post(
        "http://localhost:5000/api/addFriend",
        { friendUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Friend added", response.data);
        setFriends([...friends, friendUsername]);
      })
      .catch((error) => {
        console.error("Error adding friend:", error);
      });
  };

  return (
    <div style={{ maxWidth: "100vh", overflow: "auto" }}>
      {loading && <Skeleton active />}
      {showFriendsLayout && ( // Show FriendsLayout only if showFriendsLayout is true
        <List
          itemLayout="vertical"
          size="large"
          dataSource={listData}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={
                !loading
                  ? [
                      <Button type="primary" href="#" onClick={() => handleButtonClick(item.title)}>
                        Message
                      </Button>
                    ]
                  : undefined
              }
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
      )}
      {renderContent()} {/* Render ChatLayout component */}
    </div>
  );
};

export default FriendsList;
