import { ThemeProvider } from "@material-tailwind/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "App";
import AppMount from "AppMount";
import Header from "components/Layout/Header";
import MainContent from "components/Layout/MainContent";
import SideMenu from "components/Layout/SideMenu";
import { SchoolCityIDBTable } from "DB/schema";
import { WeekView } from "Legacy/Components/WeekView";
import { useUser } from "Model/Auth/hooks/useUser";
import UserContext from "Model/Auth/UserContext";
import Login from "Pages/Login";
import ObjectHome from "Pages/School/ObjectHome";
import ObjectInfo from "Pages/School/ObjectInfo";
import ObjectNew from "Pages/School/ObjectNew";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ViewModel, ViewModelPubSub } from "../ViewModel/ViewModelStore";
import PrivateRoutes from "./PrivateRoutes";

interface SchoolCityRouterProps {}

const SchoolCityRouter: (args: SchoolCityRouterProps) => JSX.Element = ({}) => {
	const { currentUser, pending, signedOut } = useUser();
	const ctx = new ViewModelPubSub({
		sidebarExpanded: false,
		templatesExpanded: false,
		title: "",
		gapiUser: undefined,
		drive: undefined,
		docs: undefined,
		sheets: undefined,
		gmail: undefined,
		people: undefined,
	});

	useEffect(() => {
		const { AppUnmount } = AppMount();
		return AppUnmount();
	}, []);

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
		<GoogleOAuthProvider
			clientId={import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID}
		>
			<UserContext.Provider value={currentUser}>
				<ViewModel.Provider value={ctx}>
					<ThemeProvider>
						<Header />
						<MainContent>
							<Routes>
								<Route path="/" element={<App />} />
								<Route
									path="/app"
									element={
										<PrivateRoutes
											isAllowed={!!currentUser}
											redirectPath="/Login"
										/>
									}
								>
									<Route path="school">
										<Route index={true} element={<ObjectHome />} />
										<Route path="new" element={<ObjectNew />}></Route>
										<Route
											path=":schoolName"
											element={
												<PrivateRoutes
													isAllowed={!!currentUser}
													redirectPath="/app/school"
													checkSchoolName
												/>
											}
										>
											<Route
												index={true}
												element={<ObjectInfo />}
											></Route>
											<Route path="schedule">
												<Route
													index={true}
													element={<WeekView />}
												/>
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
											{(
												[
													"grade",
													"administrator",
													"mark",
													"section",
													"settings",
													"student",
													"subject",
													"teacher",
													"template",
												] as SchoolCityIDBTable[]
											).map((table, ind) => (
												<Route path={table} key={ind}>
													<Route
														index={true}
														element={<ObjectHome />}
													/>
													<Route
														path="new"
														element={<ObjectNew />}
													></Route>
													<Route path=":id">
														<Route
															index={true}
															element={<ObjectInfo />}
														/>
													</Route>
												</Route>
											))}
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
		</GoogleOAuthProvider>
	);
};

export default SchoolCityRouter;
