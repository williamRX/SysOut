import React, { useContext, useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Button from "../Style/button/index";
import Layout from "../Style/layout/index";
import Menu from "../Style/menu/index";
import theme from "../Style/theme/index";
import { AuthContext } from "../Form/AuthContext";
import DisconnectButton from "../Form/Disconnect";
import axios from "axios";
import ChatLayout from "./ChatLayout";
import FriendLayout from "./FriendsLayout/FriendsLayout";
import Sidebar from './Sidebar';
import ChannelLayout from './ChannelLayout';
import { useLocation } from 'react-router-dom';


const { Header, Sider, Content } = Layout;


const App: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSelectedReceiver = queryParams.get('initialSelectedReceiver');
  const { isAuthenticated } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("0");
  const [menuItems, setMenuItems] = useState([]);
  const [collapsed2, setCollapsed2] = useState<boolean>(false);
  const [isCreatingChannel, setIsCreatingChannel] = useState<boolean>(false);
  const [newChannelName, setNewChannelName] = useState<string>("");
  const [channelItems, setChannelItems] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState(false);
  const [usernameInputValue, setUsernameInputValue] = useState("");
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [joinChannelName, setJoinChannelName] = useState("");
  const [isJoinChannelInputVisible, setIsJoinChannelInputVisible] =
    useState(false);
  const [recipientId, setRecipientInfo] = useState<number | null>(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/connectForm";
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (initialSelectedReceiver) {
      setSelectedReceiver(initialSelectedReceiver);
      console.log(selectedReceiver);
    }
  }, [initialSelectedReceiver]);
  const markMessagesAsRead = async (selectedItem: { label: string }) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Get the user ID from the username
        const response = await axios.get(
          `http://localhost:5000/api/userPublicInfo/${selectedItem.label}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userId = response.data.user._id;

        // Mark the messages as read
        await axios.put(
          `http://localhost:5000/api/markMessagesAsRead/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Messages marked as read");
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const handleJoinChannelButtonClick = () => {
    setIsJoinChannelInputVisible(!isJoinChannelInputVisible);
  };

  const handleJoinChannelInputChange = (e) => {
    setJoinChannelName(e.target.value);
  };
  
  const selectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setSelectedKey("channel");
  };

  const joinChannel = async () => {
    if (joinChannelName.length > 0) {
      setIsJoinChannelInputVisible(false);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.post(
            `http://localhost:5000/api/addSomeoneInChannel`,
            { name: joinChannelName },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            console.log(`Joined channel: ${joinChannelName}`);
            setJoinChannelName("");
            // Re-fetch the channels after a new one is joined
            const channels = await getChannels();
            setChannelItems(channels);
          } else {
            console.error("Error joining channel:", response);
          }
        }
      } catch (error) {
        if ((error as any).response && (error as any).response.status === 404) {
          alert("This channel does not exist.");
        } else {
          console.error("Error joining channel:", error);
        }
      }
    }
  };

  const getMessagesBetweenUsers = async (otherUsername: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/userPublicInfo/${otherUsername}`
        );

          const response2 = await axios.get(
            `http://localhost:5000/api/getPrivateMessages/${response.data.user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        // Filter unread messages
        const currentUser = localStorage.getItem("username");
        const unreadMessages = response2.data.messages.filter(
            (message: { read: boolean, from: { username: string; }; }) => !message.read
           && message.from.username !== currentUser);

        // Return messages and unreadCount
        return {
          messages: response2.data.messages,
          unreadCount: unreadMessages.length,
        };
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };


  const handleCreateChannel = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/createChannel",
          {
            name: newChannelName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //console.log(response.status);
        if (response.status === 200 || response.status === 201) {
          setIsCreatingChannel(false);
          setNewChannelName("");
          // Re-fetch the channels after a new one is created
          const channels = await getChannels();
          setChannelItems(channels);
        } else {
          console.error("Error creating channel:", response);
        }
      } catch (error) {
        if ((error as any).response && (error as any).response.status === 400) {
          alert("Ce nom de channel existe déjà. Veuillez en choisir un autre.");
        }
        console.error("Error creating channel:", error);
      }
    }
  };

  useEffect(() => {
    // Supposons que getChannels est une fonction qui récupère les channels d'une API
    const fetchChannels = async () => {
      const channels = await getChannels();

      setChannelItems(channels);
    };

    fetchChannels();
  }, []);

  const getChannels = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Now use the userId to get the channels
        const response = await axios.get(
          `http://localhost:5000/api/allChannels`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map over the response data to get the name of each channel
        const channelNames = response.data.map((channel: any) => channel.name);

        return channelNames;
      } catch (error) {
        console.error("Error getting channels:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/lastMessages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          const yourList = response.data;
          const items = await Promise.all(
            yourList.map(async (item, index) => {
              const { messages, unreadCount } = (await getMessagesBetweenUsers(
                item.name
              )) as { messages: any; unreadCount: any };

              // Check if the user has a profile picture (pfp)
              const hasPfp = item.pfp !== undefined && item.pfp !== null;

              return {
                key: index.toString(),
                icon: hasPfp ? (
                  <div style={{ width: '4vh', height: '4vh', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={item.pfp} alt="Profile Picture" style={{ width: '100%', height: '100%' }} />
                  </div>
                ) : (
                  <UserOutlined />
                ),
                label: item.name,
                messages: messages,
                unreadCount: unreadCount, // Store unreadCount in each item
              };
            })
          );

          setMenuItems(items);
        })
        .catch((error) => {
          console.error("Error fetching last messages:", error);
        });
    }
  }, []);

  const getUserInfo = async (username: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/userPublicInfo/${username}`
      );
      console.log("User info:", response.data);

      if (!response.data.user) {
        // L'utilisateur n'existe pas, vous pouvez gérer cela comme une erreur 404
        throw {
          response: {
            status: 404,
            data: { message: "Utilisateur non trouvé." },
          },
        };
      }

      return response.data.user._id;
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 404) {
        // Gérer l'erreur 404 ici (utilisateur non trouvé)
        console.error(
          "Utilisateur non trouvé:",
          (error as any).response.data.message
        );
        alert(
          "L'utilisateur n'existe pas. Veuillez saisir un nom d'utilisateur valide."
        );
      } else {
        // Gérer d'autres erreurs
        console.error(
          "Erreur lors de la vérification de l'utilisateur:",
          error
        );
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }

      throw error; // Vous pouvez choisir de rejeter l'erreur pour une gestion plus approfondie
    }
  };

  const handleUsernameButtonClick = () => {
    setIsUsernameInputVisible(!isUsernameInputVisible);
  };

  const handleUsernameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsernameInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      // Obtenir les informations publiques de l'utilisateur
      const userInfo = await getUserInfo(usernameInputValue);
      // L'utilisateur existe, vous pouvez créer le chat
      setSelectedReceiver(usernameInputValue);
      setUsernameInputValue("");
      setIsUsernameInputVisible(false);
    } catch (error) {
      // Gérez les erreurs de la requête (connexion perdue, etc.)
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
  };

  const renderContent = () => {
    if (selectedReceiver === null || selectedKey === "friend" || selectedKey === "channel") {
      return null; // Ou retournez un composant de remplacement
    }
  
    return (
      <ChatLayout key={selectedReceiver} selectedReceiver={selectedReceiver} />
    );
  };

  const renderFriendLayout = () => {
    if (selectedKey !== "friend") {
      return null;
    }

    return <FriendLayout index={0} />;
  };

  const renderChannelLayout = () => {
    if (selectedKey !== "channel") {
      return null;
    }
    console.log("Selected channel:", selectedChannelId);
    return <ChannelLayout key={selectedChannelId || ''} selectedChannel={selectedChannelId || ''} setSelectedChannel={setSelectedChannelId} />;
  }

  return (
    <Layout style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          onClick={async ({ key }) => {
            // Make the function async
                    setSelectedKey(key);
            const selectedItem = menuItems.find((item) => item.key === key);
            const newReceiver = selectedItem ? selectedItem.label : null;
            console.log("New selectedReceiver:", newReceiver);
            setSelectedReceiver(newReceiver);

            // Mark messages as read
            if (selectedItem) {
              console.log("Marking messages as read for:", selectedItem.label);
              await markMessagesAsRead(selectedItem); // Call the function and wait for it to finish
              selectedItem.unreadCount = 0; // Reset unreadCount

              // Update menuItems state
              setMenuItems((prevMenuItems) =>
                prevMenuItems.map((item) =>
                  item.key === key ? { ...item, unreadCount: 0 } : item
                )
              );
            }
          }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label} ({item.unreadCount} non lus)
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Sidebar menuItems={channelItems || []} selectChannel={selectChannel} /> 
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              backgroundColor: "orange",
            }}
          />
          <Button
            type="text"
            icon={<UserAddOutlined />}
            onClick={handleUsernameButtonClick}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              backgroundColor: "blue",
            }}
          />
          {isUsernameInputVisible && (
            <div>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={usernameInputValue}
                onChange={handleUsernameInputChange}
              />
              <Button type="primary" onClick={handleSendMessage}>
                Envoyer
              </Button>
            </div>
          )}
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => setIsCreatingChannel(!isCreatingChannel)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              backgroundColor: "red",
            }}
          />
          {isCreatingChannel && (
            <div>
              <input
                type="text"
                placeholder="Nom du channel"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
              />
              <Button type="primary" onClick={handleCreateChannel}>
                Créer
              </Button>
            </div>
          )}
          <Button
            type="text"
            icon={<UsergroupAddOutlined />} // Use the new icon
            onClick={handleJoinChannelButtonClick} // Handle click event
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              backgroundColor: "green",
            }}
          />
          {isJoinChannelInputVisible && (
            <div>
              <input
                type="text"
                placeholder="Nom du channel"
                value={joinChannelName}
                onChange={handleJoinChannelInputChange}
              />
              <Button type="primary" onClick={joinChannel}>
                Rejoindre
              </Button>
            </div>
          )}
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => setSelectedKey("friend")}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              backgroundColor: "orange",
            }}
          />
          <DisconnectButton />
        </Header>
        <Content
          style={{
            margin: "0",
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            color: "white",
            backgroundColor: "darkblue",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderContent()}
          <div style={{ flex: 2, maxWidth: "30vh", maxHeight: "30vh" }}>
            {renderFriendLayout()}
          </div>
          {renderChannelLayout()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
