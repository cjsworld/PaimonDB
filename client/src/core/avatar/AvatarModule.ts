import CoreEngine from '../CoreEngine';
import CoreEngineModule from '../CoreEngineModule';
import AvatarData from './AvatarData';

export default class AvatarModule implements CoreEngineModule {
    public avatars: Map<number, AvatarData> = new Map();

    async init() {
        let config = await CoreEngine.readJsonResource("AvatarExcelConfigData");
        for (let item of config) {
            if (item.useType != "AVATAR_FORMAL") {
                continue;
            }
            let avatar = new AvatarData(item);
            if (avatar.id == 10000005/*空*/ || avatar.id == 10000007/*莹*/) {
                //暂不支持旅行者
                continue;
            }
            this.avatars.set(avatar.id, avatar);
        }

        require("./impl/AvatarGanyu");
    }

    async onUserChange(uid: number) {

    }
    
    getAvatarOptions(): AvatarData[] {
        let list = new Array<AvatarData>();
        for (let it of this.avatars.values()) {
            list.push(it);
        }
        list.sort((a, b) => {
            if (a.elemType != b.elemType) {
                //元素类型正序
                return a.elemType.index - b.elemType.index;
            } else if (a.rank != b.rank) {
                //星级倒序
                return b.rank - a.rank;
            } else {
                //id正序
                return a.id - b.id;
            }
        })
        return list;
    }
    
    getConstellationOptions(): any[] {
        let ret = new Array<any>();
        for (let i = 0; i <= 6; i++) {
            ret.push({
                value: i,
                text: `Lv. ${i}️`
            })
        }
        return ret;
    }
}