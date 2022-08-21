import React from "react";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import HeaderSearch from "./HeaderSearch";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
	return (
		<header
			className="sticky top-0 z-40 flex items-center px-4 py-2 
      shadow-md bg-white "
		>
			<HeaderLeft />
			<HeaderSearch />
			<HeaderRight />
		</header>
	);
};

export default Header;
