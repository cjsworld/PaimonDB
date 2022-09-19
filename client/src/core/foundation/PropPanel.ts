import PropType from './PropType';
import Prop from './Prop';

/**
 * 属性面板
 */
export default class PropPanel {
    props: Map<PropType, number> = new Map();

    constructor(...props: Prop[]) {
        for (let i = 0; i < props.length; i++) {
            let p = props[i];
            if (isNaN(p.value)) {
                throw new Error("prop value is NaN");
            }
            this.props.set(p.type, p.value);
        }
    }

    /**
     * 获取某个类型的值
     */
    get(type: PropType): number {
        return this.props.get(type) ?? 0;
    }

    /**
     * 获取某个类型
     */
    getProp(type: PropType): Prop {
        return type.by(this.get(type));
    }

    /**
     * 是否包含某个属性
     */
    hasProp(type: PropType): boolean {
        return this.props.has(type);
    }

    /**
     * 增加属性
     */
    addProp(prop: Prop): void {
        if (isNaN(prop.value)) {
            throw new Error("prop value is NaN");
        }
        this.props.set(prop.type, this.get(prop.type) + prop.value);
    }

    /**
     * 乘属性
     */
    mulProp(prop: Prop): void {
        if (isNaN(prop.value)) {
            throw new Error("prop value is NaN");
        }
        this.props.set(prop.type, this.get(prop.type) * prop.value);
    }

    /**
     * 增加面板属性集合
     */
    addPanel(panel: PropPanel): void {
        for (let entry of panel.props.entries()) {
            let type = entry[0];
            let value = entry[1];
            this.props.set(type, this.get(type) + value);
        }
    }

    /**
     * 复制一个面板
     */
    copy(): PropPanel {
        let panel = new PropPanel();
        for (let entry of this.props.entries()) {
            let type = entry[0];
            let value = entry[1];
            panel.props.set(type, value);
        }
        return panel;
    }

    toString(): string {
        let s = ""
        for (let type of PropType.All) {
            if (this.hasProp(type)) {
                if (s.length > 0) {
                    s += " | ";
                }
                s += `${type}:${this.get(type)}`;
            }
        }
        return s;
    }


    /**
     * 总生命值
     */
    totalHP(): number {
        let value = this.get(PropType.BaseHP);
        value *= (1 + this.get(PropType.HPPercent));
        value += this.get(PropType.HP);
        return value;
    }

    /**
     * 总攻击力
     */
    totalATK(): number {
        let value = this.get(PropType.BaseATK);
        value *= (1 + this.get(PropType.ATKPercent));
        value += this.get(PropType.ATK);
        return value;
    }

    /**
     * 总防御力
     */
    totalDEF(): number {
        let value = this.get(PropType.BaseDEF);
        value *= (1 + this.get(PropType.DEFPercent));
        value += this.get(PropType.DEF);
        return value;
    }
}