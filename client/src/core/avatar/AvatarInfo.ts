import WeaponInfo from '@/core/weapon/WeaponInfo';
import RelicPanel from '@/core/relic/RelicPanel';
import SkillType from '@/core/skill/SkillType';
import AvatarData from './AvatarData';
import ProudSkillData from '@/core/skill/ProudSkillData';
import SkillData from '@/core/skill/SkillData';
import PropPanel from '@/core/foundation/PropPanel';
import CoreEngine from "@/core/CoreEngine";

/**
 * 角色信息
 */
export default class AvatarInfo {
    /**
     * 角色ID
     */
    id: number;

    /**
     * 等级
     */
    level: number;

    /**
     * 是否已突破（用于在处于突破等级时区分当前是否已突破）
     */
    promoted: boolean;

    /**
     * 命之座
     */
    constellation: number;

    /**
     * 技能等级
     */
    skillLevels: Array<number>;

    /**
     * 武器
     */
    weapon: WeaponInfo | undefined;

    /**
     * 圣遗物
     */
    relic: RelicPanel;


    get data(): AvatarData {
        return CoreEngine.avatar.avatars.get(this.id)!!
    }

    constructor(id: number) {
        this.id = id;
        this.level = 90;
        this.promoted = false;
        this.constellation = 0;
        this.skillLevels = [10, 10, 10];
        this.relic = new RelicPanel();
    }

    setLevel(level: number, promoted: boolean) {
        this.level = level;
        this.promoted = promoted;
    }

    getSkillLevel(skillType: SkillType): number {
        return this.skillLevels[skillType.index];
    }

    setSkillLevel(skillType: SkillType, level: number) {
        this.skillLevels[skillType.index] = level;
    }

    getSkillProudData(skillType: SkillType): ProudSkillData {
        let level = this.getSkillLevel(skillType);
        let skill = this.data.skillDepot.getSkill(skillType)!;
        return skill.getProudSkillData(level)!;
    }

    getBasePanel(): PropPanel {
        let panel = this.data.getBasePanelAt(this.level, this.promoted);
        if (this.weapon) {
            panel.addPanel(this.weapon.getBasePanel());
        }
        return panel;
    }

    getTotalPanel(): PropPanel {
        let panel = this.getBasePanel();
        panel.addPanel(this.relic.getPanel());
        return panel;
    }
}