import { dispatch } from "./ASystem";

export const Markdown = {
	update(emitter, data = {}) {
		emitter.shared.markdown = {
			...emitter.shared.markdown,
			...data,
		};

		dispatch(emitter, "update", emitter.shared.markdown);

		return emitter;
	},
	setContent(emitter, content) {
		emitter.shared.markdown.content = content;

		dispatch(emitter, "update", emitter.shared.markdown.content);

		return emitter;
	},
	setTitle(emitter, title) {
		emitter.shared.markdown.title = title;

		dispatch(emitter, "update", emitter.shared.markdown.title);

		return emitter;
	},
};

export default Markdown;