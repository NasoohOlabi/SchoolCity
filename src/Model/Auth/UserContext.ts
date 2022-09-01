import { User } from "firebase/auth";
import { createContext } from "react";


const UserContext = createContext<User | null | undefined>(null)

export default UserContext;