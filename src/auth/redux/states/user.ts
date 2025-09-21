import { User } from '../../models/user.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: User = {
    id: null,
    username: '',
    token: null,
    roles: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => action.payload,
        resetUser: () => initialState,
    },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;