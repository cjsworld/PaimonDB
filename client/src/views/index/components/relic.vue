<template>
    <el-form ref="relicForm" :model="relicInfo" :rules="relicRules" label-width="120px">
        <el-form-item label="选择圣遗物套装">
            <el-select v-model="relicInfo.id" @change="onRelicChange" filterable style="width: 200px" class="avatar-select">
                <el-option v-for="(item,_) in relicOptions" :key="item.id" :value="item.id"
                           :label="item.name" class="avatar-option">
                    <el-avatar :src="item.icon"></el-avatar>
                    <div>{{ item.name }}</div>
                </el-option>
                <template slot="prefix">
                    <el-avatar class="avatar-prefix" :src="relicInfo.data ? relicInfo.data.icon : ''" alt=""></el-avatar>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item label="选择圣遗物星级">
            <el-radio-group v-model="relicInfo.rank" size="small" @change="rankChange">
                <el-radio-button :label="4">4星</el-radio-button>
                <el-radio-button :label="5">5星</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="选择圣遗物位置">
            <el-radio-group v-model="relicInfo.slotIndex" size="mini" class="relic-radio" @change="slotChange">
                <el-radio v-for="s in slots.values()" :key="s.index" :label="s.index">
                    <el-avatar class="avatar-prefix" :src="relicInfo.data ? relicInfo.data.icon : ''" alt=""></el-avatar>
                </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="选择圣遗物等级">
            <el-input-number v-model="relicInfo.level" :min="1" :max="20" controls-position="right"
                             style="width: 120px"></el-input-number>
        </el-form-item>
        <el-form-item label="圣遗物主属性">
            <el-select v-model="relicInfo.mainProp" filterable style="width: 200px">
                <el-option v-for="(item,_) in mainProps" :key="item.id" :value="item.id"
                           :label="item.name">
                </el-option>
            </el-select>
            <el-input-number v-model="relicInfo.mainValue" controls-position="right"
                             style="width: 120px;margin-left: 5px"></el-input-number>
        </el-form-item>
        <el-form-item :label="index === 1 ? `圣遗物副属性` : ''" v-for="index in 4" :key="index">
            <el-select v-model="relicInfo[`subProp${index}`]" filterable style="width: 200px">
                <el-option v-for="(item,_) in subProps" :key="item.id" :value="item.id"
                           :label="item.name">
                </el-option>
            </el-select>
            <el-input-number v-model="relicInfo[`subValue${index}`]" controls-position="right"
                             style="width: 120px;margin-left: 5px"></el-input-number>
        </el-form-item>
    </el-form>
</template>

<script>
import CoreEngine from "@/core/CoreEngine";
import RelicSlotType from "@/core/relic/RelicSlotType";

export default {
    name: "Relic",
    data() {
        return {
            relicData: undefined,
            relicOptions: [],
            slots: [],
            mainProps: [],
            subProps: [],

            relicRules: {},
            relicInfo: {
                id: undefined,
                rank: 4,
                slotIndex: undefined,
                level: undefined,
                mainProp: undefined,
                mainValue: undefined,
                subProp1: undefined,
                subValue1: undefined,
                subProp2: undefined,
                subValue2: undefined,
                subProp3: undefined,
                subValue3: undefined,
                subProp4: undefined,
                subValue4: undefined
            }
        }
    },
    async created() {
        this.slots = RelicSlotType.All
        this.relicOptions = CoreEngine.relic.getRelicOptions()
        this.rankChange(this.relicInfo.rank)
    },
    methods: {
        onRelicChange() {
            this.relicData = CoreEngine.relic.sets.get(this.relicInfo.id)
            // this.relicInfo.mainProp = undefined
            // this.mainProps = RelicSlotType.getByIndex(this.relicInfo.slotIndex).mainPropTypes
        },
        rankChange(rank) {
            this.subProps = [];
            for (let i = 1; i < 5; i++) {
                this.relicInfo[`subProp${i}`] = undefined
                this.relicInfo[`subValue${i}`] = undefined
            }
            this.relicInfo.mainProp = undefined
            let rankData = CoreEngine.relic.ranks.get(rank);
            if (rankData) {
                this.subProps = rankData.getSubPropTypes()
            }
        },
        slotChange() {
            this.relicInfo.mainProp = undefined
            this.mainProps = RelicSlotType.getByIndex(this.relicInfo.slotIndex).mainPropTypes
        }
    }
}
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

::v-deep .relic-radio .el-radio__input {
    display: none;
}

::v-deep .relic-radio .is-checked .el-avatar {
    border: 1px solid #409eff;
}

</style>