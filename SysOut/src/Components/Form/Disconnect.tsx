import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const DisconnectButton = () => {
    const { setIsAuthenticated, setUsername, setToken } = useContext(AuthContext);

    const handleDisconnect = () => {
        setIsAuthenticated(false);
        setUsername(null);
        setToken(null);
    };

    return (
        <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleDisconnect}
            style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                backgroundColor: "orange",
            }}
        >
        </Button>
    );
};

export default DisconnectButton;
