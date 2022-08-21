import { configureStore } from '@reduxjs/toolkit';
import templatesGalleryExpandedSliceReducer from "./View/ExpandTemplates";
import sidebarOpenSliceReducer from './View/Layout/sidebarOpen';
import headerTitleSliceReducer, { headerTitleStateType } from './View/Layout/title';

export interface IStore {
    templatesExpanded: {
        expanded: boolean
    },
    headerTitleSlice: headerTitleStateType
    , sidebarOpen: {
        open: boolean
    }
};

export const store = {
    templatesExpanded: templatesGalleryExpandedSliceReducer,
    headerTitleSlice: headerTitleSliceReducer,
    sidebarOpen: sidebarOpenSliceReducer
}


export default configureStore({
    reducer: store
})