import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
    id: number | null;
    username: string | null;
    email: string | null;
    phoneNumber: string | null;
    isLoggedIn?: boolean;
}

const initialState: UserState = {
    id: null,
    username: null,
    email: null,
    phoneNumber: null,
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
            state.isLoggedIn = true;
        },
        logoutUser: (state) => {
            state.id = null;
            state.username = null;
            state.email = null;
            state.phoneNumber = null;
            state.isLoggedIn = false;
        },
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            state.username = action.payload.username ?? state.username;
            state.phoneNumber = action.payload.phoneNumber ?? state.phoneNumber;
        },
    },
});

export const {loginUser, logoutUser, updateUser} = userSlice.actions;
export default userSlice.reducer;