
/*
SetNamesGenshinArt = [
    "archaicPetra",  # 悠古的磐岩
    "blizzardStrayer",  # 冰风迷途的勇士
    "bloodstainedChivalry",  # 染血的骑士道
    "crimsonWitch",  # 炽烈的炎之魔女
    "gladiatorFinale",  # 角斗士的终幕礼
    "heartOfDepth",  # 沉沦之心
    "lavaWalker",  # 渡过烈火的贤人
    "maidenBeloved",  # 被怜爱的少女
    "noblesseOblige",  # 昔日宗室之仪
    "retracingBolide",  # 逆飞的流星
    "thunderSmoother",  # 平息鸣雷的尊者
    "thunderingFury",  # 如雷的盛怒
    "viridescentVenerer",  # 翠绿之影
    "wandererTroupe",  # 流浪大地的乐团
    "berserker",  # 战狂
    "braveHeart",  # 勇士之心
    "defenderWill",  # 守护之心
    "exile",  # 流放者
    "gambler",  # 赌徒
    "instructor",  # 教官
    "martialArtist",  # 武人
    "prayersForDestiny",  # 祭水之人
    "prayersForIllumination",  # 祭火之人
    "prayersForWisdom",  # 祭雷之人
    "prayersToSpringtime",  # 祭冰之人
    "resolutionOfSojourner",  # 行者之心
    "scholar",  # 学士
    "tinyMiracle",  # 奇迹
    "adventurer",  # 冒险家
    "luckyDog",  # 幸运儿
    "travelingDoctor",  # 游医
    "tenacityOfTheMillelith",  # 千岩牢固
    "paleFlame",  # 苍白之火
    "emblemOfSeveredFate",  # 绝缘之旗印
    "shimenawaReminiscence",  # 追忆之注连
    "huskOfOpulentDreams",      # 华馆梦醒形骸记
    "oceanHuedClam",       # 海染砗磲
    "EchoesOfAnOffering",  # 来歆余响
    "VermillionHereafter",  # 辰砂往生录
    "DeepwoodMemories",  # 深林的记忆
    "GildedDreams"  # 饰金之梦
]


TypeNamesGOOD = ['flower', 'plume', 'sands', 'goblet', 'circlet']

AttrNamesGOOD = {
    "FIGHT_PROP_CRITICAL": "critRate_",
    "FIGHT_PROP_CRITICAL_HURT": "critDMG_",
    "FIGHT_PROP_ATTACK": "atk",
    "FIGHT_PROP_ATTACK_PERCENT": "atk_",
    "FIGHT_PROP_ELEMENT_MASTERY": "eleMas",
    "FIGHT_PROP_CHARGE_EFFICIENCY": "enerRech_",
    "FIGHT_PROP_HP": "hp",
    "FIGHT_PROP_HP_PERCENT": "hp_",
    "FIGHT_PROP_DEFENSE": "def",
    "FIGHT_PROP_DEFENSE_PERCENT": "def_",
    "FIGHT_PROP_PHYSICAL_ADD_HURT": "physical_dmg_",
    "FIGHT_PROP_HEAL_ADD": "heal_",
    "FIGHT_PROP_ROCK_ADD_HURT": "geo_dmg_",
    "FIGHT_PROP_WIND_ADD_HURT": "anemo_dmg_",
    "FIGHT_PROP_ICE_ADD_HURT": "cryo_dmg_",
    "FIGHT_PROP_WATER_ADD_HURT": "hydro_dmg_",
    "FIGHT_PROP_FIRE_ADD_HURT": "pyro_dmg_",
    "FIGHT_PROP_ELEC_ADD_HURT": "electro_dmg_",
    "FIGHT_PROP_GRASS_ADD_HURT": "dendro_dmg_"
}

SetNamesGOOD = [
    'ArchaicPetra', 'BlizzardStrayer', 'BloodstainedChivalry',
    'CrimsonWitchOfFlames', 'GladiatorsFinale', 'HeartOfDepth',
    'Lavawalker', 'MaidenBeloved', 'NoblesseOblige',
    'RetracingBolide', 'Thundersoother', 'ThunderingFury',
    'ViridescentVenerer', 'WanderersTroupe', 'Berserker',
    'BraveHeart', 'DefendersWill', 'TheExile', 'Gambler',
    'Instructor', 'MartialArtist', 'PrayersForDestiny',
    'PrayersForIllumination', 'PrayersForWisdom', 'PrayersToSpringtime',
    'ResolutionOfSojourner', 'Scholar', 'TinyMiracle',
    'Adventurer', 'LuckyDog', 'TravelingDoctor',
    'TenacityOfTheMillelith', 'PaleFlame',
    'EmblemOfSeveredFate', 'ShimenawasReminiscence',
    'HuskOfOpulentDreams',
    'OceanHuedClam',
    "EchoesOfAnOffering",   # 来歆余响
    "VermillionHereafter"   # 辰砂往生录
    "DeepwoodMemories",     # 深林的记忆
    "GildedDreams"          # 饰金之梦
]

result = {
    "format": "GOOD",
    "version": 1,  # artifact only
    "source": "Amenoma",
    "artifacts": [],
}
for art_id in range(self.root['size']):
    art: Artifact = self.root[str(art_id)]
    res = {
            "setKey": ArtsInfo.SetNamesGOOD[art.setid],
            "slotKey": ArtsInfo.TypeNamesGOOD[art.type],
            "level": art.level,
            "rarity": art.rarity if 3 <= art.rarity <= 5 else 0,
            "mainStatKey": ArtsInfo.AttrNamesGOOD[art.stat.type.name],
            "location": art.equipped,
            "lock": art.locked,
            "substats": [
                {
                    "key": ArtsInfo.AttrNamesGOOD[substat.type.name],
                    "value": round(substat.value * 100, 1)
                    if ArtsInfo.AttrNamesGOOD[substat.type.name].endswith("_")
                    else substat.value,
                }
                for substat in art.substats
            ]
        }
    if not settings['exportLocation']:
        del res['location']
    result['artifacts'].append(res)
 */


export default class RelicImporter {

}