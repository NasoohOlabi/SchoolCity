import { User } from "firebase/auth";
import { ICurrentUser } from "Model/Types";
import { createContext } from "react";

let user: User | null = null;
let setUser = (newUser: User | null) => {
	user = newUser;
};
export interface ICurrentUserContext {
	user: ICurrentUser | null;
	setUser: (user: User | null) => void;
}

const MyContext = createContext<ICurrentUserContext>({ user: null, setUser });

export const UserProvider = MyContext.Provider;
export const UserContext = MyContext;
