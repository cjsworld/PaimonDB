import CoreEngine from '@/core/CoreEngine';
import SkillType from './SkillType';
import SkillData from './SkillData';
import TalentData from './TalentData';
import ProudSkillGroupData from './ProudSkillGroupData';

/**
 * 技能套装配置数据
 */
export default class SkillDepotData {
    id: number;

    skills: SkillData[] = [];
    talents: TalentData[] = [];
    inherentProudSkill: ProudSkillGroupData[] = [];

    constructor(data: any) {
        this.id = data.id;
        for (let id of data.skills) {
            let skill = CoreEngine.skill.skills.get(id);
            if (skill) {
                this.skills.push(skill);
            }
        }
        let id = data.energySkill;
        if (id) {
            let skill = CoreEngine.skill.skills.get(id);
            if (skill) {
                this.skills.push(skill);
            }
        }
        for (let id of data.talents) {
            this.talents.push(CoreEngine.skill.talents.get(id)!);
        }
        for (let item of data.inherentProudSkillOpens) {
            let id = item.proudSkillGroupId;
            if (!id) {
                continue;
            }
            this.inherentProudSkill.push(CoreEngine.skill.proudSkillGroups.get(id)!);
        }
    }

    getSkill(type: SkillType): SkillData | undefined {
        return this.skills.find(e => e.triggerId == type.triggerID);
    }
}