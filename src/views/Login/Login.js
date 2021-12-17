import LoginService from '../../apis/loginService';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Form, Input, Checkbox, Button, message } from 'antd';
import './Login.scss';

const Login = () => {
  const [loginRole, setLoginRole] = useState('user');
  const history = useHistory();

  useEffect(() => {
    const container = document.querySelector('.login-block-container');
    const btns = document.querySelectorAll('.login-panel-role-change-button');
    if (container && btns.length) {
      if (loginRole === 'user') {
        container.classList.remove('change-to-admin-login');
        btns[0].classList.add('change-role-btn-active');
        btns[1].classList.remove('change-role-btn-active');
      }
      if (loginRole === 'admin') {
        container.classList.add('change-to-admin-login');
        btns[1].classList.add('change-role-btn-active');
        btns[0].classList.remove('change-role-btn-active');
      }
    }
  }, [loginRole]);

  function onUserFormFinish (value) {
    LoginService.login(value).then((res) => {
      if (res.data.data.loginSuccess) {
        message.success('登陆成功');
        history.push(`/homepage/${res.data.data.user.id}`);
      } else {
        message.error('用户名或密码错误');
      }
    }, () => {
      message.warning('网络有误，请重试');
    });
  }

  function onAdminFormFinish () {

  }

  function handleUserLogin () {
    setLoginRole('user');
  }
  function handleAdminLogin () {
    setLoginRole('admin');
  }
  return (
        <>
            <div className='body'></div>
            <div className='mask'></div>
            <div className='login-panel'>
                <div className='login-panel-header'>登 陆</div>
                <div className='login-panel-role-change'>
                    <div className='login-panel-role-change-button' onClick={handleUserLogin}>用户登陆</div>
                    <div className='login-panel-role-change-button' onClick={handleAdminLogin}>管理员登陆</div>
                </div>
                <div className='login-block'>
                    <div className='login-block-container'>
                        <div className='login-block-form'>
                            <Form
                                id='userForm'
                                name="basic"
                                labelCol={{ span: 8 }}
                                initialValues={{ remember: true }}
                                onFinish={onUserFormFinish}
                                autoComplete="off"
                                >
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    labelCol={{ span: 5, offset: 0 }}
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input id='usernameInput'/>
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    labelCol={{ span: 5, offset: 0 }}
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password id='passwordInput'/>
                                </Form.Item>

                                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                    <Checkbox id='rememberCheckbox'>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit"
                                    style={{
                                      position: 'relative',
                                      left: '50%',
                                      transform: 'translateX(-50%)'
                                    }}>
                                        登陆
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className='login-block-form'>
                            <Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                initialValues={{ remember: true }}
                                onFinish={onAdminFormFinish}
                                autoComplete="off"
                                >
                                <Form.Item
                                    label="管理员"
                                    name="username"
                                    labelCol={{ span: 5, offset: 0 }}
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="密钥"
                                    name="password"
                                    labelCol={{ span: 5, offset: 0 }}
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password/>
                                </Form.Item>

                                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit"
                                    style={{
                                      position: 'relative',
                                      left: '50%',
                                      transform: 'translateX(-50%)'
                                    }}>
                                        登陆
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
  );
};

export default Login;
