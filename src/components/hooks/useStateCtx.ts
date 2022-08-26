import { useContext, useEffect, useState } from "react"
import ViewModel, { ViewModelTopic } from "ViewModel/ViewModelStore"

const initialSubscription = {
	publish: (value: any) => {
		console.log('dummy ran')
	},
	unsubscribe: () => {
		console.log('dummy ran')
	}
}

const useStateCtx = (topic: ViewModelTopic, subscriber: string): [any, (value: any) => void] => {
	const ctx = useContext(ViewModel)
	const [value, setValue] = useState<any>(undefined)
	const [subscription, setSubscription] = useState(initialSubscription)
	useEffect(() => {
		setSubscription(ctx.subscribe(topic, setValue, subscriber))
		return () => {
			subscription.unsubscribe()
		}
	}, [])
	return [value, subscription.publish]
}
export default useStateCtx

