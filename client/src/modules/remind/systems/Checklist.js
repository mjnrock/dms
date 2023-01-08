import { dispatch } from "./ASystem";
import { Name } from "./../components/Checklist";
import { ChecklistItem } from "./../components/templates/ChecklistItem";
import ComponentChecklist from "./../components/Checklist";

export const Checklist = {
	update(emitter, data = {}) {
		emitter.shared[ Name ] = {
			...emitter.shared[ Name ],
			...data,
		};

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},

	attachChecklist(emitter, checklistArgs = {}) {
		emitter.shared[ Name ] = ComponentChecklist.Create({ ...checklistArgs });

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	detachChecklist(emitter) {
		delete emitter.shared[ Name ];

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},

	setTitle(emitter, title) {
		emitter.shared[ Name ].title = title;

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	addChecklistItem(emitter, checklistItemArgs = {}) {
		if(Array.isArray(checklistItemArgs)) {
			checklistItemArgs.forEach((checklistItemArgs) => Checklist.addChecklistItem(emitter, checklistItemArgs));

			return emitter;
		}

		const checklistItem = new ChecklistItem({ ...checklistItemArgs, order: emitter.shared[ Name ].list.size });

		emitter.shared[ Name ].list.set(checklistItem.id, checklistItem);

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	removeChecklistItem(emitter, checklistItem) {
		if(Array.isArray(checklistItem)) {
			checklistItem.forEach((checklistItem) => Checklist.removeChecklistItem(emitter, checklistItem));

			return emitter;
		}

		emitter.shared[ Name ].list.delete(checklistItem.id);

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	toggleChecklistItem(emitter, checklistItem) {
		if(Array.isArray(checklistItem)) {
			checklistItem.forEach((checklistItem) => Checklist.toggleChecklistItem(emitter, checklistItem));

			return emitter;
		}

		checklistItem.complete = !checklistItem.complete;

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},

	setComplete(emitter, complete) {
		emitter.shared[ Name ].complete = complete;

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	setContent(emitter, content) {
		emitter.shared[ Name ].content = content;

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	setOrder(emitter, order) {
		emitter.shared[ Name ].order = order;

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	addToken(emitter, ...tokens) {
		emitter.shared[ Name ].tokens.push(...tokens);

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	removeToken(emitter, ...tokens) {
		emitter.shared[ Name ].tokens = emitter.shared[ Name ].tokens.filter((token) => {
			return !tokens.includes(token);
		});

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
};

export default Checklist;