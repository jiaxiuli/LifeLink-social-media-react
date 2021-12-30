import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import infoStore from '../../store/informationStore';
import articleService from '../../apis/articleService';
import { Input, Button, Form, Select, message, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './EditPosting.scss';

const EditPosting = () => {
    const { TextArea } = Input;
    const { Option } = Select;
    const { Search } = Input;
    const [form] = Form.useForm();
    const inputRef = React.useRef(null);
    const [info, setInfo] = useState(null);
    const [catagory, setCatagory] = useState([]);
    const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
    const [picState, setPicState] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: []
    });
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
    );
    // 获取用户信息
    useEffect(() => {
        const reduxInfo = infoStore.getState();
        setCatagory(() => [...reduxInfo.catagoryInfo]);
        setInfo(() => ({ ...reduxInfo.userInfo }));
        const cancelSub = infoStore.subscribe(() => {
            setCatagory(() => [...reduxInfo.catagoryInfo]);
            setInfo(() => ({ ...reduxInfo.userInfo }));
        });
        form.setFieldsValue({
            catagory: '请选择分类'
        });
        $('.edit-Area-input-title').trigger('focus');
        return () => {
            cancelSub();
            setInfo(() => null);
            setCatagory(() => null);
        };
    }, []);

    function handleTagInput (event) {
        const container = $('.tagsContainer');
        const char = event.key;
        if (container && char) {
            const tagString = form.getFieldValue('tag_input');
            if (char === ' ') {
                if (tagString && tagString.length > 1) {
                    $(tagCreator(tagString)).appendTo(container);
                    container.scrollTop(container.prop('scrollHeight'));
                }
                form.setFieldsValue({
                    tag_input: ''
                });
            }
            if (char === 'Enter') {
                if (tagString && tagString.length === 1 && tagString[0] === ' ') return;
                if (tagString && tagString.length > 0) {
                    $(tagCreator(tagString)).appendTo(container);
                    container.scrollTop(container.prop('scrollHeight'));
                }
                form.setFieldsValue({
                    tag_input: ''
                });
            }
        }
    }

    function tagCreator (tagString) {
        // 随机生成三个0 - 255的数字
        const colorList = ['#19CAAD', '#D6D5B7', '#8CC7B5', '#D1BA74', '#A0EEE1', '#E6CEAC', '#BEE7E9', '#ECAD9E', '#BEEDC7', '#F4606C'];
        const index = Math.floor(Math.random() * 10);
        return `<div class='tag' style='background-color: ${colorList[index]}7c'>
                    <span class='tag-text'>${tagString}</span>
                    <span class='tag-icon' onclick="this.parentNode.remove()">
                        <svg t="1640445703237" class="icon" viewBox="0 0 1024 1024" version="1.1" 
                        xmlns="http://www.w3.org/2000/svg" p-id="2680" width="16" height="16">
                            <path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 
                                512-512 512z m0-572.330667L300.629333 240.213333a42.538667 42.538667 0 0 0-60.16 0.213334 
                                42.410667 42.410667 0 0 0-0.213333 60.16L451.669333 512 240.213333 723.370667a42.538667 
                                42.538667 0 0 0 0.213334 60.16 42.410667 42.410667 0 0 0 60.16 0.213333L512 572.330667l211.370667 
                                211.413333a42.538667 42.538667 0 0 0 60.16-0.213333 42.410667 42.410667 0 0 0 0.213333-60.16L572.330667 
                                512l211.413333-211.370667a42.538667 42.538667 0 0 0-0.213333-60.16 42.410667 42.410667 0 0 0-60.16-0.213333L512
                                451.669333z" fill="#2c2c2c" p-id="2681">
                            </path>
                        </svg>
                    </span>
                </div>`;
    }

    function handleSendPosting () {
        setIsSubmitBtnLoading(true);
        const mentionsList = [2, 3, 4];
        const catagory = form.getFieldValue('catagory');
        const title = $('.edit-Area-input-title').val();
        const content = $('.edit-Area-input-text').text();
        if (title && content) {
            // 验证分类是否填写 填写之后所有信息才能提交
            form.validateFields(['catagory']).then(() => {
                const tags = [];
                const tagList = $('.tag-text');
                for (let item of tagList) {
                    tags.push($(item).html());
                }
                // 照片
                const picListStr = JSON.stringify(picState.fileList);
                // 标签
                const tagListStr = JSON.stringify(tags);
                // 分类 catagory
                // 提到
                const mentionsListStr = JSON.stringify(mentionsList);
                // 屏蔽
                const shieldsListStr = JSON.stringify([]);
                const request = {
                    author: info.id,
                    title,
                    content,
                    catagory,
                    tags: tagListStr,
                    pictures: picListStr,
                    mentions: mentionsListStr,
                    shields: shieldsListStr
                };
                articleService.postAnArticle(request).then((res) => {
                    if (res.data.code === 200) {
                        message.success('发布成功');
                    } else {
                        message.error('发布失败 请重试');
                    }
                    setIsSubmitBtnLoading(false);
                }, () => {
                    message.error('发布失败 请重试');
                    setIsSubmitBtnLoading(false);
                });
            }, () => {
                message.warning('未填写分类 无法提交');
                setIsSubmitBtnLoading(false);
            });
        } else {
            message.warning('文章不完整 无法提交');
            setIsSubmitBtnLoading(false);
        }
    }

    function checkIsCatagoryOk () {
        const catagory = form.getFieldValue('catagory');
        if (typeof catagory === 'number') {
            return Promise.resolve();
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject();
    }

    function handleTitleInputKeyDown (event) {
        if (event.key === 'Enter') {
            setTimeout(() => {
                inputRef.current.focus();
            });
        }
    }

    function handleCancel () {
        setPicState((prev) => {
            prev.previewVisible = false;
            return { ...prev };
        });
    }

    function getBase64 (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function handlePreview (file) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPicState((prev) => {
            prev.previewImage = file.url || file.preview;
            prev.previewVisible = true;
            prev.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
            return { ...prev };
        });
    };

    function handleChange ({ fileList }) {
        setPicState((prev) => {
            prev.fileList = fileList;
            return { ...prev };
        });
    };

    function handleBeforeUpload () {
        return false;
    }

    return (
        <div className='edit-posting-container'>
            <div className='attribute-area'>
                <Form
                    name="basic"
                    style={{
                        height: '100%'
                    }}
                    form={form}
                >
                    <div className='attribute-name'>文章分类</div>
                    <Form.Item
                        name="catagory"
                        style={{ marginBottom: 0 }}
                        rules={[
                            {
                                validator: checkIsCatagoryOk,
                                message: '未选择分类'
                            }
                        ]}>
                        <Select>
                            {
                                catagory.map((item) => (
                                    <Option key={item.id} value={item.id}>{item.catagory_name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <div className='attribute-name'>关键词标签</div>
                    <div className='tagsContainer'></div>
                    <Form.Item
                        name="tag_input"
                        style={{ marginBottom: 0 }}
                    >
                        <Input autoComplete='off' onKeyDown={handleTagInput}/>
                    </Form.Item>

                    <div className='attribute-name'>提及</div>
                    <Search placeholder="input search text" loading/>
                    <div className='display-area'></div>

                    <div className='attribute-name'>屏蔽</div>
                    <Search placeholder="input search text" loading/>
                    <div className='display-area'></div>

                </Form>
            </div>
            <div className='edit-area'>
                <Input
                    className='edit-Area-input-title'
                    bordered={false}
                    placeholder='请输入标题'
                    onKeyDown={handleTitleInputKeyDown}
                >
                </Input>
                <TextArea
                    className='edit-Area-input-text'
                    ref={inputRef}
                    bordered={false}
                    showCount
                    placeholder='输入正文...'
                ></TextArea>
                <div className='post-button'>
                    <Button
                        className='post-button-btn'
                        onClick={handleSendPosting}
                        loading={isSubmitBtnLoading}
                    >
                            确认发布
                    </Button>
                </div>
            </div>
            <div className='photo-area'>
                <Upload
                    style={{
                        border: '1px solid black'
                    }}
                    beforeUpload={handleBeforeUpload}
                    listType="picture-card"
                    fileList={picState.fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {picState.fileList.length >= 15 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={picState.previewVisible}
                    title={picState.previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img style={{ width: '100%' }} src={picState.previewImage} />
                </Modal>

            </div>
        </div>
    );
};

export default EditPosting;
