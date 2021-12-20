import LoginService from '../../apis/loginService';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import RegisterService from '../../apis/registerService';
import { Form, Input, Checkbox, Button, message } from 'antd';
import './Login.scss';

const Login = () => {
    const [loginOrRegister, setLoginOrRegister] = useState('login');
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    useEffect(() => {
        const container = document.querySelector('.login-block-container');
        const header = document.querySelector('.login-panel-header-container');
        const btns = document.querySelectorAll('.login-panel-role-change-button');
        if (container && btns.length && header) {
            if (loginOrRegister === 'login') {
                container.classList.remove('change-to-register');
                header.classList.remove('change-to-register');
                btns[0].classList.add('change-role-btn-active');
                btns[1].classList.remove('change-role-btn-active');
            }
            if (loginOrRegister === 'register') {
                container.classList.add('change-to-register');
                header.classList.add('change-to-register');
                btns[1].classList.add('change-role-btn-active');
                btns[0].classList.remove('change-role-btn-active');
            }
        }
    }, [loginOrRegister]);

    function onLoginFormFinish (value) {
        setIsLoading(true);
        LoginService.login(value).then((res) => {
            setIsLoading(false);
            if (res.data.data.loginSuccess) {
                message.success('登陆成功');
                history.push(`/homepage/${res.data.data.user.id}`);
            } else {
                message.error('用户名或密码错误');
            }
        }, () => {
            setIsLoading(false);
            message.warning('网络有误，请重试');
        });
    }

    function onRegisterFormFinish () {
        const conPwd = registerForm.getFieldValue('confirmPassword');
        const email = registerForm.getFieldValue('email');
        const password = registerForm.getFieldValue('password');
        console.log(conPwd, password);
        if (conPwd === password) {
            RegisterService.newUserRegister({
                email,
                password
            }).then((res) => {
                if (res.data.code === 200) {
                    message.success('注册成功 请登陆');
                    setLoginOrRegister('login');
                } else {
                    message.error('出错了');
                }
            }, () => {
                message.error('网络有误，请重试');
            });
        } else {
            message.error('两次输入密码不一致');
        }
    }

    function handleUserLogin () {
        setLoginOrRegister('login');
    }
    function handleAdminLogin () {
        setLoginOrRegister('register');
    }
    async function checkIsEmailAvalible (_, value) {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (value === '') return Promise.reject();
        const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (reg.test(value)) {
            let status = null;
            await RegisterService.checkIsEmailAvalible(value).then((res) => {
                if (res.data.code === 200) {
                    status = {
                        avalible: true
                    };
                } else if (res.data.code === 201) {
                    status = {
                        avalible: false,
                        reason: '该email已被注册'
                    };
                } else {
                    message.error('出错了');
                    status = {
                        avalible: false,
                        reason: '网络错误'
                    };
                }
            }, () => {
                message.error('出错了');
            });
            // eslint-disable-next-line prefer-promise-reject-errors
            if (!status) return Promise.reject();
            if (status.avalible) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(status.reason));
            }
        } else {
            return Promise.reject(new Error('不是正确的email格式'));
        }
    }

    function checkPassword (_, value) {
        const confirmPassword = registerForm.getFieldValue('confirmPassword');
        if (value && value.length >= 4) {
            if (confirmPassword === value) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error('两次输入密码不一致'));
            }
        }
        return Promise.reject(new Error('密码需要大于4位'));
    }

    function checkConfirmPassword (_, value) {
        const password = registerForm.getFieldValue('password');
        if (value === password) {
            registerForm.validateFields(['password']);
            return Promise.resolve();
        }
        return Promise.reject(new Error('两次输入的密码不一致'));
    }

    return (
        <>
            <div className='body'></div>
            <div className='mask'></div>
            <div className='login-panel'>
                <div className='login-panel-header'>
                    <div className='login-panel-header-container'>
                        <div className='login-panel-header-chose-item'>登 录</div>
                        <div className='login-panel-header-chose-item'>注 册</div>
                    </div>
                </div>
                <div className='login-panel-role-change'>
                    <div className='login-panel-role-change-button' onClick={handleUserLogin}>登陆</div>
                    <div className='login-panel-role-change-button' onClick={handleAdminLogin}>注册</div>
                </div>
                <div className='login-block'>
                    <div className='login-block-container'>
                        <div className='login-block-form'>
                            <Form
                                form={loginForm}
                                id='userForm'
                                name="basic"
                                labelCol={{ span: 8 }}
                                initialValues={{ remember: true }}
                                onFinish={onLoginFormFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="邮箱"
                                    name="email"
                                    labelCol={{ span: 5, offset: 0 }}
                                    rules={[{ required: true, message: '请填写邮箱' }]}
                                >
                                    <Input allowClear id='emailInput'/>
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    labelCol={{ span: 5, offset: 0 }}
                                    rules={[{ required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password id='passwordInput'/>
                                </Form.Item>

                                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                    <Checkbox id='rememberCheckbox'>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit"
                                        loading={isLoading}
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
                                form={registerForm}
                                name="basic"
                                labelCol={{ span: 8 }}
                                initialValues={{ remember: true }}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="邮箱"
                                    name="email"
                                    labelCol={{ span: 6, offset: 0 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请填写邮箱'
                                        }, {
                                            validator: checkIsEmailAvalible
                                        }
                                    ]}
                                >
                                    <Input allowClear/>
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    labelCol={{ span: 6, offset: 0 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入密码'
                                        }, {
                                            validator: checkPassword
                                        }
                                    ]}
                                >
                                    <Input.Password/>
                                </Form.Item>

                                <Form.Item
                                    label="确认密码"
                                    name="confirmPassword"
                                    labelCol={{ span: 6, offset: 0 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请再次密码'
                                        }, {
                                            validator: checkConfirmPassword
                                        }
                                    ]}
                                >
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit"
                                        loading={isLoading}
                                        onClick={onRegisterFormFinish}
                                        style={{
                                            position: 'relative',
                                            marginTop: '10px',
                                            left: '50%',
                                            transform: 'translateX(-50%)'
                                        }}>
                                        注册
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
