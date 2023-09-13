import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice(
    {
        name: 'auth',
        initialState: { token: null },
        reducers: 
        {
            setCredentials: (state, action) => 
            {
                const { accessToken } = action.payload
                state.token = accessToken
                localStorage.setItem('loggedIn', JSON.stringify(true))
            },
            logout: (state) => 
            {
                state.token = null
                localStorage.removeItem('loggedIn')
            } 
        }
    })

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token