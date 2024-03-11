import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
    isLoggedIn: false,
    loggedInUser: null 
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action) => {
            const {isLoggedIn} = action.payload;
            state.isLoggedIn = isLoggedIn;
        }
    },
});

export const { setIsLoggedIn } = userSlice.actions;
export default userSlice.reducer;
