export default interface CoreEngineModule {
    init(): Promise<void>;
}