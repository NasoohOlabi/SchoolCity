import { SchoolCityIDBTemplate } from "DB/schema";
import { useSelector } from "react-redux";
import TemplateGallery from "./TemplateGallery";
interface TemplatesSectionProps {
	table: SchoolCityIDBTemplate;
}

const TemplatesSection: ({ table }: TemplatesSectionProps) => JSX.Element = ({
	table,
}) => {
	const expanded = useSelector(
		(state: { templatesExpanded: { expanded: boolean } }) =>
			state.templatesExpanded.expanded
	);

	const height = expanded ? "h-full" : "";

	return (
		<section className={"flex items-center px-4 py-2 bg-gray-200 " + height}>
			<div className="mx-auto w-4/5">
				<TemplateGallery table={table} />
			</div>
		</section>
	);
};

export default TemplatesSection;
