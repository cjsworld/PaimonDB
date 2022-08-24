import CoreEngine from '../CoreEngine';
import CoreEngineModule from '../CoreEngineModule';
import ProudSkillGroupData from './ProudSkillGroupData';
import SkillData from './SkillData';
import TalentData from './TalentData';
import SkillDepotData from './SkillDepotData';

export default class SkillModule implements CoreEngineModule {
    public proudSkillGroups: Map<number, ProudSkillGroupData> = new Map();
    public skills: Map<number, SkillData> = new Map();
    public talents: Map<number, TalentData> = new Map();
    public skillDepots: Map<number, SkillDepotData> = new Map();

    async init(): Promise<void> {
        let config = await CoreEngine.readJsonResource("ProudSkillExcelConfigData");
        for (let item of config) {
            let id = item.proudSkillGroupId;
            let group = this.proudSkillGroups.get(id);
            if (!group) {
                group = new ProudSkillGroupData(id);
                this.proudSkillGroups.set(id, group);
            }
            group.addSkill(item);
        }
        
        config = await CoreEngine.readJsonResource("AvatarSkillExcelConfigData");
        for (let item of config) {
            let skill = new SkillData(item);
            this.skills.set(skill.id, skill);
        }
        
        config = await CoreEngine.readJsonResource("AvatarTalentExcelConfigData");
        for (let item of config) {
            let talent = new TalentData(item);
            this.talents.set(talent.id, talent);
        }
        
        config = await CoreEngine.readJsonResource("AvatarSkillDepotExcelConfigData");
        for (let item of config) {
            let skill = new SkillDepotData(item);
            this.skillDepots.set(skill.id, skill);
        }
    }
    
    getSkillLevelOptions(): any[] {
        let ret = new Array<any>();
        for (let i = 1; i <= 13; i++) {
            ret.push({
                value: i,
                text: `Lv. ${i}️`
            })
        }
        return ret;
    }
}