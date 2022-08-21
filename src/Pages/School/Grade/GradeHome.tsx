import TemplatesSection from "components/Home/Templates/TemplatesSection";
import { IStore } from "Model/Store";
import { setTitle } from "Model/View/Layout/title";
import useTitle from "Model/View/Layout/useTitle";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

interface GradeHomeProps {}

const GradeHome: React.FC<GradeHomeProps> = ({}) => {
	useTitle("gradehome");
	let params = useParams();
	const expanded = useSelector(
		(state: IStore) => state.templatesExpanded.expanded
	);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setTitle(params.schoolName));
	}, []);

	return (
		<div className="App h-full">
			<TemplatesSection table="gradeTemplates" />
			{!expanded && (
				<>
					<h1 className="text-3xl font-bold underline">
						Grades Hello world!
					</h1>
					<h1>Vite + React</h1>
					<div className="card">
						<p>
							Edit <code>src/App.tsx</code> and save to test HMR
						</p>
					</div>
					<p className="read-the-docs">
						Click on the Vite and React logos to learn more
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Incidunt dicta facere modi architecto placeat tenetur
						inventore soluta dignissimos ullam? Ullam iste rem officia
						aperiam porro excepturi illo officiis ea laudantium!
					</p>
				</>
			)}
		</div>
	);
};

export default GradeHome;
