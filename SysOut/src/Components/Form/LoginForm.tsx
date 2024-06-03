import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated , setUsername , setToken} = useContext(AuthContext) as { setIsAuthenticated: (value: boolean) => void; setUsername: (value: string) => void; setToken: (value: string) => void };
  // listener bouton Login
  const onFinish = (values: { username: string, password: string }) => {
    console.log('Received values of form: ', values);
    //Equivalent d'un fetch
    axios.post('http://localhost:5000/api/login', values)
      .then(response => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        setUsername(values.username);
        setToken(response.data.token);
        navigate('/');
      })
      .catch(error => {
        console.error('Failed to login', error);
      });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="">register now!</a>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;