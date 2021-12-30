import React from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    FormOutlined,
    CopyOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import './Navigator.scss';

const Navigator = (props) => {
    const paths = ['Personal-Information', 'Write-Article', 'Articles'];

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
                        Write an Article
                    </Menu.Item>
                    <Menu.Item key='3' icon={<CopyOutlined />}>
                        Browse Articles
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
