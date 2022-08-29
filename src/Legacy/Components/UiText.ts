/* eslint-disable @typescript-eslint/no-unused-vars */
const headRow = [
	"Period 1",
	"Period 2",
	"Period 3",
	"Period 4",
	"Period 5",
	"Period 6",
	"Period 7",
];
export const day = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	"-1": "All Day",
	"All Day": -1,
};
const headCol = [day[0], day[1], day[2], day[3], day[4]];

export const displayNamesMap: any = {
	0: "Rahaf Kayal",
	1: "Anas Shaban",
	2: "Nisreen Selo",
	3: "Mayson Al-Monakel",
	4: "Eyad Al-Taba3",
	5: "Tawfiq Khabaz",
	6: "MHD Bardawel",
	7: "A'yda Husain",
	8: "3rfan Kholendy",
	9: "Laila",
	10: "Oydad A'airan",
	11: "Abyear Hammoud",
	12: "Maram jadeed",
	13: "Eiman Taha",
	14: "Nermen Ash",
	15: "Saeed KabaKouly",
	16: "IT",
	17: "Khaled Barakat",
	18: "Mona Hasanyn",
	19: "Nour Hamad",
	20: "Fayes Wahba",
	21: "Issam Kreeshan",
	22: "Reem Mukhalalaty",
	23: "Heba Kozon",
	24: "Nada Al-Safadi",
	25: "Nour Refayi",
	26: "Arts",
	27: "PA",
	28: "Music",
	29: "Hala Huobi",
	"Rahaf Kayal": 0,
	"Anas Shaban": 1,
	"Nisreen Selo": 2,
	"Mayson Al-Monakel": 3,
	"Eyad Al-Taba3": 4,
	"Tawfiq Khabaz": 5,
	"MHD Bardawel": 6,
	"A'yda Husain": 7,
	"3rfan Kholendy": 8,
	Laila: 9,
	"Oydad A'airan": 10,
	"Abyear Hammoud": 11,
	"Maram jadeed": 12,
	"Eiman Taha": 13,
	"Nermen Ash": 14,
	"Saeed KabaKouly": 15,
	IT: 16,
	"Khaled Barakat": 17,
	"Mona Hasanyn": 18,
	"Nour Hamad": 19,
	"Fayes Wahba": 20,
	"Issam Kreeshan": 21,
	"Reem Mukhalalaty": 22,
	"Heba Kozon": 23,
	"Nada Al-Safadi": 24,
	"Nour Refayi": 25,
	Arts: 26,
	PA: 27,
	Music: 28,
	"Hala Huobi": 29,
};
export const ArabicDisplayNamesMap: any = {
	"رهف كيال": 0,
	0: "رهف كيال",
	"أنس شعبان": 1,
	1: "أنس شعبان",
	"نسرين سلو": 2,
	2: "نسرين سلو",
	"ميسون المنقل": 3,
	3: "ميسون المنقل",
	"إياد الطباع": 4,
	4: "إياد الطباع",
	"توفيق الخباز": 5,
	5: "توفيق الخباز",
	"محمد بردويل": 6,
	6: "محمد بردويل",
	"عايدة حسين": 7,
	7: "عايدة حسين",
	"عرفان خولندي": 8,
	8: "عرفان خولندي",
	ليلى: 9,
	9: "ليلى",
	"وداد عيران": 10,
	10: "وداد عيران",
	"عبير حمود": 11,
	11: "عبير حمود",
	"مرام جديد": 12,
	12: "مرام جديد",
	"إيمان طه": 13,
	13: "إيمان طه",
	"نيرمين العش": 14,
	14: "نيرمين العش",
	"سعيد قبى قولي": 15,
	15: "سعيد قبى قولي",
	معلوماتية: 16,
	16: "معلوماتية",
	"خالد بركات": 17,
	17: "خالد بركات",
	"منى حسنين": 18,
	18: "منى حسنين",
	"نور حمد": 19,
	19: "نور حمد",
	"فايز وهبة": 20,
	20: "فايز وهبة",
	"عصام كريشان": 21,
	21: "عصام كريشان",
	"ريم مخللاتي": 22,
	22: "ريم مخللاتي",
	"هبة كوزون": 23,
	23: "هبة كوزون",
	"ندى صفدي": 24,
	24: "ندى صفدي",
	"نور ريفاعي": 25,
	25: "نور ريفاعي",
	فنون: 26,
	26: "فنون",
	رياضة: 27,
	27: "رياضة",
	موسيقة: 28,
	28: "موسيقة",
	"هالة حبي": 29,
	29: "هالة حبي",
};

