import PropPanel from "@/core/foundation/PropPanel";

export default class MonsterInfo {
    level: number;
    props: PropPanel;

    constructor() {
        this.level = 90;
        this.props = new PropPanel();
    }
}