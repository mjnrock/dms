import { useState, useEffect } from "react";

export function useSet(seed: any = []): any {
	const [ set, setSet ] = useState<Set<any>>(new Set());

	useEffect(() => {
		setSet(new Set(seed));
	}, [ seed ]);

	const add = (value: any): void => {
		setSet(set.add(value));
	};
	const remove = (value: any): void => {
		const _set = set;

		if(_set.delete(value)) {
			setSet(_set);
		}
	};
	const clear = () => {
		setSet(new Set());
	};
	const has = (value: any) => set.has(value);
	const values = () => set.values();
	const entries = () => set.entries();
	const size = () => set.size;

	return {
		set,
		add,
		remove,
		clear,
		has,
		values,
		entries,
		size,
	};
};

export default useSet;