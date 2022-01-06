/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect } from 'react';
import $ from 'jquery';
import {
    LikeTwoTone,
    HeartTwoTone,
    LeftOutlined,
    RightOutlined,
    LikeOutlined,
    HeartOutlined,
    UserOutlined,
    CrownOutlined,
    WomanOutlined,
    ManOutlined,
    SolutionOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import { DEFAULT_PHOTO_URL } from '../../static/defaultProfilePhoto';
import './PostingPreview.scss';
import { useState } from 'react/cjs/react.development';
import { Image, Popover } from 'antd';

const PostingPreview = (props) => {
    const { userInfo, articleInfo, catagory } = props;
    const [isScrollBtnShow, setIsScrollBtnShow] = useState({
        picScroll: false,
        tagScroll: false
    });
    const [scrollOffset, setScrollOffset] = useState({
        picScroll: 0,
        tagScroll: 0
    });
    const [AuthorInfo, setAuthorInfo] = useState(null);
    const colorList = ['#19CAAD', '#D6D5B7', '#8CC7B5', '#D1BA74', '#A0EEE1', '#E6CEAC', '#BEE7E9', '#ECAD9E', '#BEEDC7', '#F4606C'];
    useEffect(() => {
        if (props && articleInfo && userInfo) {
            let author = {};
            if (articleInfo.author === userInfo.id) {
                author = userInfo;
            } else {
                author = props.followedUserInfo.find((item) => item.id === articleInfo.author);
            }
            setAuthorInfo(author);
        }
    }, [props, userInfo]);

    useLayoutEffect(() => {

    }, []);

    let timer;
    let left = 0;
    function handlePictureScroll (type) {
        const container = $('.posting-preview-picture-container')[props.index];
        const scroller = $('.posting-preview-picture-scroller')[props.index];
        const containerWidth = $(container).width();
        const scrollerWidth = $(scroller).width();
        const diff = scrollerWidth - containerWidth;
        if (diff > 0) {
            left = scrollOffset.picScroll;
            if (type === 'right') {
                timer = setInterval(() => {
                    if (left > -diff) {
                        left -= 2;
                        $(scroller).css('transform', `translateX(${left}px)`);
                    }
                }, 16);
            }
            if (type === 'left') {
                timer = setInterval(() => {
                    if (left < 0) {
                        left += 2;
                        $(scroller).css('transform', `translateX(${left}px)`);
                    }
                }, 16);
            }
        }
    }
    function handlePictureScrollStop () {
        clearInterval(timer);
        setScrollOffset((prev) => {
            prev.picScroll = left;
            return { ...prev };
        });
    }

    function handleMouseEnterPicContainer () {
        const container = $('.posting-preview-picture-container')[props.index];
        const scroller = $('.posting-preview-picture-scroller')[props.index];
        const containerWidth = $(container).width();
        const scrollerWidth = $(scroller).width();
        const diff = scrollerWidth - containerWidth;
        if (diff > 0) {
            setIsScrollBtnShow((prev) => {
                prev.picScroll = true;
                return { ...prev };
            });
        }
    }

    function handleMouseLeavePicContainer () {
        setIsScrollBtnShow((prev) => {
            prev.picScroll = false;
            return { ...prev };
        });
    }
    return (
        <div className='posting-preview-main-container' onClick={() => props.handlePreviewClicked(props.index)}>
            <div className='posting-preview-header'>
                <Popover
                    trigger='hover'
                    placement='leftTop'
                    overlayStyle={{
                        height: '350px',
                        width: '200px',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 5px #000',
                        backgroundColor: '#fff'
                    }}
                    arrowPointAtCenter
                    autoAdjustOverflow
                    content={() => (
                        <div className='photo-popover-container'>
                            <div className='popover-photo' style={{
                                backgroundImage: `url(${props.authorProfilePhoto?.pic || DEFAULT_PHOTO_URL})`
                            }}>
                            </div>
                            <div className='popover-slogan'>
                                <span>
                                    {
                                        AuthorInfo?.gender
                                            ? (
                                                AuthorInfo?.gender === 'm'
                                                    ? <ManOutlined style={{ fontSize: '14px', color: '#096dd9' }}/>
                                                    : <WomanOutlined style={{ fontSize: '14px', color: '#f759ab' }}/>
                                            )
                                            : ' '

                                    }
                                </span>
                                <span>{`-"${AuthorInfo?.slogan}"`}</span>
                            </div>
                            <div className='popover-item'>
                                <UserOutlined className='popover-icons'/>
                                <span>{
                                    AuthorInfo?.firstname || AuthorInfo?.lastname
                                        ? `${AuthorInfo?.firstname || ''} ${AuthorInfo?.lastname || ''}`
                                        : 'unknown user'
                                }</span>
                            </div>
                            <div className='popover-item'>
                                <CrownOutlined className='popover-icons'/>
                                <span>{
                                    AuthorInfo?.date_of_birth?.substring(0, 10) || '暂无信息'
                                }</span>
                            </div>
                            <div className='popover-item'>
                                <SolutionOutlined className='popover-icons'/>
                                <span>{
                                    AuthorInfo?.occupation || '暂无信息'
                                }</span>
                            </div>
                            <div className='popover-item'>
                                <ShopOutlined className='popover-icons'/>
                                <span>{
                                    AuthorInfo?.company || '暂无信息'
                                }</span>
                            </div>
                            <div className='popover-item'>
                                <PhoneOutlined className='popover-icons'/>
                                <span>{ AuthorInfo?.phone || '暂无信息' }</span>
                            </div>
                            <div className='popover-item'>
                                <MailOutlined className='popover-icons'/>
                                <span>{ AuthorInfo?.email || '暂无信息' }</span>
                            </div>
                            <div className='popover-item'>
                                <EnvironmentOutlined className='popover-icons'/>
                                <span>{
                                    AuthorInfo?.country || AuthorInfo?.province || AuthorInfo?.city
                                        ? (
                                            `${AuthorInfo?.country ? AuthorInfo?.country : ''}
                                          ${AuthorInfo?.province ? AuthorInfo?.province : ''}
                                          ${AuthorInfo?.city ? AuthorInfo?.city : ''}`
                                        )
                                        : '暂无信息'
                                }</span>
                            </div>
                        </div>
                    )}
                >
                    <div className='posting-preview-header-photo'
                        style={{
                            backgroundImage: `url(${props.authorProfilePhoto?.pic || DEFAULT_PHOTO_URL})`
                        }}>
                    </div>
                </Popover>
                <div className='posting-preview-header-username'>
                    <p className='user-name'>{
                        AuthorInfo?.firstname || AuthorInfo?.lastname
                            ? `${AuthorInfo?.firstname || ''} ${AuthorInfo?.lastname || ''}`
                            : 'unknown user'
                    }</p>
                    <p className='create-time'>
                        {articleInfo?.create_time?.substring(0, articleInfo?.create_time.length - 10) || ''}
                    </p>
                </div>
                <div className='posting-preview-header-likes'>
                    <div className='icon-container'>
                        <div className='likes'>
                            {
                                props.isLiked
                                    ? <LikeTwoTone
                                        title='取消点赞'
                                        style={{ fontSize: 18 }}
                                        onClick={(ev) => props.handleToggleLikeArticle('dislike', props.index, ev)}
                                    />
                                    : <LikeOutlined
                                        title='点赞'
                                        style={{ fontSize: 18 }}
                                        onClick={(ev) => props.handleToggleLikeArticle('like', props.index, ev)}
                                    />
                            }
                            <div className='icon-text'>{JSON.parse(articleInfo?.likes)?.length || 0}</div>
                        </div>
                        <div className='likes'>
                            {
                                props.isCollect
                                    ? <HeartTwoTone
                                        title='取消收藏'
                                        style={{ fontSize: 18 }}
                                        onClick={(ev) => props.handleToggleCollectArticle('uncollect', props.index, ev)}/>
                                    : <HeartOutlined
                                        title='收藏'
                                        style={{ fontSize: 18 }}
                                        onClick={(ev) => props.handleToggleCollectArticle('collect', props.index, ev)}/>
                            }
                            <div className='icon-text'>{JSON.parse(articleInfo?.collects)?.length || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='posting-preview-title' title={`文章标题：${articleInfo?.title || ''}`}>
                {articleInfo?.title || ''}
            </div>
            <div className='posting-preview-catagory'>
                <div className='catagory' title='分类'>{articleInfo?.catagory
                    ? `关于${(catagory?.find((item) =>
                        item.id === parseInt(articleInfo.catagory)))?.catagory_name || '无分类'}`
                    : '无分类'}</div>
                <div className='tags'>
                    {
                        JSON.parse(articleInfo?.tags).map((item, index) => {
                            return (<div className='tag' key={index} style={{ backgroundColor: colorList[index % colorList.length] }}>
                                <span className='tag-text' title={item}>{item}</span>
                            </div>);
                        })
                    }
                </div>
            </div>
            <div className='posting-preview-content'>
                {articleInfo?.content || ''}
            </div>
            <div className='posting-preview-picture-container'
                onMouseEnter={handleMouseEnterPicContainer}
                onMouseLeave={handleMouseLeavePicContainer}
            >
                <div className='picture-scroll-button'
                    style={{ right: '10px', display: isScrollBtnShow.picScroll ? 'block' : 'none' }}
                    onMouseDown={() => handlePictureScroll('right')}
                    onMouseUp={handlePictureScrollStop}
                >
                    <RightOutlined />
                </div>
                <div className='picture-scroll-button'
                    style={{ left: '10px', display: isScrollBtnShow.picScroll ? 'block' : 'none' }}
                    onMouseDown={() => handlePictureScroll('left')}
                    onMouseUp={handlePictureScrollStop}
                >
                    <LeftOutlined />
                </div>
                <div className='posting-preview-picture-scroller'>
                    { articleInfo
                        ? JSON.parse(articleInfo.pictures).map((item, index) => (
                            <Image
                                key={index}
                                className='posting-preview-picture'
                                src={item.thumbUrl}/>
                        ))
                        : null
                    }
                </div>
            </div>
        </div>
    );
};

export default PostingPreview;
