import type {
	callNodeType,
	Solver_Week,
	TeacherId,
	TranspositionInstruction,
} from "../Interfaces/Interfaces";
import { argumentsQueue } from "../Interfaces/Interfaces";
import { PosType, TeacherType_nullValue } from "../types";
import { putHimAt } from "./Logic";
import { util } from "./util";

function conflicts(vertex: callNodeType) {
	const { week, pos, m, pivots, teacher, parent } = vertex;
	if (week.allClasses[m].l[pos].isCemented) return true;

	for (let i = 0; i < pivots.length; i++) {
		if (pivots[i].pos === pos && pivots[i].m === m) {
			return true;
		} else if (pivots[i].teacher === teacher && pivots[i].pos === pos) {
			return true;
		}
	}
	let tmp: callNodeType | null;
	if (parent !== undefined) tmp = parent;
	else
		throw {
			...vertex,
			message: "Parent is undefined!",
			where: "in conflicts",
		};
	while (tmp !== null) {
		if (tmp.pos === pos && tmp.m === m) {
			return true;
		} else if (tmp.teacher === teacher && tmp.pos === pos) {
			return true;
		}
		if (tmp.parent !== undefined) {
			tmp = tmp.parent;
		} else {
			throw {
				...tmp,
				message: "Parent is undefined!",
				where: "in conflicts",
			};
		}
	}
	return false;
}

function preStrictConflicts(vertex: callNodeType) {
	let tmp: callNodeType | null;
	if (vertex.week.allClasses[vertex.m].l[vertex.pos].isCemented) {
		return true;
	}
	if (vertex.parent !== undefined) tmp = vertex.parent;
	else throw { ...vertex, message: `Parent is undefined` };
	while (tmp !== null) {
		if (tmp.pos === vertex.pos && tmp.m === vertex.m) {
			return true;
		} else if (tmp.teacher === vertex.teacher) {
			return true;
		}
		if (tmp.parent !== undefined) tmp = tmp.parent;
	}
	return false;
}

const MAX_CALLS = 5;

function enoughSolutions(week: Solver_Week, justOne: boolean = false): boolean {
	if (justOne) week.activateList.length > 1;
	return week.activateList.length > MAX_CALLS;
}
export function takeOneOffTheStack(
	vertex: callNodeType,
	queue: argumentsQueue
) {
	const debt = {
		...vertex.pivots[vertex.pivots.length - 1],
		parent: vertex,
		pivots: [...vertex.pivots],
	};
	debt.pivots.pop();
	queue.enqueue(debt);
}
/**
 * Schedule push calls in another Class to free up the vertex.pos in the vertex.m Class
 * @param vertex Dummy vertex used for The position [number,number] we need empty in next_m
 * @param AfterReChainNode This will be added to the call stack and will be executed after any vertex generated by this pivot call finds a solution
 */
function pivotTo(vertex: callNodeType, queue: argumentsQueue) {
	// should schedule the push calls to the queue
	if (vertex.pivotArgs === undefined) {
		throw { ...vertex, message: "call to pivotTo with missing pivotArgs" };
	}
	if (conflicts(vertex)) return;

	const m = vertex.pivotArgs.next_m;

	const nextNode = vertex.pivotArgs.AfterReChainNode;
	const pos = vertex.pos;
	const augmentedParent = vertex.pivotArgs.beforeReChainNode;
	const NewStack =
		vertex.pivotArgs.beforeReChainNode === null
			? [...vertex.pivots]
			: [...vertex.pivotArgs.beforeReChainNode.pivots];
	if (nextNode !== undefined) NewStack.push(nextNode);
	// const teachers = util.removed(vertex.week.allClasses[m].l[X][Y].Options, vertex.week.allClasses[m].l[X][Y].currentTeacher);
	const replacementTeachers = vertex.week.allClasses[m].l[pos].Options;
	const requirePivoting = replacementTeachers.filter(
		(replacementTeacher: TeacherId) => {
			// if the proposed teacher is the same as the existing teacher
			// ex: trying to put t: 1 instead of t: 1 to free him in the position where
			// so... the proposition is discarded
			if (
				replacementTeacher ===
				vertex.week.allClasses[m].l[pos].currentTeacher
			)
				return false;
			// analyzing proposition
			const s = util.situation(
				replacementTeacher,
				vertex.pos,
				m,
				vertex.week
			);

			// FIXME: seems fussy
			// if proposed teacher is available or if he is not because he is in the position we are trying to fill
			if (
				s.r === -1 ||
				(replacementTeacher ===
					vertex.week.allClasses[vertex.m].l[pos].currentTeacher &&
					s.r === vertex.m)
			) {
				queue.enqueue({
					callTo: "push",
					parent: augmentedParent,
					teacher: replacementTeacher,
					pos: vertex.pos,
					m,
					week: vertex.week,
					cycleClosingParentName: replacementTeacher,
					action: s.action,
					pivots: [...NewStack],
				});
				return false;
			} else if (s.r === vertex.m) {
				return false;
			} else return true;
		}
	);
	requirePivoting.forEach((replacementTeacher): void => {
		const s = util.situation(replacementTeacher, vertex.pos, m, vertex.week);
		queue.enqueue({
			...vertex,
			pivots: [...NewStack], // if augmentedParent is null [] would have got to the next gen
			callTo: "pivotTo",
			pivotArgs: {
				next_m: s.r,
				AfterReChainNode: {
					callTo: "push",
					parent: undefined,
					teacher: replacementTeacher,
					pos: vertex.pos,
					m,
					week: vertex.week,
					cycleClosingParentName: replacementTeacher,
					action: s.action,
					pivots: [...NewStack],
				},
				beforeReChainNode: augmentedParent,
			},
		});
	});
}
/**
 * back track and return the path to the root
 * @param vertex leaf
 */
