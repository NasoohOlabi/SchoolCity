import Icon from "../icon/Icon";
import { IconButton } from "@material-tailwind/react";
// import { signOut, useSession } from "next-auth/react";

interface HeaderRightProps {}

const HeaderRight: React.FC<HeaderRightProps> = () => {
	// const session = useSession();

	return (
		<>
			<IconButton className="hidden md:inline-flex h-20 w-20 ml-5 md:ml-20 rounded ">
				<Icon name="apps" color="gray" />
			</IconButton>
			<img
				loading="lazy"
				className="cursor-pointer h-12 w-12 rounded-full ml-2"
				src={""}
				// onClick={() => signOut()}
				alt="avatar"
			/>
		</>
	);
};

export default HeaderRight;
