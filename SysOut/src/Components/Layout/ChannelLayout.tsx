/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import socketIOClient, { Socket } from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:8081";

interface ChannelLayoutProps {
  selectedChannel: string;
  setSelectedChannel: (channelId: string) => void;
}

const ChannelLayout: React.FC<ChannelLayoutProps> = ({ selectedChannel, setSelectedChannel }) => {
  const [connectedUser, setConnectedUser] = useState<string>("");
  const [messages, setMessages] = useState<{ content: string; from: string; pfp?: string }[]>([]); // Modified pfp property to be optional
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messageInput, setMessageInput] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>({});
  const [channels, setChannels] = useState<any[]>([]); // New state for channels
  const [joinChannelName, setJoinChannelName] = useState<string>("");

  const handleChannelSelect = (channel: any) => {
    setSelectedChannel(channel._id);
  };

  const fetchUserPublicInfo = async (username: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/userPublicInfo/${username}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChannelMessages = async () => {
    const token = localStorage.getItem("token");
    if (token && selectedChannel) {
      try {
        const response = await axios.get(`http://localhost:5000/api/getChannelMessages/${selectedChannel}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const sortedMessages = response.data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(sortedMessages.map((message: any) => ({
          content: message.content,
          from: message.author.username, // Use the author's username
          pfp: message.author.pfp, // Use the author's profile picture
        })));
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  useEffect(() => {
    fetchChannelMessages();
  }, [selectedChannel]);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setConnectedUser(response.data.user.username);
          setUserInfo(response.data.user);
          setIsLoading(false);

          const socket: Socket = socketIOClient(ENDPOINT);
          socket.emit('userLoggedIn', response.data.user._id);

          socket.on(
            "channelMessage",
            (data: { content: string; from: string }): void => {
              const { content, from } = data;
              const newMessage = {
                content,
                from: userInfo.username,
                pfp: userInfo.pfp, // Use the user's profile picture
              };
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
          );

          // Fetch channels here and setChannels
          // setChannels(fetchedChannels);

          return () => {
            socket.disconnect();
          };
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
        });
    }
  }, []);

  const joinChannel = async (channel) => {
    if (channel.length > 0) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.post(
            `http://localhost:5000/api/addSomeoneInChannel`,
            { name: channel },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            console.log(`Joined channel: ${channel}`);
            window.location.reload();
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
  const changeNickname = (args) => {
    const newName = args.join(" ");
    if (newName) {
      const token = localStorage.getItem("token");
      axios
        .post(
          "http://localhost:5000/api/upduserinfo",
          { username: newName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(async () => {
          const messages = await fetchChannelMessages(); // Fetch messages again after changing the nickname
          const newMessage = {
            content: `Changed nickname to ${newName}`,
            from: "Command",
            pfp: "https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png", // Use the user's profile picture
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]); // Fix: Return the updated messages array
        })
        .catch((error) => {
          console.error("Error changing nickname:", error);
        });
    } else {
      console.error("Error changing nickname: No new name provided");
    }
  };

  const leaveChannel = async (channel) => {
    if (channel.length > 0) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.post(
            `http://localhost:5000/api/removeSomeoneFromChannel`,
            { name: channel },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.status === 200) {
            console.log(`Left channel: ${channel}`);
            window.location.reload();
          } else {
            console.error("Error leaving channel:", response);
          }
        }
      } catch (error) {
        if ((error as any).response && (error as any).response.status === 404) {
          alert("This channel does not exist.");
        } else {
          console.error("Error leaving channel:", error);
        }
      }
    }
  };
  const fetchUsersInChannel = async () => {
    const token = localStorage.getItem("token");
    console.log(selectedChannel)
    if (token && selectedChannel) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/usersInChannel/${selectedChannel}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          
          const usernames = response.data.users.map(user => user.username).join(", ");
          const newMessage = {
            content: usernames,
            from: "Command",
            pfp: "https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png", // Use the user's profile picture
          };
  
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          console.error("Error getting users from channel:", response);
        }
      } catch (error) {
        if ((error as any).response && (error as any).response.status === 404) {
          alert("This channel does not exist.");
        } else {
          console.error("Error getting users from channel:", error);
        }
      }
    }
  };
  const getChannels = async (query): Promise<void> => {
    try {
      const response = await axios.get(`http://localhost:5000/api/listChannel?name=${query}`);
      const channelNames = Array.isArray(response.data) ? response.data.join(", ") : "";
      const newMessage = {
        content: channelNames,
        from: "Command",
        pfp: "https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png", // Use the user's profile picture
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleCreateChannel = async (newChannelName:string) => {
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
          // Re-fetch the channels after a new one is created
          window.location.reload();
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
  const deleteChannel = async (channelName: string) => {
    try {
      axios.delete(`http://localhost:5000/api/deleteChannel`, {
        data: {
          name: channelName
        }
      })
      .then((response) => {
        console.log(response.data.message);
        window.location.reload();
      })
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSendMessage = async (): Promise<void> => {
    console.log("Channel: " + selectedChannel);
    try {
      const socket: Socket = socketIOClient(ENDPOINT);
      let command = false;
      let commandOutput = "";

      if (messageInput.startsWith("/")) {
        const [cmd, ...args] = messageInput.slice(1).split(" ");
        switch (cmd) {
          case "nick":
            command = true;
            commandOutput = "Changing nickname";
            changeNickname(args);
            break;
          case "list":
            command = true;
            commandOutput = "Listing channels";
            getChannels(args.join(" "));
            break;
          case "create":
            command = true;
            commandOutput = "Channel created";
            handleCreateChannel(args.join(" "));
            break;
          case "delete":
            command = true;
            commandOutput = "Channel deleted";
            deleteChannel(args.join(" "));
            break;
          case "join":
            command = true;
            commandOutput = "Joining channel";
            joinChannel(args.join(" "));
            break;
          case "quit":
            command = true;
            commandOutput = "Quitting channel";
            leaveChannel(args.join(" "));
            break;
          case "users":
            command = true;
            commandOutput = "Listing users";
            fetchUsersInChannel();
            break;
          case "msg":
            command = true;
            commandOutput = "Sending private message";

            // eslint-disable-next-line no-case-declarations
            const receiver = args.join(" ");
            window.location.href = `/FriendMsg?initialSelectedReceiver=${encodeURIComponent(receiver)}`;
            break;
            case "commands":
              command = true;
              commandOutput = "Available commands: /nick, /list, /create, /delete, /join, /quit, /users, /msg";
              // eslint-disable-next-line no-case-declarations
              const newMessage = {
                content: "Available commands: /nick, /list, /create, /delete, /join, /quit, /users, /msg",
                from: "Command",
                pfp: "https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png", // Use the user's profile picture
              };
      
              setMessages((prevMessages) => [...prevMessages, newMessage]);
              break;
          default:
            console.error("Unknown command");
            break;
        }
      }

      if (command) {
        // Handle command output
        console.log(commandOutput);
      } else {
        // Handle regular message
        const newMessage = {
          content: messageInput,
          from: userInfo.username,
          pfp: userInfo.pfp, // Use the user's profile picture
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("channelMessage", {
          content: messageInput,
          channelName: selectedChannel,
          from: userInfo._id,
        });
      }

      setMessageInput("");
    } catch (error) {
      console.error("Error sending channel message:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {channels.map(channel => (
          <div key={channel._id} onClick={() => handleChannelSelect(channel)}>
            {channel.name}
          </div>
        ))}
      </div>

      <h1>
        <div style={{ marginTop: "6vh", marginBottom: "4vh" }}>{`Channel: ${selectedChannel}`}</div>
      </h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "5vh",
          height: "70vh",
          marginBottom: "1vh",
          marginTop: "1vh",
          marginRight: "1vh",
          marginLeft: "1vh",
          paddingLeft: "7vh",
          overflowY: "auto",
          textAlign: "left",
          fontSize: "2vh",
        }}
      >
{messages.map((message, index) => (
  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5vh' }}>
    {message.pfp && (
      <img
        src={message.pfp}
        alt="Profile Picture"
        style={{
          width: "3vh",
          height: "3vh",
          borderRadius: "50%",
          marginRight: "1vh",
        }}
      />
    )}
    <div>
      <strong>{`${message.from} -> `}</strong> {message.content}
    </div>
  </div>
))}
      </div>
      <input
        type="text"
        placeholder="Type your message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        style={{
          padding: "1vh",
          width: "70%",
          height: "3vh",
          marginBottom: "1vh",
          fontSize: "2vh",
        }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChannelLayout;