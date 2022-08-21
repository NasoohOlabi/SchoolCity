import { faToiletPaperSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-tailwind/react";
import { useUser } from "Model/Auth/hooks/useUser";

interface HeaderRightProps {}

const HeaderRight: ({}: HeaderRightProps) => JSX.Element = () => {
	const { currentUser } = useUser();
	return (
		<>
			<IconButton className="hidden md:inline-flex h-20 w-20 ml-5 md:ml-20 rounded ">
				<FontAwesomeIcon icon={faToiletPaperSlash} />
			</IconButton>
			<img
				loading="lazy"
				className="cursor-pointer h-12 w-12 rounded-full ml-2"
				src={(currentUser && currentUser.photoURL) || ""}
				// onClick={() => signOut()}
				alt={(currentUser && currentUser.displayName) || "avatar"}
			/>
		</>
	);
};

export default HeaderRight;
