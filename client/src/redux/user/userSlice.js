import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currenUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            error: null;
        },
        signInSuccess: (state, action) => {
            state.currenUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;