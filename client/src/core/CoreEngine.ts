import CoreEngineModule from "@/core/CoreEngineModule";
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

import api from '@/api';
import axios from 'axios'

class CoreEngine {
    private inited = false;
    private modules = new Array<CoreEngineModule>();

    dataVersion = "3.0_R9624836_S9598838_D9617080";

    upgrade: UpgradeModule;
    affix: AffixModule;
    skill: SkillModule;
    weapon: WeaponModule;
    avatar: AvatarModule;
    relic: RelicModule;

    curUid?: number

    constructor() {
        this.modules.push(this.upgrade = new UpgradeModule());
        this.modules.push(this.affix = new AffixModule());
        this.modules.push(this.skill = new SkillModule());
        this.modules.push(this.weapon = new WeaponModule());
        this.modules.push(this.avatar = new AvatarModule());
        this.modules.push(this.relic = new RelicModule());
    }

    async init(): Promise<void> {
        if (this.inited) {
            return;
        }
        console.log("CoreEngine init start");
        let startTime = new Date();
        //this.textMap = await this.readJsonResource("TextMapCHS");
        this.textMap = await this.readJsonResource("TextMapCHSMini");
        for (let mod of this.modules) {
            await mod.init();
        }
        this.textMap = undefined;
        //console.log(JSON.stringify(this.textMapMini));
        //this.textMapMini = undefined;
        this.inited = true;
        let diff = new Date().valueOf() - startTime.valueOf();
        console.log(`CoreEngine init finish in ${diff} ms`);
        console.log(this);
    }

    async onUserChange(uid: number) {
        this.curUid = uid;
        for (let mod of this.modules) {
            await mod.onUserChange(uid);
        }
    }

    async reqApi(a: string, p: any = {}, cancel: boolean = false, showNp: boolean = true): Promise<any> {
        return await api(a, p, cancel, showNp);
    }

    async readJsonResource(filename: string): Promise<any> {
        let url = `/config/${this.dataVersion}/${filename}.json`;
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

        let relicSet = this.relic.sets.get(14001)!; //??????
        let relic;
        //???
        relic = relicSet.newInfo(RelicSlotType.Flower, 5);
        relic.setSubProp(1, PropType.DEF, 19);
        relic.setSubProp(2, PropType.ATKPercent, 0.152);
        relic.setSubProp(3, PropType.ATK, 37);
        relic.setSubProp(4, PropType.CritHurt, 0.202);
        info.relic.putRelic(relic);

        //??????
        relic = relicSet.newInfo(RelicSlotType.Leather, 5);
        relic.setSubProp(1, PropType.ATKPercent, 0.105);
        relic.setSubProp(2, PropType.CritHurt, 0.326);
        relic.setSubProp(3, PropType.CritRate, 0.039);
        relic.setSubProp(4, PropType.HP, 269);
        info.relic.putRelic(relic);

        //??????
        relic = relicSet.newInfo(RelicSlotType.Sand, 5);
        relic.mainPropType = PropType.ATKPercent;
        relic.setSubProp(1, PropType.CritRate, 0.097);
        relic.setSubProp(2, PropType.ChargeRate, 0.091);
        relic.setSubProp(3, PropType.ATK, 35);
        relic.setSubProp(4, PropType.CritHurt, 0.148);
        info.relic.putRelic(relic);

        //??????
        relic = relicSet.newInfo(RelicSlotType.Cup, 5);
        relic.mainPropType = PropType.IceAddHurt;
        relic.setSubProp(1, PropType.DEFPercent, 0.117);
        relic.setSubProp(2, PropType.CritRate, 0.031);
        relic.setSubProp(3, PropType.HPPercent, 0.122);
        relic.setSubProp(4, PropType.CritHurt, 0.187);
        info.relic.putRelic(relic);

        //???
        relic = relicSet.newInfo(RelicSlotType.Cap, 5);
        relic.mainPropType = PropType.CritHurt;
        relic.setSubProp(1, PropType.DEF, 37);
        relic.setSubProp(2, PropType.HP, 538);
        relic.setSubProp(3, PropType.ATK, 33);
        relic.setSubProp(4, PropType.CritRate, 0.066);
        info.relic.putRelic(relic);

        let panel = info.getTotalPanel();

        //Trace.WriteLine(panel);

        console.log(`??????: ${ganyu.name}`);
        console.log(`?????????: ${panel.totalHP()}`);
        console.log(`?????????: ${panel.totalATK()}`);
        console.log(`?????????: ${panel.totalDEF()}`);
        console.log(`?????????: ${panel.get(PropType.CritRate)}`);
        console.log(`????????????: ${panel.get(PropType.CritHurt)}`);
        console.log(`??????????????????: ${panel.get(PropType.ChargeRate)}`);
        console.log(`?????????????????????: ${panel.get(PropType.IceAddHurt)}`);

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
        //monster.props.addProp(PropType.IceSubHurt.by(-0.15)); //TODO ??????1?????????

        let ctx = new CalcContext();
        ctx.avatar = info;
        ctx.monster = monster;
        ctx.skillOption = ganyu.impl!.getSkillOptions()[0]; //????????????????????????
        let damage = ctx.calcDamage();
        console.log(`???????????????: ${damage}`);
        //36416.42053826135
    }
}

export default new CoreEngine();