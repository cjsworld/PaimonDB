<template>
    <el-form ref="relicForm" :model="relicInfo" :rules="relicRules" label-width="60px" size="small" style="position: relative">
        <el-form-item label="套装">
            <el-select v-model="relicInfo.setId" @change="onRelicChange" filterable style="width: 200px" class="avatar-select">
                <el-option v-for="(item,_) in relicOptions" :key="item.id" :value="item.id"
                           :label="item.name" class="avatar-option">
                    <el-avatar :src="item.icon"></el-avatar>
                    <div>{{ item.name }}</div>
                </el-option>
                <template slot="prefix">
                    <el-avatar class="avatar-prefix" :src="relicInfo.setData ? relicInfo.setData.icon : ''" alt=""></el-avatar>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item label="星级">
            <el-radio-group v-model="relicInfo.rank" size="small" @change="rankChange">
                <el-radio-button :label="4">4星</el-radio-button>
                <el-radio-button :label="5">5星</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="等级">
            <el-input-number v-model="relicInfo.level" :min="1" :max="20" controls-position="right"
                             style="width: 100px"></el-input-number>
        </el-form-item>
        <el-form-item label="位置">
            <el-radio-group v-model="relicInfo.slotIndex" size="mini" class="relic-radio" @change="slotChange">
                <el-radio v-for="s in slots" :key="s.index" :label="s.index">
                    <el-image class="slot-img" :src="s.icon" alt=""></el-image>
                </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="主属性">
            <el-select v-model="relicInfo.mainPropTypeId" filterable style="width: 130px" :disabled="mainProps.length === 1">
                <el-option v-for="item in mainProps" :key="item.id" :value="item.id"
                           :label="item.name">
                </el-option>
            </el-select>
            <el-input v-model="relicInfo.getMainProp().displayValue" readonly
                      style="width: 60px;margin-left: 5px;text-align: center"></el-input>
            <span style="margin-left: 2px" v-if="relicInfo.mainPropType.isPercent">%</span>
        </el-form-item>
        <el-form-item :label="index === 1 ? `副属性` : ''" v-for="index in 4" :key="index">
            <el-select v-model="relicInfo[`subProp${index}`].typeId" filterable style="width: 130px">
                <el-option v-for="item in subProps" :key="item.id" :value="item.id"
                           :label="item.name">
                </el-option>
            </el-select>
            <el-input-number v-model="relicInfo[`subProp${index}`].displayValue"
                             :controls="false"
                             style="width: 60px;margin-left: 5px"></el-input-number>
            <span style="margin-left: 2px" v-if="relicInfo[`subProp${index}`].type.isPercent">%</span>
        </el-form-item>
        <el-image :src="relicInfo.icon" style="position: absolute;right: 15px;top: 60px;"></el-image>
    </el-form>
</template>

<script>
import CoreEngine from "@/core/CoreEngine";
import RelicSlotType from "@/core/relic/RelicSlotType";
import RelicInfo from "@/core/relic/RelicInfo";

export default {
    name: "RelicEditor",
    data() {
        return {
            relicData: undefined,
            relicOptions: [],
            slots: [],
            mainProps: [],
            subProps: [],
            relicRules: {},
        }
    },
    props: {
        slotIndex: {
            default: undefined,
            type: Number
        },
        relicInfo: {
            default: () => new RelicInfo(0, 0, 5),
            type: RelicInfo
        }
    },
    async created() {
        if (this.slotIndex !== undefined) {
            this.slots = [RelicSlotType.getByIndex(this.slotIndex)]
        } else {
            this.slots = RelicSlotType.All
        }
        this.relicOptions = CoreEngine.relic.getRelicOptions()
        if (!this.relicInfo.setId && this.relicOptions.length > 0) {
            this.relicInfo.setId = this.relicOptions[0].id;
        }
        this.rankChange(this.relicInfo.rank)
        this.slotChange(this.relicInfo.slotIndex)
    },
    methods: {
        onRelicChange() {
            this.relicData = CoreEngine.relic.sets.get(this.relicInfo.setId)
        },
        rankChange(rank) {
            this.subProps = [];
            let rankData = CoreEngine.relic.ranks.get(rank);
            if (rankData) {
                this.subProps = rankData.getSubPropTypes()
            }
        },
        slotChange(slotIndex) {
            this.mainProps = RelicSlotType.getByIndex(slotIndex).mainPropTypes
            if (!this.mainProps.find(e => e.id === this.relicInfo.mainPropTypeId)) {
                this.relicInfo.mainPropTypeId = RelicSlotType.getByIndex(slotIndex).mainPropTypes[0].id;
            }
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

::v-deep .relic-radio label {
    margin-right: 0px;
}

::v-deep .relic-radio .el-radio__input {
    display: none;
}

::v-deep .relic-radio .el-radio__label {
    padding-left: 5px;
}

.slot-img {
    width: 35px;
    height: 35px;
}

::v-deep .relic-radio .is-checked .el-image {
    border: 2px solid #409eff;
}

::v-deep .el-select .el-input__inner {
    background-color: unset;
    color: unset;
}

</style>