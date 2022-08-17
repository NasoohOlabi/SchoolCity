import { createContext } from "react";
import { SchoolCityIDB } from "./schema";

const SchoolCityDBContext = createContext<SchoolCityIDB | null>(null)
export default SchoolCityDBContext

