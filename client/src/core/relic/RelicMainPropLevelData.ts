import PropPanel from '@/core/foundation/PropPanel';
import PropType from '@/core/foundation/PropType';
import Prop from '@/core/foundation/Prop';

/**
 * 圣遗物主属性等级配置数据
 */
export default class RelicMainPropLevelData {
    /**
     * 等级（初始1+强化等级）
     */
    level: number

    /**
     * 各个属性类型在此强化等级对应的值
     */
    addProps: PropPanel;


    constructor(data: any) {
        this.level = data.level ?? 0;
        this.addProps = new PropPanel();
        for (let prop of data.addProps) {
            let propType = PropType.getByConfigName(prop.propType);
            this.addProps.addProp(propType.by(prop.value ?? 0));
        }
    }

    getProp(type: PropType): Prop {
        return this.addProps.getProp(type);
    }
}