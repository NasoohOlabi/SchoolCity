import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-tailwind/react";
import { collapse } from "Model/View/ExpandTemplates";
import { useDispatch, useSelector } from "react-redux";
import type { IStore } from "../../Model/Model";

interface HeaderLeftProps {}

const HeaderLeft: React.FC<HeaderLeftProps> = () => {
	const expanded = useSelector(
		(state: IStore) => state.templatesExpanded.expanded
	);
	const title = useSelector((state: IStore) => state.headerTitleSlice.title);

	const dispatch = useDispatch();

	return (
		<>
			<IconButton
				className="hidden md:inline-flex h-20 w-20 rounded "
				onClick={() => dispatch(collapse())}
			>
				{/* <Icon name="menu" size="3xl" /> */}
				<FontAwesomeIcon icon={expanded ? faArrowLeft : faBars} />
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
