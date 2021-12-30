/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { LikeTwoTone, HeartTwoTone } from '@ant-design/icons';
import userService from '../../apis/userService';
import { DEFAULT_PHOTO_URL } from '../../static/defaultProfilePhoto';
import './PostingPreview.scss';
import { useState } from 'react/cjs/react.development';
import { message } from 'antd';

const PostingPreview = (props) => {
    const [AuthorInfo, setAuthorInfo] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PHOTO_URL);

    const { userInfo, articleInfo, catagory } = props;
    const colorList = ['#19CAAD', '#D6D5B7', '#8CC7B5', '#D1BA74', '#A0EEE1', '#E6CEAC', '#BEE7E9', '#ECAD9E', '#BEEDC7', '#F4606C'];
    console.log(articleInfo);

    useEffect(() => {
        if (props && articleInfo && userInfo) {
            let author = {};
            if (articleInfo.author === userInfo.id) {
                author = userInfo;
            } else {
                author = props.followedUserInfo.find((item) => item.id === articleInfo.author);
            }
            setAuthorInfo(author);
            if (author?.pic_id) {
                // 获取头像
                userService.getProfilePhoto(author.pic_id).then((res) => {
                    if (res.data.code === 200) {
                        setProfilePhoto(res.data.data.pic);
                    } else {
                        throw new Error();
                    }
                }).catch(() => {
                    message.warning('获取用户头像失败');
                });
            }
        }
    }, [props, userInfo]);
    return (
        <div className='posting-preview-main-container'>
            <div className='posting-preview-header'>
                <div className='posting-preview-header-photo'
                    style={{
                        backgroundImage: `url(${profilePhoto || DEFAULT_PHOTO_URL})`
                    }}></div>
                <div className='posting-preview-header-username'>
                    <p className='user-name'>{
                        AuthorInfo?.firstname || AuthorInfo?.lastname
                            ? `${AuthorInfo?.firstname || ''} ${AuthorInfo?.lastname || ''}`
                            : 'unknown user'
                    }</p>
                    <p className='create-time'>{articleInfo?.create_time || ''}</p>
                </div>
                <div className='posting-preview-header-likes'>
                    <div className='icon-container'>
                        <div className='likes' title='点赞数'>
                            <LikeTwoTone style={{ fontSize: 18 }}/>
                            <div className='icon-text'>500</div>
                        </div>
                        <div className='likes' title='收藏数'>
                            <HeartTwoTone style={{ fontSize: 18 }}/>
                            <div className='icon-text'>50</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='posting-preview-title' title={`文章标题：${articleInfo?.title || ''}`}>
                {articleInfo?.title || ''}
            </div>
            <div className='posting-preview-catagory'>
                <div className='catagory'>{articleInfo?.catagory
                    ? `关于${(catagory?.find((item) => item.id === parseInt(articleInfo.catagory)))?.catagory_name || '无分类'}`
                    : '无分类'}</div>
                <div className='tags'>
                    {
                        JSON.parse(articleInfo?.tags).map((item, index) => {
                            const i = Math.floor(Math.random() * 10);
                            return (<div className='tag' key={index} style={{ backgroundColor: colorList[i] }}>
                                <span className='tag-text'>{item}</span>
                            </div>);
                        })
                    }
                </div>
            </div>
            <div className='posting-preview-content'>
                {articleInfo?.content || ''}
            </div>
            <div className='posting-preview-picture-conainer'>
                <div className='posting-preview-picture-scroller'>
                    { articleInfo
                        ? JSON.parse(articleInfo.pictures).map((item, index) => (
                            <div className='posting-preview-picture'
                                key={index}
                                style={{
                                    backgroundImage: `url(${item.thumbUrl})`
                                }}></div>
                        ))
                        : null
                    }
                </div>
            </div>
        </div>
    );
};

export default PostingPreview;
