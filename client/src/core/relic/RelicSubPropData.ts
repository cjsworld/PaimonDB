import PropType from '@/core/foundation/PropType';

/**
 * 圣遗物副词条配置数据
 */
export default class RelicSubPropData {
    /**
     * 属性类型
     */
    propType: PropType;

    /**
     * 可能出现的数值（目前规律是等差数列）
     */
    values = Array<number>();

    /**
     * 数值最小值
     */
    private baseValue: number;

    /**
     * 公差的平均值
     */
    private diffAvg: number;


    constructor(propType: PropType) {
        this.propType = propType;
        this.baseValue = 0;
        this.diffAvg = 0;
    }

    /**
     * 增加一个可能出现的属性值
     */
    addValue(value: number) {
        this.values.push(value);
        this.baseValue = this.values[0];
        if (this.values.length <= 1) {
            this.diffAvg = 0;
        } else {
            let last = this.values[this.values.length - 1];
            this.diffAvg = (last - this.baseValue) / (this.values.length - 1);
        }
    }

    /**
     * 根据游戏中显示的数值猜测原始精确值
     * <br/>
     * 如果猜测失败，则直接返回传入的值
     */
    getPreciseValue(value: number): number {
        let ret = this.calcPreciseValue(value);
        if (ret) {
            return ret.result;
        } else {
            return value;
        }
    }

    /**
     * 根据游戏中显示的数值猜测原始精确值
     * <br/>
     * 属性值目前是等差数列，一般是4个取值，每次强化得到的值为 <c>Base + k * Diff</c>，其中k取[0,3]。<br/>
     * 经过n次强化，得到的最终值为 <c>n * Base + (k1 + k2 + ... + kn) * Diff</c>。不妨把k的总和记为t。<br/>
     * 已知目前圣遗物可以强化5个词条，那么单属性就是最多6个词条。n取值为[1,6], t取值为[0, 3 * n]。<br/>
     * 对于游戏中显示的一个属性值来说，如果能够找到合适的整数n和t，使上述结果接近与目标值，那么基本就能确定精确值了。
     * <br/><br/>
     * result: 猜测成功的结果<br/>
     * hitCount: 当前词条命中次数<br/>
     * totalRank: 当前词条命中的品质总和<br/>
     */
    calcPreciseValue(value: number): any | null {
        for (let n = 1; n <= 6; n++) {
            let x = (value - n * this.baseValue);
            x /= this.diffAvg;

            //console.log(`>>>n=${n},x=${x}`);
            let k = Math.round(x);
            if (Math.abs(x - k) < 0.25) {
                if (k < 0 || k > (this.values.length - 1) * n) {
                    continue;
                }
                return {
                    hitCount: n,
                    totalRank: k,
                    result: this.baseValue * n + this.diffAvg * k
                }
            }
        }
        console.log(`Unable to calc percise value for ${this.propType} with ${value}`);
        return null;
    }
}