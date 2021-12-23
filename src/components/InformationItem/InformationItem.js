/* eslint-disable no-debugger */
import React from 'react';
import { Button, Input } from 'antd';
import { EditOutlined, UndoOutlined, CheckOutlined } from '@ant-design/icons';
import './InformationItem.scss';
import { useEffect, useState } from 'react/cjs/react.development';

const InformationItem = (props) => {
    const [editItemName, setEditItemName] = useState([]);
    const [info, setInfo] = useState([]);
    // const { Option } = Select;

    useEffect(() => {
        if (props.info) {
            const temp = [];
            props.info.forEach((item) => {
                temp.push({
                    ...item
                });
            });
            setInfo(temp);
        }
    }, [props.info]);

    function handleEditInfo (item, index) {
        if (index) {
            const value = props.info[index].value;
            setInfo((prev) => {
                const temp = [...prev];
                temp[index].value = value;
                return temp;
            });
            props.handleInfoChange(item.key, value);
        }
        toggleInput(item);
    }

    function handleEditInfoCompelte (item, index) {
        const target = document.querySelector(`#${item.key}`);
        setInfo((prev) => {
            const temp = [...prev];
            temp[index].value = target.value;
            return temp;
        });
        toggleInput(item);
        props.handleInfoChange(item.key, target.value);
    }

    function toggleInput (item) {
        const index = editItemName.indexOf(item.name);
        if (index > -1) {
            setEditItemName((prev) => {
                prev.splice(index, 1);
                return [...prev];
            });
        } else {
            setEditItemName((prev) => [...prev, item.name]);
        }
    }

    return (
        <div className='InformationItem-container'>
            <div className='InformationItem-title'>{info.length ? info[0].value : props.info[0].value}</div>
            <div className='InformationItem-content'>
                {
                    info.map((item, index) => {
                        return index
                            ? (
                                <div className='InformationItem-item' key={index}>
                                    <span className='changed-notifi-point' style={{
                                        display: info[index].value === props.info[index].value ? 'none' : 'block'
                                    }} title='该项已变更 但未提交'></span>
                                    <div className='item-name'>{item.name}</div>
                                    <div className='item-value'>
                                        {
                                            item.key === 'gender'
                                                ? (<select
                                                    id={item.key}
                                                    className='edit-item-gender-select'
                                                    style={{
                                                        display: editItemName.indexOf(item.name) > -1 ? 'block' : 'none'
                                                    }}>
                                                    <option key='m' value='Male'>Male</option>
                                                    <option key='f' value='Female'>Female</option>
                                                </select>)
                                                : (<Input
                                                    id={item.key}
                                                    placeholder={item.value}
                                                    bordered={false}
                                                    style={{
                                                        display: editItemName.indexOf(item.name) > -1 ? 'block' : 'none'
                                                    }}
                                                    className='edit-item'/>)
                                        }
                                        <span style={{
                                            display: editItemName.indexOf(item.name) > -1 ? 'none' : 'block'
                                        }}>
                                            {item.value ? item.value : '还没有填写~'}
                                        </span>
                                    </div>
                                    <div className='item-edit-btn'>

                                        {
                                            editItemName.indexOf(item.name) > -1
                                                ? (<>
                                                    <Button
                                                        size='small'
                                                        title='确定'
                                                        onClick={() => handleEditInfoCompelte(item, index)}>
                                                        <CheckOutlined />
                                                    </Button>
                                                    <Button
                                                        size='small'
                                                        title='取消'
                                                        style={{
                                                            marginLeft: '5px'
                                                        }}
                                                        onClick={() => handleEditInfo(item, index)}>
                                                        <UndoOutlined />
                                                    </Button>
                                                </>
                                                )
                                                : (<Button
                                                    size='small'
                                                    title='编辑'
                                                    onClick={() => handleEditInfo(item)}
                                                    disabled={item.key === 'email'}
                                                >
                                                    <EditOutlined />
                                                </Button>)
                                        }

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
