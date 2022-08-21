//ts-ignore
import { useContext, useEffect, useState } from "react";
import "./App.css";
import TryWorker from "./workers/try.worker?worker";
// import z3 from "./workers/Z3.worker?worker";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import {} from "dexie-react-hooks";
import { IStore } from "Model/Store";
import { collapse } from "Model/View/ExpandTemplates";
import useTitle from "Model/View/Layout/useTitle";
import { useDispatch, useSelector } from "react-redux";
import TemplatesSection from "./components/Home/Templates/TemplatesSection";

// do I need Rxjs

{
	/* <nav
	style={{
		borderBottom: "solid 1px",
		paddingBottom: "1rem",
	}}
>
	<Link to="/invoices">Invoices</Link> | <Link to="/expenses">Expenses</Link>
</nav>; */
}

const f = async () => {
	// console.log("hi");
	// console.log(todos);

	// const instance = new ComlinkWorker<typeof import("./workers/try.worker")>(
	// new URL("./workers/try.worker", import.meta.url)
	// );
	// console.log(instance);
	// const result = await instance.add(2, 3);

	// console.log(result);

	const w = new TryWorker();
	console.log(w);
	w.postMessage("fart");

	// const z = new z3();
	// console.log(z);
	// z.postMessage("fart");
};

function App() {
	// gapi.load("client", init);

	useTitle("app");

	const [count, setCount] = useState(0);

	const db = useContext(SchoolCityDBContext);

	const expanded = useSelector(
		(state: IStore) => state.templatesExpanded.expanded
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!!db) {
			console.log("db.student = ", db.student);
		}
		f();
		return () => {
			dispatch(collapse());
		};
	}, []);

	// const w = new Worker(new URL("./workers/try.worker.ts", import.meta.url));

	// w.postMessage("fart");
	// w.postMessage({ data: "fart" });
	return (
		<div className="App h-full">
			<TemplatesSection />
			{!expanded && (
				<>
					<h1 className="text-3xl font-bold underline">Hello world!</h1>
					<h1>Vite + React</h1>
					<div className="card">
						<button onClick={() => setCount((count) => count + 1)}>
							count is {count}
						</button>
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
}

export default App;
