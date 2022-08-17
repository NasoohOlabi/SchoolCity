import { useSelector } from "react-redux";
import GalleryGrid from "./GalleryGrid";
import RecentlyUsed from "./RecentlyUsed";

interface TemplateGalleryProps {}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({}) => {
	const expanded = useSelector(
		(state: { templatesExpanded: { expanded: boolean } }) =>
			state.templatesExpanded.expanded
	);

	return (
		<>
			<RecentlyUsed />
			{expanded ? <GalleryGrid /> : ""}
		</>
	);
};

export default TemplateGallery;
