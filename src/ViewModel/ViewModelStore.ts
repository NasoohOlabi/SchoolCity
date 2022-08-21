import { createContext } from "react";


export interface IViewModel {
	sidebarExpanded: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const ViewModel = createContext<IViewModel>({} as IViewModel);


export default ViewModel;