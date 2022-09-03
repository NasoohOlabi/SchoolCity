import { Mark, myCrud, Section, Subject } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext } from "react";
import ManyToOne from "./ManyToOne";

export interface SectionSubjectsProps {
	mark: Mark;
	disabled: boolean;
	reRender: any;
}

const SectionSubjects: ({}: SectionSubjectsProps) => JSX.Element = ({
	mark,
	disabled,
	reRender,
}) => {
	const db = useContext(SchoolCityDBContext);
	const section = useLiveQuery(
		() => db.section.get(mark.sectionId),
		[mark.sectionId]
	) as Section;

	const sectionSubjects = useLiveQuery(
		() =>
			db.subject
				.where("id")
				.anyOf(section?.subjects.map((x) => x.subjectId) || [])
				.toArray(),
		[section?.id]
	);
	const dis =
		(section && sectionSubjects && sectionSubjects.map((x) => x.id)) || [];
	return (
		<ManyToOne
			one="subject"
			selected={mark.subjectId}
			disabled={disabled}
			setFk={(id: IndexableType) => {
				// @ts-ignore
				mark.subjectId = id;
				myCrud.update("mark", db, mark);
				reRender();
			}}
			filter={(x: Subject) => {
				return dis.includes(x.id);
			}}
		/>
	);
};

export default SectionSubjects;
