export declare const playDTMF: (key: any, deviceId: string) => void;
export declare const callDisconnect: (deviceId: string) => void;
declare class TonePlayer {
    private loop;
    ringtone: (deviceId: string) => void;
    ringback: (deviceId: string) => void;
    stop(): void;
}
export default TonePlayer;
