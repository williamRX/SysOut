/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import socketIOClient, { Socket } from "socket.io-client";
// import { useParams } from 'react-router-dom';

const ENDPOINT = "http://127.0.0.1:8080";

interface ChatLayoutProps {
  selectedReceiver: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ selectedReceiver }) => {
  // const { selectedReceiver } = useParams<{ selectedReceiver: string }>();
  const [connectedUser, setConnectedUser] = useState<string>("");
  
  const [messages, setMessages] = useState<{ content: string; from: string; isSender: boolean }[]>(
    []
  ); // Mettez à jour le type des messages
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messageInput, setMessageInput] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [senderInfo, setSenderInfo] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recipientInfo, setRecipientInfo] = useState<any>({});
    
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
          console.log("User information:", response.data);
          setConnectedUser(response.data.user.username);
          setSenderInfo(response.data.user);
          setIsLoading(false);

          const socket: Socket = socketIOClient(ENDPOINT);
          socket.emit('userLoggedIn', response.data.user._id);
          axios
          .get(`http://localhost:5000/api/userPublicInfo/${selectedReceiver}`)
          .then((response) => {
            setRecipientInfo(response.data.user);
            
          })
          .catch((error) => {
            console.error("Error fetching recipient information:", error);
            // if (error.response && error.response.status === 404) {
            //   // Rediriger uniquement si le statut est 404
            //   navigate('/404');}
          });
          socket.on(
            "privateMessage",
            (data: { content: string; from: string }): void => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { content, from } = data;
              const newMessage = {
                content,
                from: recipientInfo.username, // Get the username of the sender
                isSender: false,
              };
              console.log(recipientInfo)
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
          );

          return () => {
            socket.disconnect();
          };
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
        });
    }

  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && recipientInfo._id) { // Add a condition to check if recipientInfo._id is defined
      axios
        .get(`http://localhost:5000/api/getPrivateMessages/${recipientInfo._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Old messages:", response.data);
          const updatedMessages = response.data.messages.map((message: any) => ({
            ...message,
            from: message.from.username, // Set the username of the sender
            isSender: message.from._id === senderInfo._id, // Check if the sender is the current user
          }));
          setMessages(updatedMessages);
                  // Ajuster la position de défilement après le chargement des messages
        })
        .catch((error) => {
          console.error("Error fetching old messages:", error);
        });
    }
  }, [recipientInfo._id]);
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
  const handleSendMessage = async (): Promise<void> => {
    try {
      const socket: Socket = socketIOClient(ENDPOINT);
      let command = false;
      let commandOutput = "";
  
      if (messageInput.startsWith("/")) {
        const [cmd, ...args] = messageInput.slice(1).split(" ");
        switch (cmd) {
          case "nick":
            command = true;
            commandOutput = "Nickname changed";
            // eslint-disable-next-line no-case-declarations
            const suuMessage = {
              content: "Vous ne pouvez pas vous renommer en prive...",
              from: "Command",
              pfp: "https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png", // Use the user's profile picture
            };
      
            setMessages((prevMessages) => [...prevMessages, suuMessage]);
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
            // eslint-disable-next-line no-case-declarations
            const usersMessage = {
              content: "Il n'y que vous et votre interlocuteur...",
              from: "Command",
              pfp: "https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png", // Use the user's profile picture
            };
      
            setMessages((prevMessages) => [...prevMessages, usersMessage]);
            break;
          case "msg":
            command = true;
            commandOutput = "Sending private message";
            // eslint-disable-next-line no-case-declarations
            const newreceiver = args.join(" ");
            window.location.href = `/FriendMsg?initialSelectedReceiver=${encodeURIComponent(newreceiver)}`;
            break;
          default:
            console.error("Unknown command");
            break;
        }
      }
  
      if (command) {
        // Gérer la sortie de la commande
        console.log(commandOutput);
      } else {
        // Gérer un message privé régulier
        const newMessage = {
          content: messageInput,
          from: senderInfo.username,
          isSender: true,
        };
  
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("privateMessage", {
          content: messageInput,
          to: recipientInfo._id,
          from: senderInfo._id,
        });
        console.log("Sent private message:", {
          content: messageInput,
          to: recipientInfo._id,
          from: senderInfo._id,
        });
      }
  
      setMessageInput("");
    } catch (error) {
      console.error("Error sending private message:", error);
    }
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div>
      <h1>
        <div style={{ marginTop: "6vh", marginBottom: "4vh" }}>{`Chat between ${connectedUser} and ${selectedReceiver}`}</div>
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
    {message.isSender ? (
      senderInfo.pfp && (
        <img
          src={senderInfo.pfp}
          style={{
            width: "3vh",
            height: "3vh",
            borderRadius: "50%",
            marginRight: "1vh",
          }}
        />
      )
    ) : (
      recipientInfo.pfp && (
        <img
          src={recipientInfo.pfp}
          style={{
            width: "3vh",
            height: "3vh",
            borderRadius: "50%",
            marginRight: "1vh",
          }}
        />
      )
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
          height: "3vh", // Change the height to your desired value in vh
          marginBottom: "1vh",
          fontSize: "2vh", // Change the font size to your desired value
        }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatLayout;