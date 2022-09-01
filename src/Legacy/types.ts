import { TeacherId } from "./Interfaces/Interfaces";

export type PosType = number;

export const TeacherType_nullValue: TeacherId = -1;
export const TeacherType_WildCard: TeacherId = -2;

export type refreshTableType = (() => void)[][][];
export type tableFooterRefresherType = (() => void)[];
export type availablesType = PosType[][];
export type teacherScheduleType = (number | null)[][];
