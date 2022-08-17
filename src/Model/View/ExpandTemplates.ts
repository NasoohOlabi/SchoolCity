import { createSlice } from '@reduxjs/toolkit'

export const templatesGalleryExpandedSlice = createSlice({
	name: 'templatesGalleryExpanded',
	initialState: {
		expanded: false,
	},
	reducers: {
		expand: (state) => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			state.expanded = true
		},
		collapse: (state) => {
			state.expanded = false
		},
		toggle: (state) => {
			state.expanded = !state.expanded
		},
	},
})

// Action creators are generated for each case reducer function
export const { expand, collapse, toggle } = templatesGalleryExpandedSlice.actions

export default templatesGalleryExpandedSlice.reducer