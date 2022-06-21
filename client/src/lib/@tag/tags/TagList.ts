import ATag, { EnumTagType, TagGroup } from "./ATag";

export class TagList extends ATag {
	/**
	 * A value of << false >> means that the content can be of *any* EnumTagType (i.e. not a typed-list)
	 */
	protected contentType: EnumTagType | null = null;

	constructor(name: string, value: TagGroup = [], contentType?: EnumTagType | null) {
		super({
			type: EnumTagType.LIST,
			name: name,
			value: [],
		});

		this.setContentType(contentType || null);
		this.setChildren(value);
	}

	public size(): number {
		return this.value.length;
	}	

	public setValue(value: TagGroup): boolean {		
		this.value = [];
		for(const child of value) {
			if(this.contentType === null) {
				this.value.push(child);
			} else if(child.getType() === this.contentType) {
				this.value.push(child);
			}
		}

		return true;
	}
	public clearValue(): void {
		this.value = [];
	}

	public getContentType(): EnumTagType | null{
		return this.contentType;
	}
	public setContentType(type: EnumTagType | null): void {
		this.contentType = type;
	}

	//#region Children
	public getChildren(): ATag[] {
		return this.value;
	}
	public setChildren(value: TagGroup): void {
		this.value = Array.from(value);
	}
	public addChildren(children: TagGroup): void {
		for (const child of Array.from(children)) {
			this.addChild(child);
		}
	}
	public clearChildren(): void {
		this.value = [];
	}

	public addChild(child: ATag): void {
		this.value.push(child);
	}
	public removeChild(child: ATag): void {
		this.value = this.value.filter((c: ATag) => c !== child);
	}
	public hasChild(child: ATag): boolean {
		return this.value.includes(child);
	}
	public getChild(name: string): ATag | false {
		for (const child of this.value) {
			if (child.getName() === name) {
				return child;
			}
		}

		return false;
	}
	public getChildAt(index: number): ATag | false {
		if (index < 0 || index >= this.value.length) {
			return false;
		}

		return this.value[index];
	}
	//#endregion Children

	//#region Serialization
	public toObject(): object {
		const obj: any = {
			type: this.type,
			name: this.name,
			value: [],
		};

		for (const child of this.value) {
			obj.value.push(child.toObject());
		}

		return obj;
	}
	public toString(space: any = null, replacer: any = null): string {
		return JSON.stringify(this.toObject(), replacer, space);
	}
	//#endregion Serialization
}

export default TagList;
