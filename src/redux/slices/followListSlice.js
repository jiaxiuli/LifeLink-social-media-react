/*
 * @Author: 李佳修
 * @Date: 2022-05-05 13:38:54
 * @LastEditTime: 2022-05-05 15:47:06
 * @LastEditors: 李佳修
 * @FilePath: /LifeLink-socal-media-app-nodeJS-server/Users/lijiaxiu/Documents/code/LifeLink-social-media-react/src/redux/slices/followListSlice.js
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../apis/userService';
export const getFollowedUserInfo = createAsyncThunk(
    'followList/getFollowedUserInfo',
    async (userListStr) => {
        try {
            const response = await UserService.getFollowedUserInfo(userListStr);
            if (response.data.code === 200) {
                return response.data.data;
            } else {
                throw response.message;
            }
        } catch (err) {
            return err;
        }
    }
);

const initialState = {
    list: [],
    status: 'idle',
    error: ''
};

const followListSlice = createSlice({
    name: 'followList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFollowedUserInfo.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(getFollowedUserInfo.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.list = action.payload;
            })
            .addCase(getFollowedUserInfo.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            });
    }
});

// export const {} = followListSlice.actions;
export default followListSlice.reducer;
