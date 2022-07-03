import { useState, useEffect } from "react";

export function useMap(seed: any = []): any{
	const [ map, setMap ] = useState<Map<any, any>>(new Map());

	useEffect(() => {
		setMap(new Map(seed));
	}, [ seed ]);

	const get = (key: any) => map.get(key);
	const set = (key: any, value: any): void => {
		setMap(map.set(key, value));
	};
	const remove = (key: any) => {
		const _map = map;

		if(_map.delete(key)) {
			setMap(_map);
		}
	};
	const clear = () => {
		setMap(new Map());
	}
	const has = (key: any) => map.has(key);
	const keys = () => map.keys();
	const values = () => map.values();
	const entries = () => map.entries();
	const size = () => map.size;

	return {
		map,
		get,
		set,
		remove,
		clear,
		has,
		keys,
		values,
		entries,
		size,
	};
};

export default useMap;