import UpgradeModule from '@/core/upgrade/UpgradeModule';
import AffixModule from '@/core/affix/AffixModule';
import SkillModule from '@/core/skill/SkillModule';
import WeaponModule from '@/core/weapon/WeaponModule';
import AvatarModule from '@/core/avatar/AvatarModule';
import RelicModule from '@/core/relic/RelicModule';

import PropType from '@/core/foundation/PropType';
import RelicSlotType from '@/core/relic/RelicSlotType';
import MonsterInfo from '@/core/monster/MonsterInfo';
import CalcContext from '@/core/foundation/CalcContext';

import axios from 'axios'

class CoreEngine {
    private inited = false;
    dataVersion = "3.0_R9624836_S9598838_D9617080";
    upgrade = new UpgradeModule();
    affix = new AffixModule();
    skill = new SkillModule();
    weapon = new WeaponModule();
    avatar = new AvatarModule();
    relic = new RelicModule();

    async init(): Promise<void> {
        if (this.inited) {
            return;
        }
        console.log("CoreEngine init start");
        let startTime = new Date();
        //this.textMap = await this.readJsonResource("TextMapCHS");
        this.textMap = await this.readJsonResource("TextMapCHSMini");
        await this.upgrade.init();
        await this.affix.init();
        await this.skill.init();
        await this.weapon.init();
        await this.avatar.init();
        await this.relic.init();
        this.textMap = undefined;
        //console.log(JSON.stringify(this.textMapMini));
        //this.textMapMini = undefined;
        this.inited = true;
        let diff = new Date().valueOf() - startTime.valueOf();
        console.log(`CoreEngine init finish in ${diff} ms`);
        console.log(this);
    }

    async readJsonResource(filename: string): Promise<any> {
        let url = `config/${this.dataVersion}/${filename}.json`;
        let resp = await axios.get(url);
        if (resp.status != 200) {
            throw new Error(`Read json resource ${url} failed: ${resp.status}`);
        }
        return resp.data;
    }

    textMap: any
    //textMapMini = {};

    getText(hash: number): string {
        if (!this.textMap || !hash) {
            return ""
        } else {
            let s = this.textMap[hash.toString()];
            if (!s) {
                return "";
            } else {
                //this.textMapMini[hash.toString()] = s;
                return s;
            }
        }
    }

    testGanyu() {
        let ganyu = this.avatar.avatars.get(10000037)!;
        let info = ganyu.newInfo();
        let weapon = this.weapon.weapons.get(15502)!;
        info.weapon = weapon.newInfo();

        let relicSet = this.relic.sets.get(14001)!; //冰套
        let relic;
        //花
        relic = relicSet.newInfo(RelicSlotType.Flower, 5);
        relic.setSubProp(1, PropType.DEF, 19);
        relic.setSubProp(2, PropType.PercentATK, 0.152);
        relic.setSubProp(3, PropType.ATK, 37);
        relic.setSubProp(4, PropType.CritHurt, 0.202);
        info.relic.putRelic(relic);

        //羽毛
        relic = relicSet.newInfo(RelicSlotType.Leather, 5);
        relic.setSubProp(1, PropType.PercentATK, 0.105);
        relic.setSubProp(2, PropType.CritHurt, 0.326);
        relic.setSubProp(3, PropType.CritRate, 0.039);
        relic.setSubProp(4, PropType.HP, 269);
        info.relic.putRelic(relic);

        //沙漏
        relic = relicSet.newInfo(RelicSlotType.Sand, 5);
        relic.mainPropType = PropType.PercentATK;
        relic.setSubProp(1, PropType.CritRate, 0.097);
        relic.setSubProp(2, PropType.ChargeRate, 0.091);
        relic.setSubProp(3, PropType.ATK, 35);
        relic.setSubProp(4, PropType.CritHurt, 0.148);
        info.relic.putRelic(relic);

        //杯子
        relic = relicSet.newInfo(RelicSlotType.Cup, 5);
        relic.mainPropType = PropType.IceAddHurt;
        relic.setSubProp(1, PropType.PercentDEF, 0.117);
        relic.setSubProp(2, PropType.CritRate, 0.031);
        relic.setSubProp(3, PropType.PercentHP, 0.122);
        relic.setSubProp(4, PropType.CritHurt, 0.187);
        info.relic.putRelic(relic);

        //头
        relic = relicSet.newInfo(RelicSlotType.Cap, 5);
        relic.mainPropType = PropType.CritHurt;
        relic.setSubProp(1, PropType.DEF, 37);
        relic.setSubProp(2, PropType.HP, 538);
        relic.setSubProp(3, PropType.ATK, 33);
        relic.setSubProp(4, PropType.CritRate, 0.066);
        info.relic.putRelic(relic);

        let panel = info.getTotalPanel();

        //Trace.WriteLine(panel);

        console.log(`名称: ${ganyu.name}`);
        console.log(`生命值: ${panel.totalHP()}`);
        console.log(`攻击力: ${panel.totalATK()}`);
        console.log(`防御力: ${panel.totalDEF()}`);
        console.log(`暴击率: ${panel.get(PropType.CritRate)}`);
        console.log(`暴击伤害: ${panel.get(PropType.CritHurt)}`);
        console.log(`元素充能效率: ${panel.get(PropType.ChargeRate)}`);
        console.log(`冰元素伤害加成: ${panel.get(PropType.IceAddHurt)}`);

        //HP: 16582
        //ATK: 2508
        //DEF: 759
        //CritRate: 28.3%
        //CritHurt: 236.9%
        //ChargeRate: 109.1%
        //IceAddHurt: 61.6%
        console.log("===============");

        let monster = new MonsterInfo();
        monster.level = 88;
        monster.props.addProp(PropType.IceSubHurt.by(0.10000000149011612));
        //monster.props.addProp(PropType.IceSubHurt.by(-0.15)); //TODO 甘雨1命效果

        let ctx = new CalcContext();
        ctx.avatar = info;
        ctx.monster = monster;
        ctx.skillOption = ganyu.impl!.getSkillOptions()[0]; //重击二段范围伤害
        let damage = ctx.calcDamage();
        console.log(`暴击伤害值: ${damage}`);
        //36416.42053826135
    }
}

export default new CoreEngine();