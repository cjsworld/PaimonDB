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
                <el-button><i class="el-icon-download el-icon--left"></i>导出</el-button>
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
            <el-col :span="5">
                <el-card class="artifact-card">
                    <div slot="header" class="clearfix">
                        <el-avatar src="https://genshin.mingyulab.com/static/media/xinyan.94fd5d7c.png" style="vertical-align: middle"></el-avatar>
                        <label style="vertical-align: middle;margin-left: 10px;">雷鸟的怜悯</label>
                        <el-button icon="el-icon-refresh" circle style="float: right;"></el-button>
                    </div>
                    <el-form>
                        <el-form-item>
                            <label>生之花</label>
                        </el-form-item>
                        <el-form-item>
                            <el-card shadow="hover">
                                <el-select style="width: 160px;">
                                    <el-option>生命值</el-option>
                                </el-select>
                                <el-divider direction="vertical"></el-divider>
                                <span>4567</span>
                            </el-card>
                        </el-form-item>
                        <el-form-item>
                            <el-rate
                                v-model="r"
                                disabled
                                show-score
                                text-color="#ff9900"
                                score-template="{value}">
                            </el-rate>
                        </el-form-item>
                        <el-card shadow="hover">
                            <el-form-item>
                                <el-select style="width: 160px;">
                                    <el-option>生命值</el-option>
                                </el-select>
                                <el-divider direction="vertical"></el-divider>
                                <el-input-number :min="0" :max="100" controls-position="right" style="width: 100px"></el-input-number>
                            </el-form-item>
                            <el-form-item>
                                <el-select style="width: 160px;">
                                    <el-option>生命值</el-option>
                                </el-select>
                                <el-divider direction="vertical"></el-divider>
                                <el-input-number :min="0" :max="100" controls-position="right" style="width: 100px" :controls="false"></el-input-number>
                            </el-form-item>
                            <el-form-item>
                                <el-select style="width: 160px;">
                                    <el-option>生命值</el-option>
                                </el-select>
                                <el-divider direction="vertical"></el-divider>
                                <el-input-number :min="0" :max="100" controls-position="right" style="width: 100px"></el-input-number>
                            </el-form-item>
                            <el-form-item>
                                <el-select style="width: 160px;">
                                    <el-option>生命值</el-option>
                                </el-select>
                                <el-divider direction="vertical"></el-divider>
                                <el-input-number :min="0" :max="100" controls-position="right" style="width: 100px"></el-input-number>
                            </el-form-item>
                            <el-form-item label="标记：">
                                <el-radio-group>
                                    <el-radio>无</el-radio>
                                    <el-radio>★</el-radio>
                                    <el-radio>●</el-radio>
                                    <el-radio>■</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item>
                                <el-button><i class="el-icon-check el-icon--left"></i>删除</el-button>
                                <el-button><i class="el-icon-close el-icon--left"></i>保存</el-button>
                            </el-form-item>
                        </el-card>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
    data() {
        return {
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