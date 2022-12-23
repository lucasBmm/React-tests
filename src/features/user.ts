import { RootState } from './../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type userState = {
    email: string,
    token: string
}

export const INITIAL_STATE: userState = {
    email:  localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')!).email : '',
    token:  localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')!).token : ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {
        addUser: (state, action: PayloadAction<userState>) => {
            localStorage.setItem('user', JSON.stringify({
                email: action.payload.email,
                token: action.payload.token
            }));

            state.email = action.payload.email;
            state.token = action.payload.token;
        },
        removeUser: state => {
            localStorage.removeItem('user');

            state = { email: '', token: '' };
        }
    }
});

export const { addUser, removeUser } = userSlice.actions;

export const selectUser = (state: RootState) => ({ user: state.userReducer });

export default userSlice.reducer;