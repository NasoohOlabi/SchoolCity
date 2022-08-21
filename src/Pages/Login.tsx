import { Button } from "@material-tailwind/react";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { IStore } from "Model/Store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth } from "../firebase/firebase";

function Login() {
	let [currentUser, setCurrentUser] = useState<User | null>(null);

	const [pending, setPending] = useState(false);

	const LoginClickEvent = useCallback(() => {
		setPending(true);
		// console.log("auth = ", auth);
		// console.log("auth.onAuthStateChanged = ", auth.onAuthStateChanged);
		// FirebaseUI config.
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				if (credential == null) throw new Error("credentials not found");
				// console.log("credential = ", credential);
				const token = credential.accessToken;
				// console.log("token = ", token);
				// The signed-in user info.
				const user = result.user;
				// console.log("user = ", user);
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				// console.log("errorCode = ", errorCode);
				const errorMessage = error.message;
				// console.log("errorMessage = ", errorMessage);
				// The email of the user's account used.
				const email = error.customData.email;
				// console.log("email = ", email);
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// console.log("credential = ", credential);
				// ...
			});
		// const oauth2Client = new google.auth.OAuth2(
		// 	import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
		// 	import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET,
		// 	import.meta.env.VITE_GOOGLE_DRIVE_REDIRECT
		// );

		// oauth2Client.setCredentials({
		// 	refresh_token: import.meta.env.VITE_GOOGLE_DRIVE_REFRESH_TOKEN,
		// });

		// const drive = google.drive({ version: "v3", auth: oauth2Client });
		// // console.log("drive = ", drive);
	}, []);

	useEffect(() => {
		// console.log("auth.currentUser = ", auth.currentUser);
		currentUser = auth.currentUser;
		// console.log("currentUser = ", currentUser);
		auth.onAuthStateChanged((user: User | null) => {
			// console.log(`auth.onAuthStateChanged(({user}) => {
			// 		currentUser= ${JSON.stringify(user)};
			// 	setPending(false);
			// });`);
			setCurrentUser(user);
			setPending(false);
		});
	}, []);

	const SignoutClickEvent = useCallback(async () => {
		const ans = await auth.signOut();
		// console.log("ans = ", ans);
	}, []);

	return (
		<div>
			{pending ? (
				<h1>pending</h1>
			) : !!currentUser ? (
				<p>
					Hi dude
					<Button onClick={SignoutClickEvent}>Sign out</Button>
				</p>
			) : (
				<h1>
					loginPlease
					<Button onClick={LoginClickEvent}>Login</Button>
				</h1>
			)}
		</div>
	);
}

export default Login;
