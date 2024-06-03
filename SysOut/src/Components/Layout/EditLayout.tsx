import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Spin, Button, Modal, Input, Select } from "antd";

import axios from "axios";

const { Meta } = Card;
const { Option } = Select;

const ProfileCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userInfo, setUserInfo] = useState<any>(null);
  const [editCoverVisible, setEditCoverVisible] = useState(false);
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [editPfpVisible, setEditPfpVisible] = useState(false);
  const [editBioVisible, setEditBioVisible] = useState(false);
  const [editGenderVisible, setEditGenderVisible] = useState(false);
  const [newCoverUrl, setNewCoverUrl] = useState("");
  const [newName, setNewName] = useState("");
  const [newPfpUrl, setNewPfpUrl] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newGender, setNewGender] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditCover = () => {
    setEditCoverVisible(true);
  };

  const handleEditName = () => {
    setEditNameVisible(true);
  };

  const handleEditPfp = () => {
    setEditPfpVisible(true);
  };

  const handleEditBio = () => {
    setEditBioVisible(true);
  };

  const handleEditGender = () => {
    setEditGenderVisible(true);
  };

  const handleSaveCover = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/upduserinfo",
        { cover: newCoverUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditCoverVisible(false);
    } catch (error) {
      console.error("Error updating cover:", error);
    }
  };
  
  const handleSaveName = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/upduserinfo",
        { username: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditNameVisible(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };
  
  const handleSavePfp = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/upduserinfo",
        { pfp: newPfpUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditPfpVisible(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleSaveBio = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/upduserinfo",
        { bio: newBio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditBioVisible(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleSaveGender = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/upduserinfo",
        { gender: newGender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditGenderVisible(false);
    } catch (error) {
      console.error("Error updating gender:", error);
    }
  };

  return (
    <>
      <Card
        style={{ width: 900, marginTop: 16, height: 700 }}
        loading={loading}
        cover={
          <Spin spinning={loading} style={{ width: "100%" }}>
            <img
              alt="example"
              src={newCoverUrl || userInfo?.user.cover}
              style={{ width: "100%" }}
            />
          </Spin>
        }
        actions={[
          <Button type="text" icon={<SettingOutlined />} onClick={handleEditCover} />,
          <Button type="text" icon={<EditOutlined />} onClick={handleEditName} />,
          <Button type="text" icon={<EllipsisOutlined />} onClick={handleEditPfp} />,
          <Button type="text" icon={<EditOutlined />} onClick={handleEditBio} />,
          <Button type="text" icon={<EditOutlined />} onClick={handleEditGender} />,
        ]}
      >
        <Meta
          avatar={
            <Avatar src={newPfpUrl || userInfo?.user.pfp} size={80} />
          }
          title={newName || (userInfo?.user.username || "Loading...")}
          description={userInfo?.user.bio || "Loading..."}
        />
      </Card>

      <Modal
        title="Edit Cover"
        visible={editCoverVisible}
        onOk={handleSaveCover}
        onCancel={() => setEditCoverVisible(false)}
      >
        <Input
          placeholder="Enter new cover URL"
          value={newCoverUrl}
          onChange={(e) => setNewCoverUrl(e.target.value)}
        />
      </Modal>

      <Modal
        title="Edit Name"
        visible={editNameVisible}
        onOk={handleSaveName}
        onCancel={() => setEditNameVisible(false)}
      >
        <Input
          placeholder="Enter new name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>

      <Modal
        title="Edit Profile Picture"
        visible={editPfpVisible}
        onOk={handleSavePfp}
        onCancel={() => setEditPfpVisible(false)}
      >
        <Input
          placeholder="Enter new profile picture URL"
          value={newPfpUrl}
          onChange={(e) => setNewPfpUrl(e.target.value)}
        />
      </Modal>

      <Modal
        title="Edit Bio"
        visible={editBioVisible}
        onOk={handleSaveBio}
        onCancel={() => setEditBioVisible(false)}
      >
        <Input
          placeholder="Enter new bio"
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
        />
      </Modal>

      <Modal
        title="Edit Gender"
        visible={editGenderVisible}
        onOk={handleSaveGender}
        onCancel={() => setEditGenderVisible(false)}
      >
        <Select
          placeholder="Select new gender"
          value={newGender}
          onChange={(value) => setNewGender(value)}
        >
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Modal>
    </>
  );
};

export default ProfileCard;
