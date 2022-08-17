import { createSlice } from '@reduxjs/toolkit'
import type { ITemplate } from "../../Types"

export const recentlyUsedTemplatesSlice = createSlice({
	name: 'recentlyUsedTemplates',
	initialState: {
		value: [{ id: -1, title: "Blank", description: "" }, { id: 2, title: "HighSchool", description: "Grades 8-12" }] as ITemplate[],
	},
	reducers: {
		add: (state, action) => {
			state.value = [...state.value, action.payload]
		}
	},
})

// Action creators are generated for each case reducer function
export const { add } = recentlyUsedTemplatesSlice.actions

export default recentlyUsedTemplatesSlice.reducer