export function backtrack(vertex: callNodeType): TranspositionInstruction[] {
	let tmp: callNodeType | null = vertex;
	const solution: TranspositionInstruction[] = [];
	while (tmp !== null) {
		solution.push({ teacher: tmp.teacher, pos: tmp.pos, m: tmp.m });
		if (tmp.parent === undefined) {
			throw { ...tmp, message: "parent undefined" };
		} else {
			tmp = tmp.parent;
		}
	}
	return solution;
}
/**
 * assumes `m` `pos` is empty
 * @param vertex arguments for the pull call
 */
function pull(vertex: callNodeType, queue: argumentsQueue) {
	const { teacher, m, week } = vertex;
	const { activateList: solutions } = week;
	if (conflicts(vertex)) return;
	const teacherOtherPeriodsInTheClassM: PosType[] =
		week.allClasses[m].teachers[teacher].periodsHere ||
		util.getHisActPeriods(week.allClasses[m], teacher);
	const q_lenBefore = queue.length();
	// const pivotsQueue = new argumentsQueue();
	teacherOtherPeriodsInTheClassM.forEach((edge) => {
		// tooking for other teachers to take edge and thus `teacher` can be in pulled to position
		const teachers = week.allClasses[m].l[edge].Options;
		teachers.forEach((t) => {
			// filter out the `teacher` as an option to free `teacher` since it doesn't make sense
			if (t === teacher) return;

			const newNode: callNodeType = {
				teacher: t,
				pos: edge,
				m,
				week,
				callTo: "nothing",
				parent: vertex,
				pivots: [...vertex.pivots],
			};
			if (preStrictConflicts(newNode)) return;

			const s = util.situation(t, edge, m, week);
			// replacement teacher has unfulfilled periods and he's available
			if (s.action === "shift" && s.r === -1) {
				// push to solutions
				if (newNode.pivots.length !== 0) {
					takeOneOffTheStack(newNode, queue);
				} else {
					solutions.push(backtrack(newNode));
				}
			}
			// replacement teacher doesn't have unfulfilled periods and he's available
			else if (s.action === "cycle" && s.r === -1) {
				newNode.callTo = "pull";
				queue.enqueue(newNode);
			}
			// replacement teacher doesn't have unfulfilled periods and he not available
			else if (s.action === "cycle" && s.r !== -1) {
				// pivotsQueue.enqueue({
				queue.enqueue({
					...newNode,
					callTo: "pivotTo",
					pivotArgs: {
						next_m: s.r,
						// FIXME: sketchy
						AfterReChainNode: {
							...newNode,
							callTo: "pull",
							parent: undefined,
						},
						beforeReChainNode: vertex,
					},
				});
			}
			// replacement teacher has unfulfilled periods and he not available
			else if (s.action === "shift" && s.r !== -1) {
				// pivotsQueue.enqueue({
				queue.enqueue({
					...newNode,
					callTo: "pivotTo",
					pivotArgs: {
						next_m: s.r,
						// FIXME: sketchy
						// continue where we left of after he's made available by pivoting
						beforeReChainNode: vertex,
						AfterReChainNode: newNode,
					},
				});
			}
		});
	});
}
/**
 * push Assumes that this step has r===-1
 * @param vertex
 * @returns
 */
