import CoreEngine from "@/core/CoreEngine";
import SkillOption from "@/core/foundation/SkillOption";
import AvatarData from "./AvatarData";

export default abstract class AvatarImpl {
    avatarId: number;
    avatarData: AvatarData;

    abstract getSkillOptions(): SkillOption[];

    protected constructor(avatarId: number) {
        this.avatarId = avatarId;
        this.avatarData = CoreEngine.avatar.avatars.get(avatarId)!;
        this.avatarData.impl = this;
    }
}