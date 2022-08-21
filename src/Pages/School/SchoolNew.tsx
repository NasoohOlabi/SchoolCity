import Details from "components/Details";
import { School } from "DB/schema";
import { t } from "Language/t";

interface SchoolNewProps {}

const SchoolNew: React.FC<SchoolNewProps> = ({}) => {
	return (
		<Details
			title={t("New School")}
			table="school"
			selector={{ type: "new", instance: new School("", "", [1, 2]) }}
		/>
	);
};

export default SchoolNew;