interface ITexts {
	randomFillerButton: string;
	doneButton: string;
	headRow: string[];
	headCol: string[];
	DataViewBtn: string;
	WeekBtn: string;
	classGroupName: string;
	classTeachers: string;
	teacherName: string;
	LangDirection: "ltr" | "rtl";
	addClass: string;
	Solve: string;
	NameMap: {
		[details: string]: string;
	};
};
const currentDevUiTextObj: ITexts = {
	randomFillerButton: "Random Filler",
	LangDirection: "ltr",
	doneButton: "Done",
	DataViewBtn: "Data",
	WeekBtn: "Week",
	addClass: "addClass",
	classTeachers: "Class Teachers",
	headRow,
	teacherName: "Teacher's Name",
	classGroupName: "Class Name",
	headCol,
	Solve: "Solve",
	NameMap: displayNamesMap,
};
const arabicUiTextObj: ITexts = {
	randomFillerButton: "حل عشوائي",
	doneButton: "موافق",
	DataViewBtn: "بيانات",
	WeekBtn: "البرنامج",
	addClass: "إضافة صف",
	// addTeacher: "إضافة إستاذ",
	LangDirection: "rtl",
	classGroupName: "اسم الصف",
	classTeachers: "أساتذة الصف",
	teacherName: "إسم الإستاذ",
	Solve: "حل",
	headRow: [
		"الحصة الأولى",
		"الحصة الثانية",
		"الحصة الثالثة",
		"الحصة الرابعة",
		"الحصة الخامسة",
		"الحصة السادسة",
		"الحصة السابعة",
	],
	headCol: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],

	NameMap: ArabicDisplayNamesMap,
};
class textsObj implements ITexts {
	randomFillerButton!: string;
	doneButton!: string;
	headRow!: string[];
	headCol!: string[];
	DataViewBtn!: string;
	WeekBtn!: string;
	classGroupName!: string;
	classTeachers!: string;
	teacherName!: string;
	LangDirection!: "rtl" | "ltr";
	addClass!: string;
	Solve!: string;
	NameMap: any;
	lang: "en" | "ar"
	constructor(UiTexts: ITexts, lang: "en" | "ar") {
		this.randomFillerButton = UiTexts.randomFillerButton
		this.doneButton = UiTexts.doneButton
		this.headRow = UiTexts.headRow
		this.headCol = UiTexts.headCol
		this.DataViewBtn = UiTexts.DataViewBtn
		this.WeekBtn = UiTexts.WeekBtn
		this.classGroupName = UiTexts.classGroupName
		this.classTeachers = UiTexts.classTeachers
		this.teacherName = UiTexts.teacherName
		this.LangDirection = UiTexts.LangDirection
		this.addClass = UiTexts.addClass
		this.NameMap = UiTexts.NameMap
		this.lang = lang
		this.Solve = UiTexts.Solve
	}
	changeLanguage = () => {
		if (this.lang === "en") {
			this.lang = "ar"
			this.randomFillerButton = arabicUiTextObj.randomFillerButton
			this.doneButton = arabicUiTextObj.doneButton
			this.headRow = arabicUiTextObj.headRow
			this.headCol = arabicUiTextObj.headCol
			this.DataViewBtn = arabicUiTextObj.DataViewBtn
			this.WeekBtn = arabicUiTextObj.WeekBtn
			this.classGroupName = arabicUiTextObj.classGroupName
			this.classTeachers = arabicUiTextObj.classTeachers
			this.teacherName = arabicUiTextObj.teacherName
			this.LangDirection = arabicUiTextObj.LangDirection
			this.addClass = arabicUiTextObj.addClass
			this.NameMap = arabicUiTextObj.NameMap
			this.Solve = arabicUiTextObj.Solve
		}
		else {
			this.lang = "en"
			this.randomFillerButton = currentDevUiTextObj.randomFillerButton
			this.doneButton = currentDevUiTextObj.doneButton
			this.headRow = currentDevUiTextObj.headRow
			this.headCol = currentDevUiTextObj.headCol
			this.DataViewBtn = currentDevUiTextObj.DataViewBtn
			this.WeekBtn = currentDevUiTextObj.WeekBtn
			this.classGroupName = currentDevUiTextObj.classGroupName
			this.classTeachers = currentDevUiTextObj.classTeachers
			this.teacherName = currentDevUiTextObj.teacherName
			this.LangDirection = currentDevUiTextObj.LangDirection
			this.addClass = currentDevUiTextObj.addClass
			this.NameMap = currentDevUiTextObj.NameMap
			this.Solve = currentDevUiTextObj.Solve
		}

	}
}

export let texts = new textsObj(currentDevUiTextObj, "en")