import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	open: true
}

export type sidebarOpenStateType = typeof initialState

export const sidebarOpenSlice = createSlice({
	name: 'sidebarOpen',
	initialState,
	reducers: {
		open: (state) => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn	 actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			state.open = true;
		},
		close: (state) => {
			state.open = false
		},
		toggle: (state) => {
			state.open = !state.open
		},
	},
})

// Action creators are generated for each case reducer function
export const { open, close, toggle } = sidebarOpenSlice.actions

export default sidebarOpenSlice.reducer