/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useState, useEffect } from 'react/cjs/react.development';
import infoStore from '../../store/informationStore';
import PostingPreview from '../PostingPreview/PostingPreview';
import articleService from '../../apis/articleService';
import { message, Empty, Select, Input } from 'antd';
import './BrowsePosting.scss';

const BrowsePosting = () => {
    const [state, setState] = useState({
        userInfo: {},
        articleList: [],
        followedUserInfo: [],
        catagory: []
    });
    const { Search } = Input;

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
        requestArticleListByUserList();
    }, [state.userInfo, state.followedUserInfo]);

    function requestArticleListByUserList () {
        // 获取关注列表
        if (state.userInfo) {
            let followListStr = state.userInfo.follow;
            if (followListStr) {
                let followList = JSON.parse(followListStr);
                followList.unshift(state.userInfo.id);
                followListStr = JSON.stringify(followList);
                articleService.getArticlesFromUserList(followListStr).then((res) => {
                    if (res.data.code === 200) {
                        setState((prev) => {
                            prev.articleList = res.data.data;
                            return { ...prev };
                        });
                    }
                }, () => {
                    message.warning('请求数据失败 请重试');
                });
            }
        }
    }
    return (
        <div className='browse-posting-main'>
            <div className='browse-posting-header-bar'>
                <span>筛选: </span>
                <Select className='browse-posting-header-bar-select'>分类</Select>
                <Select className='browse-posting-header-bar-select'>日期</Select>
                <Search className='browse-posting-header-bar-search'></Search>
            </div>
            {
                state.articleList.length
                    ? (<div className='browse-posting-content'>
                        <div className='browse-posting-content-preview'>
                            {
                                state.articleList.reverse().map((item, index) => (
                                    item
                                        ? <PostingPreview
                                            key={index}
                                            articleInfo={item}
                                            followedUserInfo={state.followedUserInfo}
                                            userInfo={state.userInfo}
                                            catagory={state.catagory}
                                        >
                                        </PostingPreview>
                                        : null
                                ))
                            }
                        </div>
                        <div className='browse-posting-content-text'></div>
                        <div className='browse-posting-content-photo'></div>
                    </div>)
                    : (<div className='browse-posting-no-data'>
                        <Empty description='暂无数据'></Empty>
                    </div>)
            }
        </div>
    );
};

export default BrowsePosting;
