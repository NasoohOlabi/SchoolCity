//ts-ignore
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import TryWorker from "./workers/try.worker?worker";
// import z3 from "./workers/Z3.worker?worker";
import Header from "./components/header/Header";
import { Dexie } from "dexie";

// do I need Redux
// do I need low dash
// do I need Rxjs
// do I need React Router
// do I need React Query
const db = new Dexie("school");
db.version(1).stores({
	todos: "++id,task,completed",
});

const { todos } = db as any;

const f = async () => {
	console.log("hi");
	console.log(todos);

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
	const [count, setCount] = useState(0);

	useEffect(() => {
		f();
	}, []);

	// const w = new Worker(new URL("./workers/try.worker.ts", import.meta.url));

	// w.postMessage("fart");
	// w.postMessage({ data: "fart" });
	return (
		<div className="App">
			<Header />
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
		</div>
	);
}

export default App;
