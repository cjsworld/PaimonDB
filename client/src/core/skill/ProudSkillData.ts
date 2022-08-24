import CoreEngine from '@/core/CoreEngine';
import PropPanel from '@/core/foundation/PropPanel';
import PropType from '@/core/foundation/PropType';

/**
 * 角色固有天赋配置数据
 */
export default class ProudSkillData {
    id: number;

    /**
     * 天赋等级
     */
    level: number;

    /**
     * 技能类型
     */
    skillType: number;

    /**
     * 名称
     */
    name: string;

    /**
     * 描述
     */
    desc: string;

    /**
     * 增加属性
     */
    addProps: PropPanel;

    openConfig: string;

    paramDesc: string[];

    params: number[];

    constructor(data: any) {
        this.id = data.proudSkillId;
        this.level = data.level;
        this.skillType = data.proudSkillType;
        this.name = CoreEngine.getText(data.nameTextMapHash);
        this.desc = CoreEngine.getText(data.descTextMapHash);

        this.addProps = new PropPanel();
        for (let item of data.addProps) {
            let type = PropType.getByConfigName(item.propType);
            let value = data.value ?? 0;
            this.addProps.addProp(type.by(value));
        }

        this.openConfig = data.openConfig;
        this.paramDesc = [];
        for (let h of data.paramDescList) {
            this.paramDesc.push(CoreEngine.getText(h));
        }
        this.params = data.paramList;
    }

    toString(): string {
        return this.name;
    }
}