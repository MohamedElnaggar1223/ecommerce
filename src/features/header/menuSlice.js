import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
    name: 'menu',
    initialState: { open: false },
    reducers: {
        setOpen: (state, actions) => {
            const { open } = actions.payload
            state.open = open
        }
    }
})

export const { setOpen } = menuSlice.actions

export default menuSlice.reducer

export const selectOpen = (state) => state.menu.open