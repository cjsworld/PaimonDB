/**
 * 升级曲线配置数据
 * <br/>
 * 各等级下的数据，是由基础值*曲线上对应的倍率得到。
 */
export default class CurveData {
    /**
     * 曲线类型
     */
    type: string;


    /**
     * 各等级对应的倍率值
     */
    values: Map<number, number> = new Map();

    minLevel: number;
    maxLevel: number;

    constructor(type: string) {
        this.type = type;
        this.minLevel = 1000;
        this.maxLevel = 0;
    }

    addLevel(level: number, value: number) {
        if (this.values.has(level)) {
            throw new Error(`Curve ${this.type} alread has level ${level}`);
        }
        this.values.set(level, value);
        this.minLevel = Math.min(this.minLevel, level);
        this.maxLevel = Math.max(this.maxLevel, level);
    }

    getValue(level: number): number {
        return this.values.get(level) ?? 0;
    }
}