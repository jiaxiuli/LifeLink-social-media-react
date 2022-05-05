/*
 * @Author: 李佳修
 * @Date: 2022-05-05 13:38:54
 * @LastEditTime: 2022-05-05 14:03:24
 * @LastEditors: 李佳修
 * @FilePath: /LifeLink-socal-media-app-nodeJS-server/Users/lijiaxiu/Documents/code/LifeLink-social-media-react/src/redux/slices/catagorySlice.js
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ArticleService from '../../apis/articleService';

export const getAllCatagory = createAsyncThunk(
    'catagory/getAllCatagory',
    async () => {
        try {
            const response = await ArticleService.getAllCatagory();
            if (response.data.code === 200) {
                return response.data.data;
            } else {
                throw response.data.message;
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

const catagorySlice = createSlice({
    name: 'catagory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCatagory.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(getAllCatagory.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.list = action.payload;
            })
            .addCase(getAllCatagory.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            });
    }
});

// export const {} = catagorySlice.actions;
export default catagorySlice.reducer;
