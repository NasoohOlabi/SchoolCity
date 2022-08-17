import App from "App";
import Header from "components/Layout/Header";
import MainContent from "components/Layout/MainContent";
import { getCurrentUser } from "Model/Auth/getCurrentUser";
import Login from "Pages/Login";
import GradeHome from "Pages/School/Grade/GradeHome";
import GradeNew from "Pages/School/Grade/GradeNew";
import MarkHome from "Pages/School/Mark/MarkHome";
import MarkNew from "Pages/School/Mark/MarkNew";
import ScheduleHome from "Pages/School/Schedule/ScheduleHome";
import ScheduleNew from "Pages/School/Schedule/ScheduleNew";
import SchoolInfo from "Pages/School/SchoolInfo";
import SectionHome from "Pages/School/Section/SectionHome";
import SectionNew from "Pages/School/Section/SectionNew";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

interface SchoolCityRouterProps {}

const SchoolCityRouter: React.FC<SchoolCityRouterProps> = ({}) => {
	const [user, _] = useState(getCurrentUser());

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

	return (
		<>
			<Header />
			<MainContent>
				<Routes>
					{/* <Route path="/" element={<App />} /> */}
					<Route path="/school">
						<Route
							index={true}
							element={
								<PrivateRoutes isAllowed={!!user} redirectPath="/" />
							}
						/>
						<Route path=":schoolName">
							<Route index={true} element={<SchoolInfo />}></Route>
							<Route path="grade">
								<Route index={true} element={<GradeHome />} />
								<Route path="new" element={<GradeNew />}></Route>
							</Route>
							<Route path="schedule">
								<Route index={true} element={<ScheduleHome />} />
								<Route path="new" element={<ScheduleNew />}></Route>
							</Route>
							<Route path="mark">
								<Route index={true} element={<MarkHome />} />
								<Route path="new" element={<MarkNew />}></Route>
							</Route>
							<Route path="Section">
								<Route index={true} element={<SectionHome />} />
								<Route path="new" element={<SectionNew />}></Route>
							</Route>
						</Route>
					</Route>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<App />} />
					<Route path="*" element={<div>non match</div>} />
				</Routes>
			</MainContent>
		</>
	);
};

export default SchoolCityRouter;
