<template>
    <div>
        <el-divider content-position="left">角色配置</el-divider>
        <el-form :inline="true" :model="avatarInfo" size="small">
            <el-form-item label="角色">
                <el-select v-model="avatarInfo.id" @change="onAvatarChange" filterable style="width: 200px" class="avatar-select">
                    <el-option v-for="item in avatarOptions" :key="item.id" :value="item.id"
                               :label="item.name" class="avatar-option">
                        <el-avatar :src="item.icon"></el-avatar>
                        <div :class="`elem-${item.elemType.id.toLowerCase()}`">{{ item.name }}</div>
                        <span style="float: right">{{ `${item.rank}★` }}</span>
                    </el-option>
                    <template slot="prefix">
                        <el-avatar class="avatar-prefix" :src="avatarInfo.data ? avatarInfo.data.icon : ''" alt=""></el-avatar>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="命座">
                <el-select v-model="avatarInfo.constellation" style="width: 60px">
                    <el-option v-for="item in constellationOptions" :key="item" :value="item"
                               :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="等级">
                <el-input-number v-model="avatarInfo.level" :min="1" :max="avatarLevelMax" controls-position="right"
                                 style="width: 90px"></el-input-number>
            </el-form-item>
            <el-form-item label="突破">
                <el-switch v-model="avatarInfo.promoted"></el-switch>
            </el-form-item>
            <el-form-item label="技能A">
                <el-select v-model="avatarInfo.skillLevels[0]" style="width: 90px">
                    <el-option v-for="item in avatarSkillOptions" :key="item" :value="item"
                               :label="`Lv. ${item}`"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="技能E">
                <el-select v-model="avatarInfo.skillLevels[1]" style="width: 90px">
                    <el-option v-for="item in avatarSkillOptions" :key="item" :value="item"
                               :label="`Lv. ${item}`"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="技能Q">
                <el-select v-model="avatarInfo.skillLevels[2]" style="width: 90px">
                    <el-option v-for="item in avatarSkillOptions" :key="item" :value="item"
                               :label="`Lv. ${item}`"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-divider content-position="left">武器配置</el-divider>
        <el-form :inline="true" :model="weaponInfo" size="small">
            <el-form-item label="武器">
                <el-select v-model="weaponInfo.id" @change="onWeaponChange" filterable style="width: 200px" class="avatar-select">
                    <el-option v-for="item in weaponOptions" :key="item.id" :value="item.id"
                               :label="item.name" class="avatar-option">
                        <el-avatar :src="item.icon"></el-avatar>
                        <div>{{ item.name }}</div>
                        <span style="float: right">{{ `${item.rank}★` }}</span>
                    </el-option>
                    <template slot="prefix">
                        <el-avatar class="avatar-prefix" :src="weaponInfo.data ? weaponInfo.data.icon : ''" alt=""></el-avatar>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="精练">
                <el-select v-model="weaponInfo.refine" style="width: 60px">
                    <el-option v-for="item in refineOptions" :key="item" :value="item"
                               :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="等级">
                <el-input-number v-model="weaponInfo.level" :min="1" :max="weaponLevelMax" controls-position="right"
                                 style="width: 90px"></el-input-number>
            </el-form-item>
            <el-form-item label="突破">
                <el-switch v-model="weaponInfo.promoted"></el-switch>
            </el-form-item>
        </el-form>
        <el-divider content-position="left">敌人配置</el-divider>
        <el-divider content-position="left">技能配置</el-divider>
        <el-form :inline="true" size="small">
            <el-form-item label="技能">
                <el-select v-model="skillOptionIndex">
                    <el-option v-for="(item,index) in skillOptions" :key="index" :value="index"
                               :label="item.desc"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-divider content-position="left">圣遗物配置</el-divider>
        <el-card class="relic-card" v-for="(r,index) in relicList" :key="index">
            <relic :ref="`relic-${index}`" :slot-index="index" :relic-info="r"></relic>
        </el-card>
        <el-divider content-position="left">伤害计算结果</el-divider>
        <el-button type="primary" @click="calcDamage">计算伤害</el-button>
        <br>
        <br>
        <div>
            <label>暴击伤害：{{ damage }}</label>
        </div>
    </div>

</template>

<script>
import CoreEngine from "@/core/CoreEngine";
import AvatarInfo from "@/core/avatar/AvatarInfo";
import WeaponInfo from "@/core/weapon/WeaponInfo";
import PropType from '@/core/foundation/PropType';
import RelicSlotType from '@/core/relic/RelicSlotType';
import MonsterInfo from '@/core/monster/MonsterInfo';
import CalcContext from '@/core/foundation/CalcContext';
import relic from "@/views/index/components/relic";
import RelicInfo from "@/core/relic/RelicInfo";

