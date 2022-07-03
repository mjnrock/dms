import { useState, useEffect } from "react";

export function useArray(seed: any = []): any {
	const [ array, setArray ] = useState<any[]>([]);

	useEffect(() => {
		setArray(seed);
	}, [ seed ]);

	const add = (...values: any): void => {
		setArray([ ...array, ...values ]);
	};
	const remove = (...values: any): void => {
		const _array = array;

		for(const value of values) {
			const index = _array.indexOf(value);

			if(index !== -1) {
				_array.splice(index, 1);
			}
		}

		setArray(_array);
	};
	const clear = () => {
		setArray([]);
	};
	const has = (value: any) => array.indexOf(value) !== -1;
	const values = () => array;
	const entries = () => array.map((value, index) => [ index, value ]);
	const size = () => array.length;

	return {
		array,
		add,
		remove,
		clear,
		has,
		values,
		entries,
		size,
	};
};

export default useArray;