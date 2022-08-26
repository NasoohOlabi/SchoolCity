import { createContext } from "react";

export type IViewModel = {
	sidebarExpanded: any
	templatesExpanded: any
	title: any
	gapiUser: any,
	drive: any,
	sheets: any,
	docs: any,
	gmail: any,
	people: any
}

export type ViewModelTopic = keyof IViewModel

// const v : ViewModelTopic = "sidebarExpanded"
export class ViewModelPubSub {
	states: IViewModel;
	callbacks: {
		[index in ViewModelTopic]: Map<string, React.Dispatch<any>>
	}
	constructor({
		sidebarExpanded
		, templatesExpanded
		, title
		, gapiUser
		, drive
		, sheets
		, docs
		, gmail
		, people }: {
			[index in ViewModelTopic]: any
		}) {
		this.states = {
			sidebarExpanded,
			templatesExpanded,
			title, gapiUser, drive
			, sheets,
			docs,
			gmail,
			people,
		}
		this.callbacks = {
			sidebarExpanded: new Map(),
			templatesExpanded: new Map(),
			title: new Map(),
			gapiUser: new Map(),
			drive: new Map(),
			sheets: new Map(),
			docs: new Map(),
			gmail: new Map(),
			people: new Map(),
		}
	}

	subscribe = (topic: ViewModelTopic, callback: React.Dispatch<any>, subscriber: string) => {
		this.callbacks[topic].set(subscriber, callback)
		return {
			unsubscribe: () => {
				this.callbacks[topic].delete(subscriber)
			},
			publish: (value: any) => {
				this.publish(topic, value)
			}
		}
	}

	publish = (topic: ViewModelTopic, value: any) => {
		this.states[topic] = value
		this.callbacks[topic].forEach((callback, subscriber) => {
			console.log(`reRendering subscriber = `, subscriber);
			callback(value)
		});
	}
	get = (topic: ViewModelTopic) => this.states[topic]

}



// @ts-ignore
export const ViewModel = createContext<ViewModelPubSub>({} as ViewModelPubSub);


export default ViewModel;