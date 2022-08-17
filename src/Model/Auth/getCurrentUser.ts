import { auth } from "firebase/firebase"

export const getCurrentUser = () => {
	return auth.currentUser
} 