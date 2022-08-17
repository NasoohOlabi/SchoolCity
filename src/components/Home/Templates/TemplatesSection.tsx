import { useSelector } from "react-redux";
import TemplateGallery from "./TemplateGallery";
interface TemplatesSectionProps {}

const TemplatesSection: React.FC<TemplatesSectionProps> = ({}) => {
	const expanded = useSelector(
		(state: { templatesExpanded: { expanded: boolean } }) =>
			state.templatesExpanded.expanded
	);

	const height = expanded ? "h-full" : "";

	return (
		<section className={"flex items-center px-4 py-2 bg-gray-200 " + height}>
			<div className="mx-auto w-4/5">
				<TemplateGallery />
			</div>
		</section>
	);
};

export default TemplatesSection;
