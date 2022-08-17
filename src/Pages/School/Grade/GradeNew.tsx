import Details from "components/Details";
import useTitle from "Model/View/Header/useTitle";

interface GradeNewProps {}

const GradeNew: React.FC<GradeNewProps> = ({}) => {
	useTitle("New Grade");
	return (
		<Details
			title="Add a New Grade"
			happy="yes"
			jack="shit"
			name="temp grades"
			section={!true}
			atitle="Add a New Grade"
			ahappy="yes"
			ajack="shit"
			aname="temp grades"
			asection="4"
		/>
	);
};

export default GradeNew;
