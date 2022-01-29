/* eslint-disable no-debugger */
import React from 'react';
import $ from 'jquery';
import { useState, useEffect } from 'react/cjs/react.development';
import {
    LikeOutlined,
    HeartOutlined,
    LikeTwoTone,
    HeartTwoTone,
    CommentOutlined,
    CloseCircleOutlined,
    LikeFilled,
    HeartFilled
} from '@ant-design/icons';
import infoStore from '../../store/informationStore';
import userService from '../../apis/userService';
import PostingPreview from '../PostingPreview/PostingPreview';
import articleService from '../../apis/articleService';
import { message, Empty, Select, Input, Divider, Avatar, Spin, Image, Button } from 'antd';
import './BrowsePosting.scss';

const BrowsePosting = () => {
    const [state, setState] = useState({
        userInfo: {},
        articleList: [],
        followedUserInfo: [],
        catagory: []
    });
    const [curArticleIndex, setCurArticleIndex] = useState(-1);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState([]);
    const [isListFinal, setIsListFinal] = useState(false);
    const [isGetMoreArticleLoading, setIsGetMoreArticleLoading] = useState(false);
    const [picList, setPicList] = useState([]);
    const { Search } = Input;
    const { TextArea } = Input;
    function initPageData () {
        const reduxInfo = infoStore.getState();
        const user = reduxInfo.userInfo;
        const followed = reduxInfo.followedUserInfo;
        const catagory = reduxInfo.catagoryInfo;

        setState((prev) => {
            prev.userInfo = user;
            prev.followedUserInfo = followed;
            prev.catagory = catagory;
            return { ...prev };
        });
    }
    // 获取用户信息和关注者信息
    useEffect(() => {
        initPageData();
        const cancelSub = infoStore.subscribe(() => {
            initPageData();
        });
        return () => {
            cancelSub();
        };
    }, []);

    useEffect(() => {
        // 监听滚动条是否到达底部
        $('.browse-posting-content-preview')[0].addEventListener('scroll', handleListenScroller);
        return () => {
            $('.browse-posting-content-preview')[0].removeEventListener('scroll', handleListenScroller);
        };
    }, [state.articleList]);

    useEffect(() => {
        if (state.followedUserInfo.length && state.userInfo) {
            requestArticleListByUserList();
            requestFollowedUserPhoto();
        }
    }, [state.userInfo, state.followedUserInfo]);

    function handleListenScroller () {
        if (!isListFinal) {
            const listArea = $('.browse-posting-content-preview')[0];
            const { scrollHeight, scrollTop, clientHeight } = listArea;
            if (scrollHeight - scrollTop <= clientHeight) {
                getMoreArticle();
            }
        }
    }

    function getMoreArticle () {
        setIsGetMoreArticleLoading(true);
        requestArticleListByUserList();
    }

    function requestFollowedUserPhoto () {
        // 获取关注者头像
        const following = state.followedUserInfo;
        following.push(state.userInfo);
        const reqList = following.map(async (item) => {
            return new Promise((resolve, reject) => {
                userService.getProfilePhoto(item.pic_id).then((res) => {
                    if (res.data.code === 200) {
                        resolve({
                            pic: res.data.data.pic,
                            userId: item.id
                        });
                    } else {
                        throw new Error();
                    }
                }).catch(() => {
                    reject(new Error());
                });
            });
        });
        Promise.all(reqList).then((res) => {
            setProfilePhoto(res);
        });
    }

    function requestArticleListByUserList () {
        // 获取关注列表
        let followListStr = state.userInfo.follow;
        if (followListStr) {
            let followList = JSON.parse(followListStr);
            if (!followList.includes((item) => item.id === state.userInfo.id)) {
                followList.unshift(state.userInfo.id);
            }
            followListStr = JSON.stringify(followList);
            let lastArticleId = -1;
            if (state.articleList.length) {
                lastArticleId = state.articleList[state.articleList.length - 1].id;
            }
            // 获取文章列表
            articleService.getArticlesFromUserList(followListStr, lastArticleId).then((res) => {
                if (res.data.code === 200) {
                    setState((prev) => {
                        // 去重
                        const result = res.data.data.result.filter((item) => !prev.articleList.find((art) => art.id === item.id));
                        prev.articleList = prev.articleList.concat(result);
                        return { ...prev };
                    });
                    setIsListFinal(res.data.data.isFinal);
                    setIsGetMoreArticleLoading(false);
                }
            }, () => {
                message.warning('请求数据失败 请重试');
            });
        }
    }

    function handlePreviewClicked (index) {
        setCurArticleIndex(index);
        setPicList(() => [...JSON.parse(state.articleList[index].pictures)]);
    }

    function getFriendWhoLikedArticle () {
        const res = state.followedUserInfo?.filter(
            (item) => JSON.parse(state?.articleList[curArticleIndex]?.likes).includes(item.id)
        );
        const includeSelf = res.findIndex((item) => item.id === state.userInfo.id) !== -1;
        const len = includeSelf ? res.length - 1 : res.length;
        return {
            list: res,
            includeSelf,
            len
        };
    }

    function getFriendWhoCollectedArticle () {
        const res = state.followedUserInfo?.filter(
            (item) => JSON.parse(state?.articleList[curArticleIndex]?.collects).includes(item.id)
        );
        const includeSelf = res.findIndex((item) => item.id === state.userInfo.id) !== -1;
        const len = includeSelf ? res.length - 1 : res.length;
        return {
            list: res,
            includeSelf,
            len
        };
    }

    function getArticleAuthor () {
        const authorId = state?.articleList[curArticleIndex]?.author;
        let username = 'unknown user';
        const checkArr = [...state?.followedUserInfo];
        checkArr.push(state.userInfo);
        checkArr.forEach((item) => {
            if (item.id === authorId) {
                username = `${item.firstname} ${item.lastname}`;
            }
        });
        return username;
    }

    function handleToggleLikeArticle (type, index, ev) {
        ev.nativeEvent.stopImmediatePropagation();
        ev.preventDefault();
        ev.stopPropagation();
        const article = state.articleList[index];
        const articleId = article.id;
        const curLikes = JSON.parse(article.likes);
        const position = curLikes.indexOf(state.userInfo.id);
        if (type === 'like') {
            if (position === -1) {
                curLikes.push(state.userInfo.id);
                articleService.updateArticleInfo(articleId, { likes: JSON.stringify(curLikes) })
                    .then((res) => {
                        if (res.data.code === 200) {
                            const likesStr = res.data.data.likes;
                            setState((prev) => {
                                prev.articleList[index].likes = likesStr;
                                return { ...prev };
                            });
                        }
                    });
            } else {
                message.warning('已经点过赞了');
            }
        } else if (type === 'dislike') {
            if (position !== -1) {
                curLikes.splice(position, 1);
                articleService.updateArticleInfo(articleId, { likes: JSON.stringify(curLikes) })
                    .then((res) => {
                        if (res.data.code === 200) {
                            const likesStr = res.data.data.likes;
                            setState((prev) => {
                                prev.articleList[index].likes = likesStr;
                                return { ...prev };
                            });
                        }
                    });
            } else {
                message.warning('还没有点过赞');
            }
        }
    }

    function handleToggleCollectArticle (type, index, ev) {
        ev.nativeEvent.stopImmediatePropagation();
        ev.preventDefault();
        ev.stopPropagation();
        const article = state.articleList[index];
        const articleId = article.id;
        const curCollect = JSON.parse(article.collects);
        const position = curCollect.indexOf(state.userInfo.id);
        if (type === 'collect') {
            if (position === -1) {
                curCollect.push(state.userInfo.id);
                articleService.updateArticleInfo(articleId, { collects: JSON.stringify(curCollect) })
                    .then((res) => {
                        if (res.data.code === 200) {
                            const collectStr = res.data.data.collects;
                            setState((prev) => {
                                prev.articleList[index].collects = collectStr;
                                return { ...prev };
                            });
                        }
                    });
            } else {
                message.warning('已经收藏过了');
            }
        } else if (type === 'uncollect') {
            if (position !== -1) {
                curCollect.splice(position, 1);
                articleService.updateArticleInfo(articleId, { collects: JSON.stringify(curCollect) })
                    .then((res) => {
                        if (res.data.code === 200) {
                            const collectStr = res.data.data.collects;
                            setState((prev) => {
                                prev.articleList[index].collects = collectStr;
                                return { ...prev };
                            });
                        }
                    });
            } else {
                message.warning('还没有收藏');
            }
        }
    }

    function handleToggleCommentsPopup (action, ev) {
        ev.nativeEvent.stopImmediatePropagation();
        ev.preventDefault();
        ev.stopPropagation();
        if (action === 'open') { setIsCommentsOpen(true); }
        if (action === 'close') { setIsCommentsOpen(false); }
    }

    return (
        <div className='browse-posting-main'>
            <div className='browse-posting-header-bar'>
                <span>筛选: </span>
                <Select className='browse-posting-header-bar-select'>分类</Select>
                <Select className='browse-posting-header-bar-select'>日期</Select>
                <Search className='browse-posting-header-bar-search'></Search>
            </div>
            <div className='browse-posting-content'>
                <div className='browse-posting-content-preview'>
                    {
                        state.articleList.length
                            ? state.articleList.map((item, index) => {
                                const likeList = JSON.parse(item?.likes || '[]');
                                const collectList = JSON.parse(item?.collects || '[]');
                                return (
                                    item
                                        ? <PostingPreview
                                            key={index}
                                            index={index}
                                            articleInfo={item}
                                            followedUserInfo={state.followedUserInfo}
                                            userInfo={state.userInfo}
                                            catagory={state.catagory}
                                            isLiked={likeList.indexOf(state.userInfo.id) !== -1}
                                            isCollect={collectList.indexOf(state.userInfo.id) !== -1}
                                            authorProfilePhoto={profilePhoto.find((p) => p.userId === item.author)}
                                            handlePreviewClicked={handlePreviewClicked}
                                            handleToggleCollectArticle={handleToggleCollectArticle}
                                            handleToggleLikeArticle={handleToggleLikeArticle}
                                        >
                                        </PostingPreview>
                                        : <Spin tip="Loading..."></Spin>);
                            })
                            : <Spin
                                tip="Loading..."
                                style={{
                                    position: 'relative',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}></Spin>
                    }
                    <div style={{
                        position: 'relative',
                        width: 'fit-content',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        {
                            isListFinal
                                ? <span style={{
                                    fontSize: '12px',
                                    color: '#5e5e5e'
                                }}>- End -</span>
                                : (isGetMoreArticleLoading
                                    ? <Spin tip="Loading..."></Spin>
                                    : <Button onClick={getMoreArticle}>获取更多</Button>)
                        }
                    </div>
                </div>
                <div className='browse-posting-content-text'>
                    {
                        curArticleIndex === -1
                            ? <Empty description='暂无数据'></Empty>
                            : (
                                <>
                                    <div className='browse-posting-content-text-title'>
                                        {state?.articleList[curArticleIndex]?.title}
                                    </div>
                                    <div className='browse-posting-content-text-info'>
                                        <span>
                                            {`由${getArticleAuthor()}发布于${state?.articleList[curArticleIndex]?.create_time
                                                .substring(0, state?.articleList[curArticleIndex]?.create_time.length - 10)}`}
                                        </span>
                                        <div className='icon-container'>
                                            <div className='likes'>
                                                {
                                                    JSON.parse(state?.articleList[curArticleIndex]?.likes || '[]')
                                                        .indexOf(state.userInfo.id) === -1
                                                        ? <LikeOutlined
                                                            title='点赞'
                                                            style={{ fontSize: 18 }}
                                                            onClick={
                                                                (ev) => handleToggleLikeArticle('like', curArticleIndex, ev)
                                                            }
                                                        />
                                                        : <LikeTwoTone
                                                            title='取消点赞'
                                                            style={{ fontSize: 18 }}
                                                            onClick={
                                                                (ev) => handleToggleLikeArticle('dislike', curArticleIndex, ev)
                                                            }
                                                        />
                                                }
                                                <div className='icon-text'>
                                                    {JSON.parse(state?.articleList[curArticleIndex]?.likes || '[]').length}
                                                </div>
                                            </div>
                                            <div className='likes'>
                                                {
                                                    JSON.parse(state?.articleList[curArticleIndex]?.collects || '[]')
                                                        .indexOf(state.userInfo.id) === -1
                                                        ? <HeartOutlined
                                                            title='收藏'
                                                            style={{ fontSize: 18 }}
                                                            onClick={
                                                                (ev) => handleToggleCollectArticle('collect', curArticleIndex, ev)
                                                            }
                                                        />
                                                        : <HeartTwoTone
                                                            title='取消收藏'
                                                            style={{ fontSize: 18 }}
                                                            onClick={
                                                                (ev) => handleToggleCollectArticle('uncollect', curArticleIndex, ev)
                                                            }
                                                        />
                                                }
                                                <div className='icon-text'>
                                                    {JSON.parse(state?.articleList[curArticleIndex]?.collects || '[]').length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider style={{ margin: '10px 0px 0px 0px' }}/>
                                    <TextArea
                                        bordered={false}
                                        readOnly
                                        className='browse-posting-content-text-body'
                                        value={state?.articleList[curArticleIndex]?.content}>
                                    </TextArea>
                                    <div
                                        title='打开评论'
                                        className='browse-posting-content-open-comments-button'
                                        onClick={(ev) => handleToggleCommentsPopup('open', ev)}>
                                        <CommentOutlined />
                                    </div>
                                    <div
                                        className='browse-posting-content-comments'
                                        style={{
                                            transform: isCommentsOpen ? 'translate(-50%, 0)' : 'translate(-50%, 100%)'
                                        }}
                                    >
                                        <div
                                            className='browse-posting-content-comments-close'
                                            onClick={(ev) => handleToggleCommentsPopup('close', ev)}
                                        >
                                            <CloseCircleOutlined />
                                        </div>
                                        <div className='browse-posting-content-comments-likes-group'>
                                            {
                                                getFriendWhoLikedArticle().len

                                                    ? (
                                                        <>
                                                            <Avatar.Group
                                                                maxCount={10}
                                                                size={40}
                                                                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                                            >
                                                                {
                                                                    JSON.parse(state?.articleList[curArticleIndex]?.likes).map((item, index) => {
                                                                        const photo = profilePhoto.find((p) => p.userId === item);
                                                                        return (
                                                                            photo
                                                                                ? <Avatar
                                                                                    key={index}
                                                                                    src={photo?.pic}
                                                                                />
                                                                                : null
                                                                        );
                                                                    })
                                                                }
                                                            </Avatar.Group>
                                                            <Avatar size={40}
                                                                style={{
                                                                    color: '#f56a00',
                                                                    backgroundColor: '#fde3cf',
                                                                    marginLeft: '10px'
                                                                }}
                                                                icon={<LikeFilled/>} />
                                                        </>
                                                    )
                                                    : null

                                            }
                                        </div>
                                        <div
                                            className='browse-posting-content-comments-likes-text'
                                            style={{
                                                color: '#6b6b6b',
                                                fontSize: '10px',
                                                fontWeight: '600'
                                            }}>
                                            {
                                                getFriendWhoLikedArticle().len
                                                    ? (`${getFriendWhoLikedArticle().len}
                                                        位朋友${getFriendWhoLikedArticle().includeSelf ? '和你' : ''}觉得很赞`)
                                                    : null
                                            }
                                        </div>
                                        <div className='browse-posting-content-comments-collects-group'>
                                            {
                                                getFriendWhoCollectedArticle().len
                                                    ? (
                                                        <>
                                                            <Avatar.Group
                                                                maxCount={10}
                                                                size={40}
                                                                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                                            >
                                                                {
                                                                    JSON.parse(state?.articleList[curArticleIndex]?.collects).map((item, index) => {
                                                                        const photo = profilePhoto.find((p) => p.userId === item);
                                                                        return (
                                                                            photo
                                                                                ? <Avatar
                                                                                    key={index}
                                                                                    src={photo?.pic}
                                                                                />
                                                                                : null
                                                                        );
                                                                    })
                                                                }
                                                            </Avatar.Group>
                                                            <Avatar size={40}
                                                                style={{
                                                                    color: '#f56a00',
                                                                    backgroundColor: '#fde3cf',
                                                                    marginLeft: '10px'
                                                                }}
                                                                icon={<HeartFilled />} />
                                                        </>
                                                    )
                                                    : null
                                            }
                                        </div>
                                        <div
                                            className='browse-posting-content-comments-collects-text'
                                            style={{
                                                color: '#6b6b6b',
                                                fontSize: '10px',
                                                fontWeight: '600'
                                            }}>
                                            {
                                                getFriendWhoCollectedArticle().len
                                                    ? (`${getFriendWhoCollectedArticle().len}
                                                    位朋友${getFriendWhoCollectedArticle().includeSelf ? '和你' : ''}已收藏该文章`)
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                    }
                </div>
                <div className='browse-posting-content-photo'>
                    <Image.PreviewGroup>
                        {
                            picList?.length
                                ? (
                                    picList.map((item, index) =>
                                        (
                                            <Image
                                                key={index}
                                                className='browse-posting-content-photo-item'
                                                src={item.thumbUrl} />
                                        )
                                    )
                                )
                                : null
                        }
                    </Image.PreviewGroup>
                </div>
            </div>
        </div>
    );
};

export default BrowsePosting;
