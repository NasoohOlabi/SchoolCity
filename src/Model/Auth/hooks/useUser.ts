import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { User } from "firebase/auth";
import { auth } from "firebase/firebase";
import { useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../getCurrentUser";

export const useUser = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [pending, setPending] = useState<boolean>(true);
	const db = useContext(SchoolCityDBContext);
	useEffect(() => {
		auth.onAuthStateChanged((user: User | null) => {
			setCurrentUser(user);
			console.log('user?.photoURL = ', user?.photoURL);
			// if (user?.photoURL && db && false)
			// 	fetch(user?.photoURL, {
			// 		mode: "cors", // no-cors, *cors, same-origin
			// 	}).then((response) => response.blob()).then(async (blob) => {
			// 		try {
			// 			db.transaction('rw', db.settings, () => {
			// 				db.settings.where({ name: user?.displayName + ' photo ' + user?.uid }).first().then(v => {
			// 					console.log('v = ', v);
			// 					if (v.id) {
			// 						db.settings.update(v.id, {
			// 							// @ts-ignore
			// 							name: user?.displayName + ' photo ' + user?.uid,
			// 							value: blob
			// 						}).catch(error => {
			// 							console.log('useUser1 error = ', error);
			// 						});

			// 					}
			// 				});
			// 				db.settings.where({ name: 'currentUser' }).first().then(v => {
			// 					console.log('v = ', v);
			// 					if (v.id) {
			// 						db.settings.update(v.id, {
			// 							value: v
			// 						}).catch(error => {
			// 							console.log('useUser1 error = ', error);
			// 						});
			// 					}
			// 				});
			// 				db.settings.update(
			// 					// @ts-ignore
			// 					db.settings.where({ name: 'currentUser' }).first().id, { value: user }
			// 				).catch(error => {
			// 					console.log('useUser2 error = ', error);
			// 				})
			// 			}
			// 			).catch(error => {
			// 				console.log('useUser3 error = ', error);
			// 			})
			// 		} catch (error) {

			// 			console.log('useUser4 error = ', error);
			// 		}
			// 	})
			setPending(false);
		});
		if (!pending)
			setCurrentUser(getCurrentUser());
	}, [getCurrentUser()]);
	if (!currentUser && db) {
		const s = db.settings.where({ name: 'currentUser' }).first()
		// @ts-ignore
		s.value && s.value.then((user) => {
			console.log('await db.settings.where({ name: \'currentUser\' }).first().value = ', user);
		})
	}
	return { currentUser, setCurrentUser, pending }
}