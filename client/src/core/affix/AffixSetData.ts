import AffixData from "./AffixData";

/**
 * 效果组配置数据
 * <br/>
 * 包含一组效果，按等级索引，等级从0开始
 */
export default class AffixSetData {
    id: number;

    levels: Map<number, AffixData> = new Map();

    constructor(id: number) {
        this.id = id;
    }

    addAffix(data: any) {
        let affix = new AffixData(data);
        this.levels.set(affix.level, affix);
    }

    toString(): string {
        if (this.levels.size == 0) {
            return "";
        } else {
            return this.levels.get(0)!.name;
        }
    }
}