export default interface CoreEngineModule {
    init(): Promise<void>;
    onUserChange(uid: number): Promise<void>;
}