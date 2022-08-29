//ts-ignore
import { useContext, useEffect, useState } from "react";
import "./App.css";
// import TryWorker from "./workers/try.worker?worker";
// import z3 from "./workers/Z3.worker?worker";
import { Button } from "@material-tailwind/react";
import SMT_CodePreviewer from "components/SMT_CodePreviewer";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import {} from "dexie-react-hooks";
import DriveSetup from "Gapi/Drive/Setup";
import { IStore } from "Model/Store";
import { collapse } from "Model/View/ExpandTemplates";
import useTitle from "Model/View/Layout/useTitle";
import { useDispatch, useSelector } from "react-redux";

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
	// const w = new TryWorker();
	// console.log(w);
	// w.postMessage("fart");
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
		<h1>
			<Button
				onClick={async () => {
					// const fileList =
					// 	(await gapi.client.drive) && gapi.client.drive.files.list();
					// console.log(`fileList = `, fileList);
					DriveSetup();
				}}
			>
				log files
			</Button>
			home
			<SMT_CodePreviewer />
		</h1>
	);
}

export default App;