export default {
    components: {relic},
    data() {
        return {
            avatarOptions: [],
            constellationOptions: [0, 1, 2, 3, 4, 5, 6],
            avatarLevelMax: 90,
            avatarSkillOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],

            weaponOptions: [],
            refineOptions: [1, 2, 3, 4, 5],
            weaponLevelMax: 90,

            skillOptions: [],

            avatarInfo: new AvatarInfo(0),
            weaponInfo: new WeaponInfo(0),

            skillOptionIndex: null,
            relicList: [],
            damage: 0
        };
    },
    created() {
        this.avatarOptions = CoreEngine.avatar.getAvatarOptions();
        this.avatarInfo = new AvatarInfo(10000037);
        this.weaponInfo = new WeaponInfo(15502);
        this.relicList = this.testDefaultRelic();
        this.onAvatarChange();
    },
    methods: {
        onAvatarChange() {
            let avatarData = this.avatarInfo.data;
            if (!avatarData) {
                this.weaponOptions = [];
                this.weaponOptions.id = 0;
                this.skillOptions = [];
                this.skillOptionIndex = null;
                return;
            }

            this.weaponOptions = CoreEngine.weapon.getWeaponOptions(avatarData.weaponType);
            let weaponData = this.weaponInfo.data;
            if (!weaponData || weaponData.weaponType !== avatarData.weaponType) {
                if (this.weaponOptions.length > 0) {
                    this.weaponInfo.id = this.weaponOptions[0].id;
                } else {
                    this.weaponOptions.id = 0;
                }
            }

            if (avatarData.impl) {
                this.skillOptions = avatarData.impl.getSkillOptions();
                this.skillOptionIndex = 0;
            } else {
                this.skillOptions = [];
                this.skillOptionIndex = null;
            }
        },
        onWeaponChange() {

        },
        testDefaultRelic() {
            let list = [];
            let relicSet = CoreEngine.relic.sets.get(14001); //冰套
            let relic;
            //花
            relic = relicSet.newInfo(RelicSlotType.Flower, 5);
            relic.setSubProp(1, PropType.DEF, 19);
            relic.setSubProp(2, PropType.PercentATK, 0.152);
            relic.setSubProp(3, PropType.ATK, 37);
            relic.setSubProp(4, PropType.CritHurt, 0.202);
            list.push(relic);

            //羽毛
            relic = relicSet.newInfo(RelicSlotType.Leather, 5);
            relic.setSubProp(1, PropType.PercentATK, 0.105);
            relic.setSubProp(2, PropType.CritHurt, 0.326);
            relic.setSubProp(3, PropType.CritRate, 0.039);
            relic.setSubProp(4, PropType.HP, 269);
            list.push(relic);

            //沙漏
            relic = relicSet.newInfo(RelicSlotType.Sand, 5);
            relic.mainPropType = PropType.PercentATK;
            relic.setSubProp(1, PropType.CritRate, 0.097);
            relic.setSubProp(2, PropType.ChargeRate, 0.091);
            relic.setSubProp(3, PropType.ATK, 35);
            relic.setSubProp(4, PropType.CritHurt, 0.148);
            list.push(relic);

            //杯子
            relic = relicSet.newInfo(RelicSlotType.Cup, 5);
            relic.mainPropType = PropType.IceAddHurt;
            relic.setSubProp(1, PropType.PercentDEF, 0.117);
            relic.setSubProp(2, PropType.CritRate, 0.031);
            relic.setSubProp(3, PropType.PercentHP, 0.122);
            relic.setSubProp(4, PropType.CritHurt, 0.187);
            list.push(relic);

            //头
            relic = relicSet.newInfo(RelicSlotType.Cap, 5);
            relic.mainPropType = PropType.CritHurt;
            relic.setSubProp(1, PropType.DEF, 37);
            relic.setSubProp(2, PropType.HP, 538);
            relic.setSubProp(3, PropType.ATK, 33);
            relic.setSubProp(4, PropType.CritRate, 0.066);
            list.push(relic);

            return list;
        },
        calcDamage() {
            console.log(this.relicList)
            if (!this.avatarInfo.data || !this.weaponInfo.data) {
                this.damage = 0;
                return;
            }
            let info = this.avatarInfo;
            info.weapon = this.weaponInfo;
            for (let relic of this.relicList) {
                info.relic.putRelic(relic);
            }
            let panel = info.getTotalPanel();

            //Trace.WriteLine(panel);

            console.log(`名称: ${this.avatarInfo.data.name}`);
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
            ctx.skillOption = this.skillOptions[this.skillOptionIndex]; //重击二段范围伤害
            this.damage = ctx.calcDamage();
            console.log(`暴击伤害值: ${this.damage}`);
        }
    },
};
</script>

<style scoped>

::v-deep .avatar-select .el-input__inner {
    padding-left: 38px;
    vertical-align: middle;
}

.avatar-select .avatar-prefix {
    vertical-align: middle;
    width: 25px;
    height: 25px;
}

.avatar-option {
    margin: 5px 0;
}


.avatar-option .el-avatar {
    width: 30px;
    height: 30px;
    vertical-align: middle
}

.avatar-option div {
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle
}

.relic-card {
    display: inline-block;
    margin-left: 10px;
    width: 310px;
}

.elem-fire {
    color: rgb(220, 20, 60);
}

.elem-ice {
    color: rgb(0, 191, 255);
}

.elem-elec {
    color: rgb(138, 43, 226);
}

.elem-rock {
    color: rgb(218, 165, 32);
}

.elem-grass {
    color: rgb(154, 205, 50);
}

.elem-water {
    color: rgb(30, 144, 255);
}

.elem-wind {
    color: rgb(102, 205, 170);
}


</style>
