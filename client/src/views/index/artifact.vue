<template>
    <div>
        <el-form :model="artifactInfo" size="small">
            <el-form-item label="圣遗物套装过滤：">
                <el-select v-model="artifactInfo.id" @change="onArtifactChange" filterable style="width: 200px" class="avatar-select">
                    <el-option v-for="item in artifactOptions" :key="item.id" :value="item.id"
                               :label="item.name" class="avatar-option">
                        <el-avatar :src="item.icon"></el-avatar>
                        <div :class="`elem-${item.elemType.id.toLowerCase()}`">{{ item.name }}</div>
                        <span style="float: right">{{ `${item.rank}★` }}</span>
                    </el-option>
                    <template slot="prefix">
                        <el-avatar class="avatar-prefix" :src="artifactInfo.data ? artifactInfo.data.icon : ''" alt=""></el-avatar>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="圣遗物部位过滤：">
                <el-checkbox v-model="checked">主属性</el-checkbox>
            </el-form-item>
            <el-form-item label="圣遗物排序：">
                <el-radio-group>
                    <el-radio>默认</el-radio>
                    <el-radio>按套装</el-radio>
                    <el-radio>按副属性</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button><i class="el-icon-plus el-icon--left"></i>录入新圣遗物</el-button>
                <el-button><i class="el-icon-plus el-icon--left"></i>图像识别录入圣遗物</el-button>
                <el-button><i class="el-icon-close el-icon--left"></i>批量删除模式(多选)</el-button>
                <el-upload
                    action=""
                    :limit="1"
                    :show-file-list="false"
                    :http-request="handleUploadRelic">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <el-row :gutter="12">
            <el-col :span="10">
                <el-card class="artifact-list">
                    <el-popover
                        v-for="o in 4"
                        :key="o"
                        placement="top-start"
                        title="标题"
                        width="200"
                        trigger="hover">
                        <div>xxxx</div>
                        <div>xxxx</div>
                        <div>xxxx</div>
                        <div>xxxx</div>
                        <div>xxxx</div>
                        <el-avatar slot="reference"
                                   :size="80"
                                   shape="square"
                                   src="https://genshin.mingyulab.com/static/media/tenacity_of_the_millelith_flower.ccf0a01e.png"></el-avatar>
                    </el-popover>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import RelicImporter from "@/core/relic/RelicImporter";
import {Message} from "element-ui";

export default {
    data() {
        return {
            uploadFiles: [],
            artifactInfo: {},
            artifactOptions: [],
            checked: false,
            r: 5
        }
    },
    created() {

    },
    methods: {
        onArtifactChange() {

        },
        async handleUploadRelic(uploader) {
            let json = JSON.parse(await uploader.file.text());
            uploader.clearFiles();
            let importer = new RelicImporter(json);
            let list = importer.readAllRelic();
            list = list.map((it) => it.toServer())
            let res = await this.$api("relic/upload", {list: list});
            if (res instanceof Error) return;
            Message({
                type: 'success',
                message: `导入成功，新增圣遗物：${res}`
            });
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

::v-deep .artifact-list .el-avatar {
    margin: 3px;
    cursor: pointer;
}

::v-deep .artifact-card .el-card__header {
    padding-top: 8px;
    padding-bottom: 8px;
}
</style>