import RelicInfo from "@/core/relic/RelicInfo";
import RelicSlotType from "@/core/relic/RelicSlotType";
import PropType from "@/core/foundation/PropType";

export default class RelicImporter {

    private data: any;
    private slotMap = {
        'flower': RelicSlotType.Flower,
        'plume': RelicSlotType.Leather,
        'sands': RelicSlotType.Sand,
        'goblet': RelicSlotType.Cup,
        'circlet': RelicSlotType.Cap
    }
    private propMap = {
        "critRate_": PropType.CritRate,
        "critDMG_": PropType.CritHurt,
        "atk": PropType.ATK,
        "atk_": PropType.PercentATK,
        "eleMas": PropType.ElemMastery,
        "enerRech_": PropType.ChargeRate,
        "hp": PropType.HP,
        "hp_": PropType.PercentHP,
        "def": PropType.DEF,
        "def_": PropType.PercentDEF,
        "physical_dmg_": PropType.PhysicalAddHurt,
        "heal_": PropType.HealAdd,
        "geo_dmg_": PropType.RockAddHurt,
        "anemo_dmg_": PropType.WindAddHurt,
        "cryo_dmg_": PropType.IceAddHurt,
        "hydro_dmg_": PropType.WaterAddHurt,
        "pyro_dmg_": PropType.IceAddHurt,
        "electro_dmg_": PropType.FireAddHurt,
        "dendro_dmg_": PropType.GrassAddHurt
    }
    private setMap = {
        'ArchaicPetra': 15014, //悠古的磐岩
        'BlizzardStrayer': 14001, //冰风迷途的勇士
        'BloodstainedChivalry': 15008, //染血的骑士道
        'CrimsonWitchOfFlames': 15006, //炽烈的炎之魔女
        'GladiatorsFinale': 15001, //角斗士的终幕礼
        'HeartOfDepth': 15016, //沉沦之心
        'Lavawalker': 14003, //渡过烈火的贤人
        'MaidenBeloved': 14004, //被怜爱的少女
        'NoblesseOblige': 15007, //昔日宗室之仪
        'RetracingBolide': 15015, //逆飞的流星
        'Thundersoother': 14002, //平息鸣雷的尊者
        'ThunderingFury': 15005, //如雷的盛怒
        'ViridescentVenerer': 15002, //翠绿之影
        'WanderersTroupe': 15003, //流浪大地的乐团
        'Berserker': 10005, //战狂
        'BraveHeart': 10002, //勇士之心
        'DefendersWill': 10003, //守护之心
        'TheExile': 10009, //流放者
        'Gambler': 10008, //赌徒
        'Instructor': 10007, //教官
        'MartialArtist': 10006, //武人
        'PrayersForDestiny': 15010, //祭水之人
        'PrayersForIllumination': 15009, //祭火之人
        'PrayersForWisdom': 15011, //祭雷之人
        'PrayersToSpringtime': 15013, //祭冰之人
        'ResolutionOfSojourner': 10001, //行者之心
        'Scholar': 10012, //学士
        'TinyMiracle': 10004, //奇迹
        'Adventurer': 0, //冒险家
        'LuckyDog': 0, //幸运儿
        'TravelingDoctor': 0, //游医
        'TenacityOfTheMillelith': 15017, //千岩牢固
        'PaleFlame': 15018,//苍白之火
        'EmblemOfSeveredFate': 15020, //绝缘之旗印
        'ShimenawasReminiscence': 15019, //追忆之注连
        'HuskOfOpulentDreams': 15021, //华馆梦醒形骸记
        'OceanHuedClam': 15022, //海染砗磲
        "EchoesOfAnOffering": 15024, //来歆余响
        "VermillionHereafter": 15023, //辰砂往生录
        "DeepwoodMemories": 15025, //深林的记忆
        "GildedDreams": 15026, //饰金之梦
    }
    private avatarMap = {
        "Aether": 0, //空
        "Albedo": 10000038, //阿贝多
        "Aloy": 10000062, //埃洛伊
        "Amber": 10000021, //安柏
        "AratakiItto": 10000057, //荒泷一斗
        "Barbara": 10000014, //芭芭拉
        "Beidou": 10000024, //北斗
        "Bennett": 10000032, //班尼特
        "Chongyun": 10000036, //重云
        "Collei": 10000067, //柯莱
        "Diluc": 10000016, //迪卢克
        "Diona": 10000039, //迪奥娜
        "Dori": 10000068, //多莉
        "Eula": 10000051, //优菈
        "Fischl": 10000031, //菲谢尔
        "Ganyu": 10000037, //甘雨
        "Gorou": 10000055, //五郎
        "HuTao": 10000046, //胡桃
        "Jean": 10000003, //琴
        "KaedeharaKazuha": 10000047, //枫原万叶
        "Kaeya": 10000015, //凯亚
        "KamisatoAyaka": 10000002, //神里绫华
        "KamisatoAyato": 10000066, //神里绫人
        "Keqing": 10000042, //刻晴
        "Klee": 10000029, //可莉
        "KujouSara": 10000056, //九条裟罗
        "KukiShinobu": 10000065, //久岐忍
        "Lisa": 10000006, //丽莎
        "Lumine": 0, //荧
        "Mona": 10000041, //莫娜
        "Ningguang": 10000027, //凝光
        "Noelle": 10000034, //诺艾尔
        "Qiqi": 10000035, //七七
        "RaidenShogun": 10000052, //雷电将军
        "Razor": 10000020, //雷泽
        "Rosaria": 10000045, //罗莎莉亚
        "SangonomiyaKokomi": 10000054, //珊瑚宫心海
        "Sayu": 10000053, //早柚
        "Shenhe": 10000063, //申鹤
        "ShikanoinHeizou": 10000059, //鹿野院平藏
        "Sucrose": 10000043, //砂糖
        "Tartaglia": 10000033, //达达利亚
        "Thoma": 10000050, //托马
        "Tighnari": 10000069, //提纳里
        "Venti": 10000022, //温迪
        "Xiangling": 10000023, //香菱
        "Xiao": 10000026, //魈
        "Xingqiu": 10000025, //行秋
        "Xinyan": 10000044, //辛焱
        "YaeMiko": 10000058, //八重神子
        "Yanfei": 10000048, //烟绯
        "Yelan": 10000060, //夜兰
        "Yoimiya": 10000049, //宵宫
        "YunJin": 10000064, //云堇
        "Zhongli": 10000030, //钟离
    }

    constructor(data: any) {
        this.data = data;
    }

    private check(): boolean {
        return this.data.format === "GOOD" && this.data.version === 1;
    }

    readAllRelic(): RelicInfo[] {
        if (!this.check()) {
            return [];
        }

        let list = new Array<RelicInfo>();
        for (let it of this.data.artifacts) {
            let setId = this.setMap[it.setKey];
            let slot = this.slotMap[it.slotKey];
            let mainProp = this.propMap[it.mainStatKey];
            if (!setId || !slot || !mainProp) {
                throw new Error("Invalid format: " + JSON.stringify(it));
            }
            let relic = new RelicInfo(setId, slot.index, it.rarity);
            relic.mainPropTypeId = mainProp.id;

            for (let i = 1; i <= it.substats.length; i++) {
                let sub = it.substats[i - 1];
                let type = this.propMap[sub.key];
                if (!type) {
                    throw new Error("Invalid format: " + JSON.stringify(it));
                }
                let prop = relic[`subProp${i}`];
                prop.typeId = type.id;
                prop.value = sub.value;
            }
            let avatar = this.avatarMap[it.location];
            if (avatar) {
                relic.equippedAvatar = avatar;
            }

            list.push(relic);
        }
        return list;
    }
}