function push(vertex: callNodeType, queue: argumentsQueue) {
	const { pos, m, action, week, teacher } = vertex;
	const solutions = week.activateList;
	const pivots = [...vertex.pivots];
	const S = util.situation(teacher, pos, m, week);
	const teacher_sitting_in_pos = S.currTeacher;
	if (vertex.teacher === teacher_sitting_in_pos) return;

	if (conflicts(vertex)) return;
	/**
	 * It's when the first push in the chain pushed a teacher that has no more periods
	 * and so if some where down the chain we where about to Squash him
	 * and put someone in his place thus taking a period from him
	 * then it's ok because we already gave him one at first
	 */
	if (
		// remember push assumes r === -1 and `teacher` is available
		(action === "shift" &&
			teacher_sitting_in_pos === TeacherType_nullValue) ||
		(action === "cycle" &&
			vertex.cycleClosingParentName === teacher_sitting_in_pos)
	) {
		if (vertex.pivots.length === 0) {
			solutions.push(backtrack(vertex));
		} else {
			takeOneOffTheStack(vertex, queue);
		}
	} else if (
		action === "cycle" &&
		teacher_sitting_in_pos === TeacherType_nullValue
	) {
		// here I should pull him here
		// you see I'm trying to push a teacher with no more periods in an available spot
		// so instead I should pull him into that spot
		// TODO: pull
		// note it should be treaded like a pivot since
		// the action is a cycle and it requires a closing parent name
		// queue.enqueue({
		// 	teacher,
		// 	pos,
		// 	m,
		// 	week,
		// 	parent: vertex,
		// 	callTo: "pull",
		// 	pivots,
		// });
		return;
	}
	// `teacher_sitting_in_pos` exist `m` `pos` isn't empty and we have to `push` him
	else {
		// look for his periods where `teacher_sitting_in_pos` can go
		const edges: PosType[] = week.availables[teacher_sitting_in_pos];
		edges.forEach((p): void => {
			const newSituation = util.situation(
				teacher_sitting_in_pos,
				p,
				m,
				week
			);
			const newNode: callNodeType = {
				teacher: teacher_sitting_in_pos,
				pos: p,
				m,
				pivots,
				week,
				parent: vertex,
				callTo: "nothing",
				cycleClosingParentName: vertex.cycleClosingParentName,
				action,
			};
			if (newSituation.r === m) {
				// this condition should be equivilant to currentTeacher===oldTeacher
			} else if (newSituation.r === -1) {
				// this means that it's possible for the old teacher to be put in this pos
				// but we still have to find a place to put the (current teacher at pos1) in.
				queue.enqueue({
					...newNode,
					callTo: "push",
				});
			} else {
				// pivotsQueue.enqueue({
				queue.enqueue({
					...newNode,
					callTo: "pivotTo",
					pivotArgs: {
						next_m: newSituation.r,
						beforeReChainNode: vertex,
						AfterReChainNode: {
							//<- push calls check if the called for is it self a solution
							...newNode,
							callTo: "push",
							parent: undefined,
						},
					},
				});
			}
		});
	}
}
const delegate = (
	teacher: TeacherId,
	pos: PosType,
	m: number,
	week: Solver_Week,
	justOne: boolean = false,
	size?: number
) => {
	const situationInt = util.situationInt;
	const S = util.situation(teacher, pos, m, week);
	const queue = new argumentsQueue(size);
	/**
	 * {teacher,pos,m,week,parent:null,callTo:'nothing',pivots:[]}
	 */
	const rootVertix: callNodeType = {
		teacher,
		pos,
		m,
		week,
		parent: null,
		callTo: "nothing",
		pivots: [],
	};
	const sit = situationInt(S);
	console.log(
		"" +
			JSON.stringify(pos) +
			" # " +
			week.allClasses[m].Name +
			" # " +
			teacher +
			" -> " +
			sit
	);
	switch (sit) {
		case 1: // t==='' & r===-1 & a ==='shift'
			week.Swapping = false;
			putHimAt(week, m, teacher, pos, "put");
			break;
		case 2: // t==='' & r!==-1 & a ==='shift'
			// Pivot
			queue.enqueue({
				...rootVertix,
				pivotArgs: { next_m: S.r, beforeReChainNode: rootVertix },
				callTo: "pivotTo",
			});
			break;
		case 3: // t==='' & r===-1 & a ==='cycle'
			// pull(teacher,pos,m,week,[])
			queue.enqueue({ ...rootVertix, callTo: "pull" });
			break;
		case 4: // t==='' & r!==-1 & a ==='cycle'
			queue.enqueue({
				...rootVertix,
				callTo: "pivotTo",
				pivotArgs: {
					next_m: S.r,
					AfterReChainNode: {
						...rootVertix,
						parent: undefined,
						callTo: "pull",
					},
					beforeReChainNode: null,
				},
			});
			break;
		case 5: // t!=='' & r===-1 & a ==='shift'
			// push(teacher, pos, m, week, [], S.action );
			queue.enqueue({ ...rootVertix, callTo: "push", action: S.action });
			break;
		case 6: // t!=='' & r!==-1 & a ==='shift'
			queue.enqueue({
				...rootVertix,
				callTo: "pivotTo",
				pivotArgs: {
					next_m: S.r,
					AfterReChainNode: {
						...rootVertix,
						callTo: "push",
						action: S.action,
					},
					beforeReChainNode: null,
				},
			});
			break;
		case 7: // t!=='' & r===-1 & a ==='cycle'
			queue.enqueue({
				...rootVertix,
				callTo: "push",
				action: S.action,
				cycleClosingParentName: rootVertix.teacher,
			});
			break;
		case 8: // t!=='' & r!==-1 & a ==='cycle'
			queue.enqueue({
				...rootVertix,
				callTo: "pivotTo",
				pivotArgs: {
					next_m: S.r,
					AfterReChainNode: {
						...rootVertix,
						callTo: "push",
						parent: undefined,
						cycleClosingParentName: rootVertix.teacher,
						action: S.action,
					},
					beforeReChainNode: null,
				},
			});
			break;
	}
	let firstIteration = true;
	while (queue.notEmpty() && !enoughSolutions(week, justOne)) {
		queue.callFront(push, pull, pivotTo);
		if (1 === queue.length() && firstIteration) {
			console.log(`sth is wrong Catch me!`);
		}
		queue.dequeue();
		firstIteration = false;
	}
	queue.unlock();
	queue.eraseAll();
};

