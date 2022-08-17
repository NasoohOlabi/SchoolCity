import { faAngleDown, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import type { IStore } from "../../../Model/Model";
import { expand } from "../../../Model/View/ExpandTemplates";
import TemplateTile from "./TemplateTile";

interface RecentlyUsedProps {}

const RecentlyUsed: React.FC<RecentlyUsedProps> = ({}) => {
	const dispatch = useDispatch();
	const expanded = useSelector(
		(state: { templatesExpanded: { expanded: boolean } }) =>
			state.templatesExpanded.expanded
	);
	const recentlyUsedTemplates = useSelector(
		(state: IStore) => state.recentlyUsedTemplates.value
	);

	return (
		<>
			<div className="flex justify-between w-full items-center align-middle">
				<div>Recently Used</div>
				{!expanded && (
					<div className="flex align-middle items-center">
						<Button
							className=""
							color="gray"
							onClick={() => dispatch(expand())}
						>
							Template Gallery
							<FontAwesomeIcon icon={faAngleDown} />
						</Button>
						<FontAwesomeIcon icon={faEllipsisV} />
					</div>
				)}
			</div>
			<section className="recently-item-section flex justify-items-start w-full items-center align-middle">
				{recentlyUsedTemplates.map(({ id, title, description }) => (
					<TemplateTile
						key={id}
						title={title}
						description={description}
						id={id}
					/>
				))}
			</section>
		</>
	);
};

export default RecentlyUsed;
