import { createContext } from "react";

export class Topic<T> {
	private subscribers: React.Dispatch<React.SetStateAction<T>>[] = [];
	private currentState: T;
	constructor(cs: T) {
		this.currentState = cs;
	}
	/**
	 * Subscribe
	 * setState : React.Dispatch<React.SetStateAction<T>>
	 */
	public Subscribe(setState: React.Dispatch<React.SetStateAction<T>>) {
		this.subscribers.push(setState);
	}
	/**
	 * Unsubscribe
	 * setState : React.Dispatch<React.SetStateAction<T>>
	 */
	public Unsubscribe(setState: React.Dispatch<React.SetStateAction<T>>) {
		this.subscribers = this.subscribers.filter((f) => f !== setState);
	}
	/**
	 * Publish
	 * newState : T
	 */
	public Publish(newState: T) {
		this.currentState = newState;
		this.subscribers.forEach((fn) => {
			fn(newState);
		});
	}
	public getValue() {
		return this.currentState;
	}
}

export const useTopic = function <T>(identifier: T) {
	return createContext(new Topic(identifier));
};

/**
 * setter
 * at each child setter[id].push(localsetter)
 */
