import PropPanel from '@/core/foundation/PropPanel';
import PropType from '@/core/foundation/PropType';
import ProundSkillData from './ProudSkillData';

/**
 * 角色固有天赋组配置数据
 */
export default class ProudSkillGroupData {
    id: number;

    /**
     * 各等级下的数据
     */
    levels: Map<number, ProundSkillData> = new Map();

    constructor(id: number) {
        this.id = id;
    }

    addSkill(data: any) {
        let skill = new ProundSkillData(data);
        this.levels.set(skill.level, skill);
    }

    toString(): string {
        return `ProudSkillGroup${this.id}`;
    }
}