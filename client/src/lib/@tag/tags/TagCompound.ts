import ATag, { EnumTagType, TagGroup } from "./ATag";

export class TagCompound extends ATag {
	constructor(name: string, value: TagGroup = []) {
		super({
			type: EnumTagType.COMPOUND,
			name: name,
			value: new Set(value),
		});
	}

	public size(): number {
		return this.value.size;
	}	

	public setValue(value: TagGroup): boolean {
		this.value = new Set(value);

		return true;
	}
	public clearValue(): void {
		this.value = new Set();
	}

	public getChildren(): ATag[] {
		return Array.from(this.value);
	}
	public setChildren(value: TagGroup): void {
		this.value = new Set(value);
	}
	public addChildren(children: TagGroup): void {
		for (const child of Array.from(children)) {
			this.addChild(child);
		}
	}
	public clearChildren(): void {
		this.value.clear();
	}

	public addChild(child: ATag): void {
		this.value.add(child);
	}
	public removeChild(child: ATag): void {
		this.value.delete(child);
	}
	public hasChild(child: ATag): boolean {
		return this.value.has(child);
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
		const children: ATag[] = Array.from(this.value);

		if (index < 0 || index >= children.length) {
			return false;
		}

		return children[index];
	}

	public toObject(): object {
		const obj: any = {
			type: this.type,
			name: this.name,
			value: {},
		};

		for (const child of this.value) {
			obj.value[child.getName()] = child.toObject();
		}

		return obj;
	}
	public toString(space: any = null, replacer: any = null): string {
		return JSON.stringify(this.toObject(), replacer, space);
	}
}

export default TagCompound;
