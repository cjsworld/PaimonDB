<template>

    <el-popover
        placement="top-start"
        :title="relicInfo.slotData.name"
        trigger="hover">
        <div>{{ relicInfo.slotData.type.name }}</div>
        <div>{{ relicInfo.getMainProp().toString() }}</div>
        <div><i class="el-icon-star-on" v-for="o in relicInfo.rank" :key="o"/></div>
        <div>+{{ relicInfo.level }}</div>
        <div v-show="relicInfo.subProp1.type.isValid">{{ relicInfo.subProp1.toString() }}</div>
        <div v-show="relicInfo.subProp2.type.isValid">{{ relicInfo.subProp2.toString() }}</div>
        <div v-show="relicInfo.subProp3.type.isValid">{{ relicInfo.subProp3.toString() }}</div>
        <div v-show="relicInfo.subProp4.type.isValid">{{ relicInfo.subProp4.toString() }}</div>
        <div slot="reference" :style="`position: relative; width: ${size}px; height: ${size}px`">
            <el-avatar slot="reference"
                       :size="size"
                       shape="square"
                       :src="relicInfo.icon"></el-avatar>
            <el-avatar v-if="avatar" shape="square" :src="avatar.icon" style="position: absolute;right: 0;top: 0" :size="size / 3"></el-avatar>
            <span v-if="relicInfo.id" :style="`position: absolute;left: 0;bottom: 0; font-size: ${size / 6}px`">{{ relicInfo.id }}</span>
        </div>

    </el-popover>

</template>

<script>
import CoreEngine from "@/core/CoreEngine";
import RelicInfo from "@/core/relic/RelicInfo";

export default {
    name: "RelicView",
    data() {
        return {
            avatar: undefined,
        }
    },
    props: {
        size: {
            default: 60,
            type: Number
        },
        relicInfo: {
            default: () => new RelicInfo(0, 0, 5),
            type: RelicInfo
        }
    },
    created() {
        if (this.relicInfo.equippedAvatar) {
            this.avatar = CoreEngine.avatar.avatars.get(this.relicInfo.equippedAvatar);
        }
    },
    methods: {
    }
}
</script>

<style scoped>


</style>