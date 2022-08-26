import UserContext from "Model/Auth/UserContext";
import { useContext } from "react";
import Connect from "./Connect";
import ConnectionBtn from "./ConnectionBtn";

interface HeaderRightProps {}

const HeaderRight: ({}: HeaderRightProps) => JSX.Element = () => {
	const currentUser = useContext(UserContext);
	// const currentUser = getCurrentUser();

	// useEffect(() => {
	// 	console.log("HeaderRight currentUser = ", currentUser);
	// }, [currentUser]);

	return (
		<>
			<ConnectionBtn />
			<img
				className="cursor-pointer h-12 w-12 rounded-full ml-2"
				referrerPolicy="no-referrer"
				src={(currentUser && currentUser.photoURL) || ""}
				// onClick={() => signOut()}
				alt={(currentUser && currentUser.displayName) || "avatar"}
			/>
		</>
	);
};

export default HeaderRight;
