import PropPanel from '@/core/foundation/PropPanel';
import PropType from '@/core/foundation/PropType';
import CoreEngine from '@/core/CoreEngine';

export default class AffixData {
    id: number;
    name: string;
    desc: string;

    /**
     * 效果等级
     */
    level: number;

    /**
     * 增加属性
     */
    addProps: PropPanel;

    /**
     * 效果实现名称
     */
    config: string;

    /**
     * 参数
     */
    params: number[];

    constructor(data: any) {
        this.id = data.id;
        this.name = CoreEngine.getText(data.nameTextMapHash);
        this.desc = CoreEngine.getText(data.descTextMapHash);
        this.level = data.level ?? 0;
        this.addProps = new PropPanel();
        for (let item of data.addProps) {
            let propTypeStr = item.propType;
            if (!propTypeStr) {
                continue;
            }
            let propType = PropType.getByConfigName(propTypeStr);
            this.addProps.addProp(propType.by(item.value));
        }
        this.config = data.openConfig;
        this.params = data.paramList;
    }
}