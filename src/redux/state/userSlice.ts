import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: number | null;
    username: string | null;
    email: string | null;
    phoneNumber: string | null;
    token: string | null;
    isLoggedIn?: boolean;
}

const initialState: UserState = {
    id: null,
    username: null,
    email: null,
    phoneNumber: null,
    token: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
            state.token = action.payload.token;
            state.isLoggedIn = true;
        },
        logoutUser: (state) => {
            state.id = null;
            state.username = null;
            state.email = null;
            state.phoneNumber = null;
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;