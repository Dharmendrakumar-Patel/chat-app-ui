import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    userId: string | null;
}

const initialState: UserState = {
    userId: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authUser: (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        },
    },
});

// Action creators are generated for each case reducer function
export const { authUser } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.userId;

export default userSlice.reducer;
