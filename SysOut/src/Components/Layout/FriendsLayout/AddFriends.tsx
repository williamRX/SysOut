import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Alert } from 'antd';
import axios from 'axios';

const AddFriends: React.FC = () => {
    const [username, setUsername] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleAddFriend = () => {
        console.log('Adding friend:', username);
        console.log('Token:', localStorage.getItem('token'));
        axios.post('http://localhost:5000/api/addFriend', 
        { friendUsername: username }, 
        { 
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            } 
        }
    )
    .then(response => {
        console.log(response.data);
        setSuccess(true);
    })
    .catch(error => {
        console.error(error);
        setSuccess(false);
        setErrorMessage(error.response.data.error);
    });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddFriend();
        }
    };

    return (
        <>
            <br />
            <br />
            <br />
            <br />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Input
                    placeholder="Enter your friend's username"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    value={username}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleAddFriend}>Add Friend</button>
            </div>
            {success && <Alert message="Invitation envoyée avec succès" type="success" />}
            {errorMessage && <Alert message={errorMessage} type="error" />}
        </>
    );
};

export default AddFriends;