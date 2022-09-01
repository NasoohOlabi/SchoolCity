import { Button } from "@material-tailwind/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useUser } from "Model/Auth/hooks/useUser";
import { useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

function Login() {
	const { currentUser } = useUser();
	const [pending, setPending] = useState(false);

	const LoginClickEvent = useCallback(() => {
		setPending(true);
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
				setPending(false);
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
	}, []);

	return (
		<div>
			{pending ? (
				<h1>pending</h1>
			) : !!currentUser ? (
				<Navigate to="/app/school" />
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
