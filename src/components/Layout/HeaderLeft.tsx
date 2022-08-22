import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-tailwind/react";
import { collapse } from "Model/View/ExpandTemplates";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { IStore } from "../../Model/Store";
import store from "../../ViewModel/ViewModelStore";

interface HeaderLeftProps {}

const HeaderLeft: React.FC<HeaderLeftProps> = () => {
	const expanded = useSelector(
		(state: IStore) => state.templatesExpanded.expanded
	);
	const title = useSelector((state: IStore) => state.headerTitleSlice.title);

	const dispatch = useDispatch();

	const [sidebarExpanded, setSidebarExpanded] =
		useContext(store).sidebarExpanded;

	const path = useLocation().pathname.split("/");
	console.log(
		"path[path.length - 1].toLowerCase() = ",
		path[path.length - 1].toLowerCase()
	);
	const backFromNew = path[path.length - 1].toLowerCase() === "new";
	const navigate = useNavigate();

	return (
		<>
			<IconButton
				className="hidden md:inline-flex h-20 w-20 rounded "
				onClick={() => {
					dispatch(collapse());
					if (backFromNew) navigate("../");
					else if (!expanded) setSidebarExpanded(!sidebarExpanded);
				}}
			>
				{/* <Icon name="menu" size="3xl" /> */}
				<FontAwesomeIcon
					icon={
						sidebarExpanded || expanded || backFromNew
							? faArrowLeft
							: faBars
					}
				/>
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
