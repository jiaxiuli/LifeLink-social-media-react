import React from 'react';
import { Button } from 'antd';
import './InformationItem.scss';

const InformationItem = (props) => {
    return (
        <div className='InformationItem-container'>
            <div className='InformationItem-title'>{props.info[0].value}</div>
            <div className='InformationItem-content'>
                {
                    props.info.map((item, index) => {
                        return index
                            ? (
                                <div className='InformationItem-item' key={index}>
                                    <div className='item-name'>{item.key}</div>
                                    <div className='item-value'>{item.value ? item.value : '还没有填写~'}</div>
                                    <div className='item-edit-btn'>
                                        <Button size='small'>change</Button>
                                    </div>
                                </div>
                            )
                            : null;
                    })
                }
            </div>
        </div>
    );
};

export default InformationItem;
