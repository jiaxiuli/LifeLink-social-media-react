import React from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    DesktopOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import './Navigator.scss';

const Navigator = () => {
    return (
        <div className='Navigator-main'>
            <div className='Navigator-menu-container'>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    theme="light"
                >
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        My Information
                    </Menu.Item>
                    <Menu.Item key="2" icon={<BookOutlined />}>
                        My Class
                    </Menu.Item>
                    <Menu.Item key="3" icon={<DesktopOutlined />}>
                        Option 2
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ContainerOutlined />}>
                        Option 3
                    </Menu.Item>

                </Menu>
            </div>
        </div>
    );
};

export default Navigator;