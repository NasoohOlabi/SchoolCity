import ManyToOne from "components/Details/ManyToOne";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useContext } from "react";

export interface DetailsSectionSubjectsProps {
	lst: { teacherId: number; subjectId: number }[];
	disabled: boolean;
	sectionId: number;
}

const DetailsSectionSubjects: ({}: DetailsSectionSubjectsProps) => JSX.Element =
	({ lst, disabled, sectionId }) => {
		const db = useContext(SchoolCityDBContext);
		const teacherIds = lst.map((o) => o.teacherId);
		const subjectIds = lst.map((o) => o.subjectId);

		return (
			<div>
				{teacherIds.map((teacherId, index) => (
					<div
						key={index}
						className="inline-block rounded-md border-solid border-2 border-gray-400 m-2 p-2"
					>
						<ManyToOne
							selected={teacherId}
							one="teacher"
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
