import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { SettingName } from "DB/Settings";
import { User } from "firebase/auth";
import { auth } from "firebase/firebase";
import { useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../getCurrentUser";

export const useUser = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [pending, setPending] = useState<boolean>(true);
	const db = useContext(SchoolCityDBContext);
	if (navigator.onLine) {
		useEffect(() => {
			auth.onAuthStateChanged((user: User | null) => {
				setCurrentUser(user);
				setPending(false);
			});
			if (!pending) {
				const user = getCurrentUser();
				if (user)
					db && db.user.put(user.toJSON(), user.uid).catch('Failed to store User');
				setCurrentUser(user);
			}
		}, [getCurrentUser()]);
	} else {
		if (db) {
			db.settings.where({ name: 'currentUser' as SettingName, schoolId: 'global' }).first().then(s => {
				if (s.value) {
					const user = s.value
					console.log('await db.settings.where({ name: \'currentUser\' }).first().value = ', user);
				}
			})
			// @ts-ignore
		}
	}
	return { currentUser, setCurrentUser, pending }
}