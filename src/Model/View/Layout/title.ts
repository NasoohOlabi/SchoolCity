import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	title: ""
}

export type headerTitleStateType = typeof initialState

export const headerTitleSlice = createSlice({
	name: 'headerTitle',
	initialState,
	reducers: {
		setTitle: (state, action) => {
			state.title = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const { setTitle } = headerTitleSlice.actions

export default headerTitleSlice.reducer