import React, { useEffect } from 'react';
import { LikeTwoTone, HeartTwoTone } from '@ant-design/icons';
import './PostingPreview.scss';

const PostingPreview = (props) => {
    useEffect(() => {
        console.log(props);
    });
    return (
        <div className='posting-preview-main-container'>
            <div className='posting-preview-header'>
                <div className='posting-preview-header-photo'></div>
                <div className='posting-preview-header-username'>
                    <p className='user-name'>Jack Smith</p>
                    <p className='create-time'>发布于2021-12-28 22:59</p>
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
        </div>
    );
};

export default PostingPreview;
