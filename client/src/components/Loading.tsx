import { ProgressSpinner } from "primereact/progressspinner";

export function Loading() {
	return (
		<div className="flex h-screen border rounded">
			<div className="m-auto">
				<ProgressSpinner />
				<div className="font-semibold text-center">Loading...</div>
			</div>
		</div>
	);
};

export default Loading;