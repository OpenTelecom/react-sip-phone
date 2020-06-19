declare class ToneManager {
    currentTone: any;
    constructor();
    playRing(type: string): void;
    stopAll(): void;
}
declare const toneManager: ToneManager;
export default toneManager;