export const someHowPutHimAt = (
	m: number,
	teacher: TeacherId,
	pos: PosType,
	week: Solver_Week,
	iterativeSolutionPoster?: (changes: TranspositionInstruction[]) => void,
	size?: number,
	justOne: boolean = false
): void => {
	/*
	* discription*
	for each teacher available here in the original list in this cell
	for each pos in the shared postihions
	if the other teacher is in a pos in the shared one's just do a simple switch or promt for choice
	this should be enough?!
	?!
	*/
	let freeze = true;
	if (iterativeSolutionPoster) freeze = false;
	if (justOne === undefined && iterativeSolutionPoster) justOne = true;
	//short hands
	week.Swapping = true;
	// week.HandyAny.beforeAction = [];
	// for (let i = 0; i < week.allClasses.length; i++) {
	// 	let acc = 0;
	// 	// Object.keys(week.allClasses[i].teachers).forEach(
	// 	// 	(teacher)=>{
	// 	// 	  acc = acc + week.allClasses[i].teachers[teacher].remPeriods;
	// 	// 	}
	// 	//   );
	// 	loopOverClass((u, v) => {
	// 		if (week.allClasses[i].l[u][v].currentTeacher === "") acc += 1;
	// 	});
	// 	week.HandyAny.beforeAction.push(acc);
	// }
	// week.HandyAny.test = () => {
	// 	if (week.HandyAny.beforeAction.length !== 0) {
	// 		console.log(week.HandyAny.beforeAction);
	// 	} else {
	// 		console.log("nothing");
	// 	}
	// 	week.HandyAny.beforeAction = [];
	// 	for (let i = 0; i < week.allClasses.length; i++) {
	// 		let acc = 0;
	// 		// Object.keys(week.allClasses[i].teachers).forEach(
	// 		// 	(teacher)=>{
	// 		// 	  acc = acc + week.allClasses[i].teachers[teacher].remPeriods;
	// 		// 	}
	// 		//   );
	// 		loopOverClass((u, v) => {
	// 			if (week.allClasses[i].l[u][v].currentTeacher === "") acc += 1;
	// 		});
	// 		week.HandyAny.beforeAction.push(acc);
	// 	}
	// 	console.log("became");
	// 	console.log(week.HandyAny.beforeAction);
	// };
	//   console.time('delegate')
	delegate(teacher, pos, m, week, justOne, size);
	//   console.timeEnd('delegate')
	// if (week.activateList.length > 0) {
	// 	const ms: number[] = [];
	// 	week.activateList[week.currentSolutionNumber].forEach((step) => {
	// 		let in_ms = false;
	// 		for (let i = 0; i < ms.length; i++) {
	// 			if (ms[i] === step.m) {
	// 				in_ms = true;
	// 				break;
	// 			}
	// 		}
	// 		if (!in_ms) {
	// 			ms.push(step.m);
	// 		}
	// 	});
	// 	week.HandyAny.validate = (week: Solver_Week) => {
	// 		ms.forEach((m) => {
	// 			let dict: any = {};
	// 			const Class = week.allClasses[m];
	// 			loopOverClass((i, j) => {
	// 				const t = Class.l[i][j].currentTeacher;
	// 				if (dict[t] === undefined) {
	// 					dict[t] = 1;
	// 				} else {
	// 					dict[t] += 1;
	// 				}
	// 			});
	// 			Object.keys(dict).forEach((key) => {
	// 				if (key !== "" && dict[key] > Class.teachers[key].Periods) {
	// 					console.log(`m : ${m} and the teacher is ${key}`);
	// 					// eslint-disable-next-line no-throw-literal
	// 					throw "shit";
	// 				}
	// 			});
	// 			console.log("allz good validated!!");
	// 		});
	// 		loopOverClass((i: number, j: number) => {
	// 			for (let mi = 0; mi < week.allClasses.length; mi++) {
	// 				let dict: any = {};
	// 				if (dict[week.allClasses[mi].l[i][j].currentTeacher] !== undefined) {
	// 					console.log(
	// 						`${
	// 							week.allClasses[mi].l[i][j].currentTeacher
	// 						} is at two places at once ${mi} and ${
	// 							dict[week.allClasses[mi].l[i][j].currentTeacher]
	// 						}`
	// 					);
	// 					throw "damit";
	// 				} else {
	// 					dict[week.allClasses[mi].l[i][j].currentTeacher] = mi;
	// 				}
	// 			}
	// 		});
	// 	};
	// 	week.HandyAny.runTests = () => {
	// 		console.log(
	// 			week.activateList[week.currentSolutionNumber].map((item) =>
	// 				JSON.stringify(item)
	// 			)
	// 		);
	// 		week.HandyAny.test();
	// 		week.HandyAny.validate(week);
	// 	};
	// }
	if (!freeze) {
		Done(week, iterativeSolutionPoster)({});
	}

	week.forceUpdate && week.forceUpdate();
};
export const Done = (
	week: Solver_Week,
	iterativeSolutionPoster?: (changes: TranspositionInstruction[]) => void
) => {
	return (e: any) => {
		const sol = week.activateList[week.currentSolutionNumber];
		if (sol === undefined) {
			week.Swapping = false;
			week.activateList = [];
			week.currentSolutionNumber = 0;
			week.forceUpdate && week.forceUpdate();
			return;
		}
		let allPassed = true;
		for (let i = 0; i < sol.length && allPassed; i++) {
			allPassed =
				allPassed &&
				putHimAt(week, sol[i].m, sol[i].teacher, sol[i].pos, "remove");
		}
		for (let i = 0; i < sol.length && allPassed; i++) {
			allPassed =
				allPassed &&
				putHimAt(week, sol[i].m, sol[i].teacher, sol[i].pos, "put");
		}
		if (allPassed) iterativeSolutionPoster && iterativeSolutionPoster(sol);

		week.Swapping = false;
		week.activateList = [];
		week.currentSolutionNumber = 0;
		week.forceUpdate && week.forceUpdate();
	};
};

/*
<sc<script></script><script>alert('hi');</sc<script></script><script>
<<ss >script>alert('hi');<<ss >/script>
*/
