import { ThemeProvider } from "@material-tailwind/react";
import SchoolCityDBContextProvider from "DB/IDBProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import SchoolCityRouter from "Routes/SchoolCityRouter";
import "./font-awesome.css";
import "./index.css";
import store from "./Model/Model";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<SchoolCityDBContextProvider>
				<Provider store={store}>
					<ThemeProvider>
						<SchoolCityRouter />
					</ThemeProvider>
				</Provider>
			</SchoolCityDBContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);
