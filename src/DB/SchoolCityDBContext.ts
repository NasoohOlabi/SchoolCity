import { createContext } from "react";
import { initializeDB, SchoolCityIDB } from "./schema";

const SchoolCityDBContext = createContext<SchoolCityIDB>(initializeDB())
export default SchoolCityDBContext

