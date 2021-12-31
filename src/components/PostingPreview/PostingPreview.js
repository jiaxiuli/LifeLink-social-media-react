/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect } from 'react';
import $ from 'jquery';
import { LikeTwoTone, HeartTwoTone, LeftOutlined, RightOutlined } from '@ant-design/icons';
import userService from '../../apis/userService';
import articleService from '../../apis/articleService';
import { DEFAULT_PHOTO_URL } from '../../static/defaultProfilePhoto';
import './PostingPreview.scss';
import { useState } from 'react/cjs/react.development';
import { message, Image, Popover } from 'antd';

const PostingPreview = (props) => {
    const [isScrollBtnShow, setIsScrollBtnShow] = useState({
        picScroll: false,
        tagScroll: false
    });
    const [scrollOffset, setScrollOffset] = useState({
        picScroll: 0,
        tagScroll: 0
    });
    const [AuthorInfo, setAuthorInfo] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PHOTO_URL);
    const { userInfo, articleInfo, catagory } = props;
    const colorList = ['#19CAAD', '#D6D5B7', '#8CC7B5', '#D1BA74', '#A0EEE1', '#E6CEAC', '#BEE7E9', '#ECAD9E', '#BEEDC7', '#F4606C'];
    const [likeAndCollect, setLikeAndCollect] = useState({
        likes: articleInfo.likes,
        collects: articleInfo.collects
    });

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

    useLayoutEffect(() => {

    }, []);

    function handleLikeArticle () {
        const articleId = articleInfo.id;
        const curLikes = likeAndCollect.likes;
        articleService.updateArticleInfo(articleId, { likes: curLikes + 1 })
            .then((res) => {
                if (res.data.code === 200) {
                    setLikeAndCollect((prev) => {
                        prev.likes += 1;
                        return { ...prev };
                    });
                }
            });
    }
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
        <div className='posting-preview-main-container'>
            <div className='posting-preview-header'>
                <Popover
                    trigger='hover'
                    placement='leftTop'
                    arrowPointAtCenter
                    autoAdjustOverflow
                    content={() => (
                        <div className='photo-popover-container'>
                            <div className='popover-photo' style={{
                                backgroundImage: `url(${profilePhoto || DEFAULT_PHOTO_URL})`
                            }}>
                            </div>
                            <div className='popover-slogan'>{`-"${AuthorInfo.slogan}"`}</div>
                        </div>
                    )}
                >
                    <div className='posting-preview-header-photo'
                        style={{
                            backgroundImage: `url(${profilePhoto || DEFAULT_PHOTO_URL})`
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
                        {articleInfo?.create_time
                            .substring(0, articleInfo?.create_time.length - 10) || ''}
                    </p>
                </div>
                <div className='posting-preview-header-likes'>
                    <div className='icon-container'>
                        <div className='likes' title='点赞数'>
                            <LikeTwoTone style={{ fontSize: 18 }} onClick={handleLikeArticle}/>
                            <div className='icon-text'>{likeAndCollect?.likes?.toString() || 0}</div>
                        </div>
                        <div className='likes' title='收藏数'>
                            <HeartTwoTone style={{ fontSize: 18 }}/>
                            <div className='icon-text'>{likeAndCollect?.collects?.toString() || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='posting-preview-title' title={`文章标题：${articleInfo?.title || ''}`}>
                {articleInfo?.title || ''}
            </div>
            <div className='posting-preview-catagory'>
                <div className='catagory' title='分类'>{articleInfo?.catagory
                    ? `关于${(catagory?.find((item) => item.id === parseInt(articleInfo.catagory)))?.catagory_name || '无分类'}`
                    : '无分类'}</div>
                <div className='tags'>
                    {
                        JSON.parse(articleInfo?.tags).map((item, index) => {
                            return (<div className='tag' key={index} style={{ backgroundColor: colorList[index] }}>
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
