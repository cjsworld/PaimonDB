<template>
    <div>
        <el-form :model="queryForm" size="small" inline>
            <el-form-item label="套装">
                <el-select v-model="queryForm.setId" @change="onQueryChange" filterable style="width: 200px" class="avatar-select">
                    <el-option v-for="(item,_) in relicOptions" :key="item.id" :value="item.id"
                               :label="item.name" class="avatar-option">
                        <el-avatar :src="item.icon"></el-avatar>
                        <div>{{ item.name }}</div>
                    </el-option>
                    <template slot="prefix">
                        <el-avatar class="avatar-prefix" src="" alt=""></el-avatar>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="位置">
                <el-radio-group v-model="queryForm.slotIndex" size="mini" class="relic-radio" @change="onQueryChange">
                    <el-radio v-for="s in slots" :key="s.index" :label="s.index">
                        <el-image class="slot-img" :src="s.icon" alt=""></el-image>
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-upload
                    action=""
                    :limit="1"
                    :show-file-list="false"
                    :http-request="handleUploadRelic">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <el-table :data="relicList">
            <el-table-column prop="id" label="ID" width="60" sortable></el-table-column>
            <el-table-column prop="relicSetData.name" label="套装" width="140" sortable></el-table-column>
            <el-table-column prop="slotData.type.name" label="套装" width="80" sortable></el-table-column>
            <el-table-column prop="rank" label="星级" width="80" sortable></el-table-column>
            <el-table-column prop="level" label="等级" width="80" sortable></el-table-column>
            <el-table-column prop="mainPropType.name" label="主属性" width="120" sortable></el-table-column>
            <el-table-column prop="mainProp.displayValue" label="主属性数值" width="120" sortable></el-table-column>
            <el-table-column prop="subProp1.type.name" label="副词条1" width="120" sortable></el-table-column>
            <el-table-column prop="subProp1.displayValue" label="副词条1数值" width="140" sortable></el-table-column>
            <el-table-column prop="subProp2.type.name" label="副词条2" width="120" sortable></el-table-column>
            <el-table-column prop="subProp2.displayValue" label="副词条2数值" width="140" sortable></el-table-column>
            <el-table-column prop="subProp3.type.name" label="副词条3" width="120" sortable></el-table-column>
            <el-table-column prop="subProp3.displayValue" label="副词条3数值" width="140" sortable></el-table-column>
            <el-table-column prop="subProp4.type.name" label="副词条4" width="120" sortable></el-table-column>
            <el-table-column prop="subProp4.displayValue" label="副词条4数值" width="140" sortable></el-table-column>
            <el-table-column prop="equippedAvatarName" label="已装备的角色" width="140" sortable></el-table-column>
        </el-table>
    </div>
</template>

<script>

import {Message} from "element-ui";
import CoreEngine from "@/core/CoreEngine";
import RelicSlotType from "@/core/relic/RelicSlotType";
import RelicImporter from "@/core/relic/RelicImporter";

export default {
    name: "RelicList",
    data() {
        return {
            relicOptions: [],
            slots: [],

            queryForm: {
                setId: undefined,
                slotIndex: undefined,
            },

            relicList: [],
        }
    },
    created() {
        this.relicOptions = CoreEngine.relic.getRelicOptions();
        this.slots = RelicSlotType.All;

        this.relicList = CoreEngine.relic.list;
    },
    methods: {
        onQueryChange() {
            this.relicList = CoreEngine.relic.list.filter(it => {
                if (this.queryForm.setId && this.queryForm.setId !== it.setId) {
                    return false;
                }
                if (this.queryForm.slotIndex >= 0 && this.queryForm.slotIndex !== it.slotIndex) {
                    return false;
                }
                return true;
            });
        },
        async handleUploadRelic(uploader) {
            let json = JSON.parse(await uploader.file.text());
            let importer = new RelicImporter(json);
            let list = importer.readAllRelic();
            list = list.map((it) => it.toServer())
            let res = await this.$api("relic/upload", {list: list});
            if (!(res instanceof Error)) {
                Message({
                    type: 'success',
                    message: `导入成功，新增圣遗物：${res}`
                });
            }
            uploader.clearFiles();
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