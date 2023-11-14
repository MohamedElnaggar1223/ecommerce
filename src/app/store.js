import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "../features/auth/authSlice";
import menuSlice from "../features/header/menuSlice"

export const store = configureStore(
    {
        reducer: 
        {
            [apiSlice.reducerPath]: apiSlice.reducer,
            auth: authSlice,
            menu: menuSlice
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(apiSlice.middleware),
        devTools: true
    })