import { User } from "firebase/auth";
import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../getCurrentUser";

export const useUser = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [pending, setPending] = useState<boolean>(true);
	useEffect(() => {
		auth.onAuthStateChanged((user: User | null) => {
			setCurrentUser(user);
			setPending(false);
		});
		if (!pending)
			setCurrentUser(getCurrentUser());
	}, [getCurrentUser()]);
	return { currentUser, setCurrentUser, pending }
}