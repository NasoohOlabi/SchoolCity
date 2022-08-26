import ManyToOne from "components/Details/ManyToOne";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext } from "react";

export interface DetailsSectionSubjectsProps {
	lst: { teacherId: number; subjectId: number }[];
	disabled: boolean;
	sectionId: number;
}

const DetailsSectionSubjects: ({}: DetailsSectionSubjectsProps) => JSX.Element =
	({ lst, disabled, sectionId }) => {
		const db = useContext(SchoolCityDBContext);
		if (!db) return <p>cant't access db</p>;
		const teacherIds = lst.map((o) => o.teacherId);
		const subjectIds = lst.map((o) => o.subjectId);
		const teachers = useLiveQuery(
			() => db.teacher.where("id").anyOf(teacherIds),
			[]
		);
		const subjects = useLiveQuery(
			() => db.subject.where("id").anyOf(subjectIds),
			[]
		);
		return (
			<div>
				{teacherIds.map((teacherId, index) => (
					<div
						key={index}
						className="rounded-md border-solid border-2 border-gray-400 m-2 p-2"
					>
						<ManyToOne
							selected={teacherId}
							one="teacher"
							many="section"
							disabled={disabled}
							setFk={function (id: IndexableType): void {
								db.section.update(sectionId, {
									subjects: lst.map((o, i) =>
										i === index
											? { teacherId: id, subjectId: subjectIds[i] }
											: o
									),
								});
							}}
						/>
						<ManyToOne
							selected={subjectIds[index]}
							one="subject"
							many="section"
							disabled={disabled}
							setFk={function (id: IndexableType): void {
								db.section.update(sectionId, {
									subjects: lst.map((o, i) =>
										i === index
											? { subjectId: id, teacherId: teacherIds[i] }
											: o
									),
								});
							}}
						/>
					</div>
				))}
			</div>
		);
	};

export default DetailsSectionSubjects;
