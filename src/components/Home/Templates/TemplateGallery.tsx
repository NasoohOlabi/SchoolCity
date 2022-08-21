import { SchoolCityIDBTemplate } from "DB/schema";
import { useSelector } from "react-redux";
import GalleryGrid from "./GalleryGrid";
import RecentlyUsed from "./RecentlyUsed";

interface TemplateGalleryProps {
	table: SchoolCityIDBTemplate;
}

const TemplateGallery: ({ table }: TemplateGalleryProps) => JSX.Element = ({
	table,
}) => {
	const expanded = useSelector(
		(state: { templatesExpanded: { expanded: boolean } }) =>
			state.templatesExpanded.expanded
	);

	return (
		<>
			<RecentlyUsed table={table} />
			{expanded ? <GalleryGrid /> : ""}
		</>
	);
};

export default TemplateGallery;
