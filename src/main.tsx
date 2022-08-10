import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./font-awesome.min.css";
import { ThemeProvider } from "@material-tailwind/react";
import store from "./Model/Model";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</React.StrictMode>
);
