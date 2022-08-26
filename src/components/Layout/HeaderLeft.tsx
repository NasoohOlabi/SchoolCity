import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-tailwind/react";
import useStateCtx from "components/hooks/useStateCtx";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderLeftProps {}

const HeaderLeft: (args: HeaderLeftProps) => JSX.Element = () => {
	const [expanded, setTemplatesExpanded] = useStateCtx(
		"templatesExpanded",
		"headerLeft"
	);
	const title = useStateCtx("title", "header left")[0];
	const [sidebarExpanded, setSidebarExpanded] = useStateCtx(
		"sidebarExpanded",
		"headerLeft"
	);

	const path = useLocation().pathname.split("/");
	// console.log(
	// 	"path[path.length - 1].toLowerCase() = ",
	// 	path[path.length - 1].toLowerCase()
	// );
	const backFromNew = path[path.length - 1].toLowerCase() === "new";
	const navigate = useNavigate();

	const v = {
		arrow: expanded || sidebarExpanded || backFromNew ? faArrowLeft : faBars,
		action: () => {
			console.log("im scared");
			if (expanded) setTemplatesExpanded(false);
			else if (backFromNew) navigate("../");
			else setSidebarExpanded(true);
			console.log(`sidebarExpanded = `, sidebarExpanded);
		},
	};

	return (
		<>
			<IconButton
				className="hidden md:inline-flex h-20 w-20 rounded "
				onClick={v.action}
			>
				{/* <Icon name="menu" size="3xl" /> */}
				<FontAwesomeIcon icon={v.arrow} />
			</IconButton>
			{/* <div className="hidden md:inline-flex">
				<FontAwesomeIcon icon={faAudioDescription} />
			</div> */}

			<h1
				className="hidden md:inline-flex ml-2 text-gray-700 
          text-2xl"
			>
				{title}
			</h1>
		</>
	);
};

export default HeaderLeft;
