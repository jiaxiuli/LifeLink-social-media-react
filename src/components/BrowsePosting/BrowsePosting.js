/* eslint-disable no-unused-vars */
import React from 'react';
import { useState, useEffect } from 'react/cjs/react.development';
import { userInfoStore } from '../../store/informationStore';
import articleService from '../../apis/articleService';
import './BrowsePosting.scss';

const BrowsePosting = () => {
    const [info, setInfo] = useState(null);
    const [state, setState] = useState({
        articleList: []
    });
    // 获取用户信息
    useEffect(() => {
        const obj = userInfoStore.getState();
        setInfo(() => {
            return { ...obj };
        });
        const cancelSub = userInfoStore.subscribe(() => {
            const obj = userInfoStore.getState();
            setInfo(() => {
                return { ...obj };
            });
        });
        return () => {
            cancelSub();
            setInfo(() => null);
        };
    }, []);
    useEffect(() => {
        // 获取关注列表
        if (info) {
            const followListStr = info.follow;
            if (followListStr) {
                articleService.getArticlesFromUserList(followListStr).then((res) => {
                    console.log(res);
                }, (res) => {
                    console.log(res);
                });
            }
        }
    }, [info]);
    return (
        <div className='browse-posting-main'>
            browse posting
        </div>
    );
};

export default BrowsePosting;
