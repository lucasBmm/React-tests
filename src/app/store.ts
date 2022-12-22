import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user';

const store = configureStore({
    reducer: {
        // Reducers
        userReducer,
    }
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;