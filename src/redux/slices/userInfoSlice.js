/*
 * @Author: 李佳修
 * @Date: 2022-05-05 13:38:54
 * @LastEditTime: 2022-05-05 15:59:10
 * @LastEditors: 李佳修
 * @FilePath: /LifeLink-socal-media-app-nodeJS-server/Users/lijiaxiu/Documents/code/LifeLink-social-media-react/src/redux/slices/userInfoSlice.js
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../apis/userService';

export const getCurrentUser = createAsyncThunk(
    'userInfo/getCurrentUser',
    async (userId) => {
        try {
            const response = await UserService.getUserInfoById(userId);
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
    userInfo: null,
    status: 'idle',
    error: ''
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUser.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.userInfo = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            });
    }
});

// export const {} = userInfoSlice.actions;
export default userInfoSlice.reducer;
