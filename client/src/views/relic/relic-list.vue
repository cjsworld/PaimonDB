<template>
    <div v-resize="changeTableMaxHeight">
        <el-form id="fix-div" :model="queryForm" size="small" inline>
            <el-form-item label="套装">
                <el-select v-model="queryForm.setIdList" @change="onQueryChange" filterable multiple clearable style="width: 250px">
                    <el-option v-for="item in relicOptions" :key="item.id" :value="item.id"
                               :label="item.name" class="avatar-option">
                        <el-avatar :src="item.icon"></el-avatar>
                        <div>{{ item.name }}</div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="位置">
                <el-checkbox-group v-model="queryForm.slotIndexList" @change="onQueryChange">
                    <el-checkbox v-for="item in slots" :key="item.index" :label="item.index">{{item.shortName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="showAddDialog">添加</el-button>
            </el-form-item>
            <el-form-item>
                <el-upload
                    style="display: inline"
                    action=""
                    :limit="1"
                    :show-file-list="false"
                    :http-request="handleUploadRelic">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <u-table ref="table" :data="relicList" :height="tableHeight" :row-height="60" use-virtual>
            <u-table-column prop="id" label="ID" width="60" sortable></u-table-column>
            <u-table-column prop="relicSetData.name" label="套装" width="165" sortable>
                <template v-slot="scope">
                    <el-avatar :size="40" shape="square" :src="scope.row.icon" style="vertical-align: middle; margin-right: 3px"></el-avatar>
                    <span>{{scope.row.relicSetData.name}}</span>
                </template>
            </u-table-column>
            <u-table-column prop="slotData.type.name" label="位置" width="75" sortable></u-table-column>
            <u-table-column prop="rank" label="星级" width="75" sortable></u-table-column>
            <u-table-column prop="level" label="等级" width="75" sortable></u-table-column>
            <u-table-column prop="mainPropType.name" label="主属性" width="120" sortable></u-table-column>
            <u-table-column prop="mainProp.displayValue" label="数值" width="80" sortable>
                <template v-slot="scope">
                    {{scope.row.mainProp.displayValue}}{{scope.row.mainPropType.isPercent ? "%" : ""}}
                </template>
            </u-table-column>
            <u-table-column prop="subProp1.type.name" label="副词条1" width="100" sortable></u-table-column>
            <u-table-column prop="subProp1.displayValue" label="数值" width="75" sortable>
                <template v-slot="scope">
                    {{scope.row.subProp1.displayValue}}{{scope.row.subProp1.type.isPercent ? "%" : ""}}
                </template>
            </u-table-column>
            <u-table-column prop="subProp2.type.name" label="副词条2" width="100" sortable></u-table-column>
            <u-table-column prop="subProp2.displayValue" label="数值" width="75" sortable>
                <template v-slot="scope">
                    {{scope.row.subProp2.displayValue}}{{scope.row.subProp2.type.isPercent ? "%" : ""}}
                </template>
            </u-table-column>
            <u-table-column prop="subProp3.type.name" label="副词条3" width="100" sortable></u-table-column>
            <u-table-column prop="subProp3.displayValue" label="数值" width="75" sortable>
                <template v-slot="scope">
                    {{scope.row.subProp3.displayValue}}{{scope.row.subProp3.type.isPercent ? "%" : ""}}
                </template>
            </u-table-column>
            <u-table-column prop="subProp4.type.name" label="副词条4" width="100" sortable></u-table-column>
            <u-table-column prop="subProp4.displayValue" label="数值" width="75" sortable>
                <template v-slot="scope">
                    {{scope.row.subProp4.displayValue}}{{scope.row.subProp4.type.isPercent ? "%" : ""}}
                </template>
            </u-table-column>
            <u-table-column prop="equippedAvatarName" label="已装备" width="100" sortable></u-table-column>
            <u-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRelic(scope.row)">删除</el-button>
                </template>
            </u-table-column>
        </u-table>

        <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" width="350px" :close-on-click-modal="false"
                   @close="closeEditDialog">
            <relic-editor ref="relicEditor" :relic-info="editDialog.relicInfo"></relic-editor>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="addOrEditRelic">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import {Message} from "element-ui";
import {UTable, UTableColumn} from "umy-ui";
import RelicEditor from "@/components/relic-editor";
import CoreEngine from "@/core/CoreEngine";
import RelicSlotType from "@/core/relic/RelicSlotType";
import RelicImporter from "@/core/relic/RelicImporter";
import RelicInfo from "@/core/relic/RelicInfo";

export default {
    name: "RelicList",
    components: {
        UTable,
        UTableColumn,
        RelicEditor
    },
    data() {
        return {
            tableHeight: 0,

            relicOptions: [],
            slots: [],
            avatarOptions: [],

            queryForm: {
                setIdList: [],
                slotIndexList: [],
            },

            relicList: [],

            editDialog: {
                title: "",
                visible: false,
                relicInfo: new RelicInfo(undefined)
            }
        }
    },
    created() {
        this.relicOptions = CoreEngine.relic.getRelicOptions();
        this.avatarOptions = CoreEngine.avatar.getAvatarOptions();
        this.slots = RelicSlotType.All;
        this.getList();
    },
    mounted() {
        this.$nextTick(() => {
            this.changeTableMaxHeight()
        })
    },
    methods: {
        changeTableMaxHeight() {
            let fixHeight = document.getElementById("fix-div").offsetHeight;
            let tmp = document.body.offsetHeight - fixHeight - (45 + 15 * 2 + 10 + 18);
            tmp = tmp < 500 ? 500 : tmp;
            this.tableHeight = tmp;
        },
        getList() {
            this.relicList = CoreEngine.relic.list;
            this.onQueryChange();
        },
        onQueryChange() {
            this.relicList = CoreEngine.relic.list.filter(it => {
                if (this.queryForm.setIdList.length > 0 && this.queryForm.setIdList.indexOf(it.setId) === -1) {
                    return false;
                }
                if (this.queryForm.slotIndexList.length > 0 && this.queryForm.slotIndexList.indexOf(it.slotIndex) === -1) {
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
            await CoreEngine.relic.refreshRelicList();
            this.getList();
            uploader.clearFiles();
        },
        showAddDialog() {
            this.editDialog.title = "新增圣遗物信息"
            this.editDialog.visible = true;
            this.$nextTick(() => {
                this.editDialog.relicInfo = new RelicInfo(undefined);
            });
        },
        showEditDialog(row) {
            this.editDialog.title = "编辑圣遗物信息"
            this.editDialog.visible = true;
            this.$nextTick(() => {
                this.editDialog.relicInfo = row.copy();
            });
        },
        closeEditDialog() {
            this.editDialog.visible = false;
        },
        addOrEditRelic() {
            this.$refs.relicEditor.$refs.relicForm.validate(async valid => {
                if (valid) {
                    let res = await this.$api("relic/addOrEdit", {relic: this.editDialog.relicInfo.toServer()})
                    if (res instanceof Error) return
                    this.closeEditDialog();
                    this.$message.success("操作成功");
                    await CoreEngine.relic.refreshRelicList();
                    this.getList();
                }
            })
        },
        async deleteRelic(row) {
            let res = await this.$api("relic/delete", {id: row.id})
            if (res instanceof Error) return
            this.$message.success("删除成功");
            await CoreEngine.relic.refreshRelicList();
            this.getList();
        }
    }
}

</script>

<style scoped>

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

.el-checkbox {
    margin-right: 10px
}

</style>