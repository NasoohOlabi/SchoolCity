import { configureStore } from '@reduxjs/toolkit';
import { ITemplate } from "../Model/Types";
import recentlyUsedTemplatesSliceReducer from "./Schools/Templates/RecentlyUsedTemplates";
import templatesGalleryExpandedSliceReducer from "./View/ExpandTemplates";
import headerTitleSliceReducer, { headerTitleStateType } from './View/Header/title';

export interface IStore {
    templatesExpanded: {
        expanded: boolean
    },
    recentlyUsedTemplates: {
        value: ITemplate[]
    },
    headerTitleSlice: headerTitleStateType
};

export const store = {
    templatesExpanded: templatesGalleryExpandedSliceReducer,
    recentlyUsedTemplates: recentlyUsedTemplatesSliceReducer,
    headerTitleSlice: headerTitleSliceReducer
}


export default configureStore({
    reducer: store
})