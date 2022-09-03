export default {} as typeof Worker & { new(): Worker };
import { Solver_Week, Solver_Week_util, Transposition } from "../Legacy/Interfaces/Interfaces";
import { someHowPutHimAt } from "../Legacy/Logic/CoreAlgo";
import { fastForward } from "../Legacy/Logic/Logic";

console.log(`worker: Initiated.`)
const iterativeSolutionPoster = (changes: Transposition) => {
	self.postMessage({ payload: changes, type: "multipleChanges" })
}
self.addEventListener('message', (event) => {
	console.log(`worker: request received.`)
	try {
		const week = ((week: string) => Solver_Week_util.decompress(JSON.parse(week)))(event.data);

		fastForward(week, iterativeSolutionPoster);

		console.log(`posting Done`)
		self.postMessage({ payload: week, type: "Done" })
	} catch (error) {
		if (event.data.type && event.data.type === "put") {
			const { teacher, pos, m } = event.data
			const week: Solver_Week = Solver_Week_util.decompress(JSON.parse(event.data.week))
			const s = `iter: ${teacher} in ${week.allClasses[m].Name} in ${pos}`;
			console.time(s);
			someHowPutHimAt(m, teacher, pos, week, iterativeSolutionPoster, undefined, false);
			console.timeEnd(s);
		}
	}
})