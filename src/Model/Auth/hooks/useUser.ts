import { auth } from "firebase/firebase";
import { User } from "firebase/auth";
import { useState } from "react";

export const useUser = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [pending, setPending] = useState<boolean>(true);
	auth.onAuthStateChanged((user: User | null) => {
		setCurrentUser(user);
		setPending(false);
	});
	return { currentUser, setCurrentUser, pending }
}