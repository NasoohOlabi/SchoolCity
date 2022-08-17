import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "./title";

const useTitle = (title?: string) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (title)
			dispatch(setTitle(title))
		return () => {
			dispatch(setTitle(""))
		}
	}, []);
}

export default useTitle;