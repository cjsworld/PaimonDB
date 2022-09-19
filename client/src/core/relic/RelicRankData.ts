import PropType from '@/core/foundation/PropType';
import Prop from '@/core/foundation/Prop';
import RelicMainPropLevelData from './RelicMainPropLevelData';
import RelicSubPropData from './RelicSubPropData';

export default class RelicRankData {
    /**
     * 星级
     */
    rank: number;

    /**
     * 主属性配置数据
     */
    mainProps = new Map<number, RelicMainPropLevelData>();

    /**
     * 主属性配置数据
     */
    subProps = new Map<PropType, RelicSubPropData>();

    constructor(rank: number) {
        this.rank = rank;
    }

    addMainPropData(data: any) {
        let main = new RelicMainPropLevelData(data);
        this.mainProps.set(main.level - 1, main);
    }

    addSubPropData(data: any) {
        let propType = PropType.getByConfigName(data.propType);
        let value = data.propValue ?? 0;
        let sub = this.subProps.get(propType);
        if (!sub) {
            sub = new RelicSubPropData(propType);
            this.subProps.set(propType, sub);
        }
        sub.addValue(value);
    }

    /**
     * 获取某个等级的主词条数值
     */
    getMainProp(propType: PropType, level: number): Prop {
        return this.mainProps.get(level)!.getProp(propType)
    }

    /**
     * 获取副词条数值（会自动猜测精确值）
     */
    getSubProp(propType: PropType, value: number): Prop {
        return propType.by(this.getSubPropValue(propType, value));
    }

    /**
     * 获取副词条数值（会自动猜测精确值）
     */
    getSubPropValue(propType: PropType, value: number): number {
        return this.subProps.get(propType)!.getPreciseValue(value);
    }

    /**
     * 获取副词条可能出现的类型
     */
    getSubPropTypes(): PropType[] {
        let list = new Array<PropType>();
        for (let it of this.subProps.keys()) {
            list.push(it);
        }
        return list;
    }
}