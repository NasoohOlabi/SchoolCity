import { ThemeProvider } from "@material-tailwind/react";
import App from "App";
import Header from "components/Layout/Header";
import MainContent from "components/Layout/MainContent";
import SideMenu from "components/Layout/SideMenu";
import { useUser } from "Model/Auth/hooks/useUser";
import UserContext from "Model/Auth/UserContext";
import Login from "Pages/Login";
import ObjectHome from "Pages/School/ObjectHome";
import ObjectInfo from "Pages/School/ObjectInfo";
import ObjectNew from "Pages/School/ObjectNew";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ViewModel } from "../ViewModel/ViewModelStore";
import PrivateRoutes from "./PrivateRoutes";

interface SchoolCityRouterProps {}

const SchoolCityRouter: React.FC<SchoolCityRouterProps> = ({}) => {
	const { currentUser, pending } = useUser();

	const ctx = {
		sidebarExpanded: useState(false),
	};

	// TODO: check out this thoroly https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md

	// TODO: implement this url scheme
	// /profile - user profile
	// /school/:schoolName/own - manage owned schools
	// /school/:schoolName/my - manage schools you work at
	// /school/:schoolName/grades - grade home with templates
	// /school/:schoolName/grade/:id - view grade instance details
	// /school/:schoolName/grade/new - view grade instance details
	// /school/:schoolName/grades/subject/:subjectId - see subject grades over year
	// /school/:schoolName/grades/subject/:subjectId - see subject grades over year
	// /school/:schoolName/schedule/ - schedule home with templates
	// /school/:schoolName/schedule/ - schedule home with templates
	if (pending) return <div>Loading...</div>;
	return (
		<UserContext.Provider value={currentUser}>
			<ViewModel.Provider value={ctx}>
				<ThemeProvider>
					<Header />
					<MainContent>
						<Routes>
							<Route path="/" element={<App />} />
							<Route path="/">
								<Route
									index={true}
									element={
										<PrivateRoutes
											isAllowed={!!currentUser}
											redirectPath="/Login"
										/>
									}
								/>
								<Route path="/school">
									<Route index={true} element={<ObjectHome />} />
									<Route path="new" element={<ObjectNew />}></Route>
									<Route path=":schoolName">
										<Route
											index={true}
											element={<ObjectInfo />}
										></Route>
										<Route path="grade">
											<Route index={true} element={<ObjectHome />} />
											<Route
												path="new"
												element={<ObjectNew />}
											></Route>
											<Route path=":name">
												<Route
													index={true}
													element={<ObjectInfo />}
												></Route>
											</Route>
										</Route>
										<Route path="schedule">
											<Route index={true} element={<ObjectHome />} />
											<Route
												path="new"
												element={<ObjectNew />}
											></Route>
											<Route path=":name">
												<Route
													index={true}
													element={<ObjectInfo />}
												></Route>
											</Route>
										</Route>
										<Route path="mark">
											<Route index={true} element={<ObjectHome />} />
											<Route
												path="new"
												element={<ObjectNew />}
											></Route>
											<Route path=":name">
												<Route
													index={true}
													element={<ObjectInfo />}
												></Route>
											</Route>
										</Route>
										<Route path="Section">
											<Route index={true} element={<ObjectHome />} />
											<Route
												path="new"
												element={<ObjectNew />}
											></Route>
											<Route path=":name">
												<Route
													index={true}
													element={<ObjectInfo />}
												></Route>
											</Route>
										</Route>
									</Route>
								</Route>
							</Route>
							<Route path="/login" element={<Login />} />
							<Route path="*" element={<div>non match</div>} />
						</Routes>
					</MainContent>
					<SideMenu />
				</ThemeProvider>
			</ViewModel.Provider>
		</UserContext.Provider>
	);
};

export default SchoolCityRouter;
