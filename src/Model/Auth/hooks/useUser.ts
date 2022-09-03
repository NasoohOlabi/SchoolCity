import { User } from "firebase/auth";
import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../getCurrentUser";

export const useUser = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
	const [pending, setPending] = useState(true)
	useEffect(() => {
		auth.onAuthStateChanged((user: User | null) => {
			// console.log(`user set to ${JSON.stringify(user?.toJSON())} by observer`);
			setCurrentUser(user);
			if (pending) {
				console.log(`pending ${pending} set to false by observer`);
				setPending(false)
			}
		})
	}, []);
	// const Signout =  () => {
	// 	currentUser && db && db.user.put(null, currentUser.uid).catch('Failed to store User');
	// 	const ans = auth.signOut();
	// 	// console.log("ans = ", ans);
	// }
	return { currentUser, setCurrentUser, pending, signedOut: currentUser === null }
}