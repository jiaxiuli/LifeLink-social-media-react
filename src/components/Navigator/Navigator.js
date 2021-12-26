import React from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    FormOutlined,
    DesktopOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import './Navigator.scss';

const Navigator = (props) => {
    const paths = ['Personal-Information', 'Post-Something'];

    const urlHash = window.location.hash.split('/');
    const path = urlHash[urlHash.length - 1];

    function handleKeysClicked (target) {
        const index = parseInt(target.key);
        props.handleMenuItemClicked(index);
    }
    return (
        <div className='Navigator-main'>
            <div className='Navigator-menu-container'>
                <Menu
                    defaultSelectedKeys={[(paths.indexOf(path) + 1).toString()]}
                    mode="inline"
                    theme="light"
                    onSelect={handleKeysClicked}
                >
                    <Menu.Item key='1' icon={<UserOutlined />}>
                        My Information
                    </Menu.Item>
                    <Menu.Item key='2' icon={<FormOutlined />}>
                        Write a Posting
                    </Menu.Item>
                    <Menu.Item key='3' icon={<DesktopOutlined />}>
                        Option 2
                    </Menu.Item>
                    <Menu.Item key='4' icon={<ContainerOutlined />}>
                        Option 3
                    </Menu.Item>

                </Menu>
            </div>
        </div>
    );
};

export default Navigator;
