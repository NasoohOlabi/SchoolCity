import { CoordinateMapper, DirectFlatCoordinatesMapper } from "DB/schema";

export default class TwoDimensionArray<T>{
	__store: (T | undefined)[]
	__mapper: CoordinateMapper;
	X1_Count: number
	X2_Count: number
	constructor(X1_Count: number, X2_Count: number) {
		this.X1_Count = X1_Count;
		this.X2_Count = X2_Count
		this.__mapper = DirectFlatCoordinatesMapper({ days: X1_Count, periods: X2_Count });
		this.__store = new Array(X1_Count * X2_Count).fill(undefined);
	}
	public fillConst(v: T) {
		this.__store.fill(v)
	}
	public fill(f: () => T) {
		this.__store.fill(undefined).map(x => f())
	}
	public get(x: number, y: number): T | undefined;
	public get(pos: [number, number]): T | undefined;
	public get(arg1: number | [number, number], arg2?: number): T | undefined {
		let x1, x2: number;
		if (!arg2 && Array.isArray(arg1)) {
			[x1, x2] = arg1
		} else if (typeof arg2 === 'number' && typeof arg1 === 'number') {
			x1 = arg1;
			x2 = arg2;
		} else {
			throw new Error("Type Mismatch!")
		}
		if (x1 >= this.X1_Count || x2 >= this.X2_Count) throw new Error("Out of Bounds!")
		return this.__store[this.__mapper.inGrid.to1d(x1, x2)]
	}

}


const a = new TwoDimensionArray(4, 2);

a.get([1, 2])
