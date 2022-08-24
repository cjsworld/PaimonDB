import CoreEngine from '@/core/CoreEngine';
import ProudSkillGroupData from './ProudSkillGroupData';
import ProudSkillData from './ProudSkillData';

/**
 * 角色技能配置数据
 */
export default class SkillData {
    id: number;

    name: string;

    desc: string;

    /**
     * 触发器ID，可能对应到界面上各种按钮，比如普通，E，Q，冲刺之类
     */
    triggerId: number;

    /**
     * 对应的固有天赋组
     */
    proudSkillGroup: ProudSkillGroupData | undefined;

    constructor(data: any) {
        this.id = data.id;
        this.name = CoreEngine.getText(data.nameTextMapHash);
        this.desc = CoreEngine.getText(data.descTextMapHash);
        this.triggerId = data.triggerID ?? 0;
        let groupId = data.proudSkillGroupId;
        if (groupId) {
            this.proudSkillGroup = CoreEngine.skill.proudSkillGroups.get(groupId);
        }
    }

    getProudSkillData(level: number): ProudSkillData {
        if (!this.proudSkillGroup) {
            throw new Error(`Skill does not have level: ${level}`);
        }
        let data = this.proudSkillGroup.levels.get(level);
        if (!data) {
            throw new Error(`Skill does not have level: ${level}`);
        }
        return data!;
    }
}