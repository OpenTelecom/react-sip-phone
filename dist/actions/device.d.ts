export declare const AUDIO_INPUT_DEVICES_DETECTED = "AUDIO_INPUT_DEVICES_DETECTED";
export declare const AUDIO_OUTPUT_DEVICES_DETECTED = "AUDIO_OUTPUT_DEVICES_DETECTED";
export declare const REMOTE_AUDIO_CONNECTED = "REMOTE_AUDIO_CONNECTED";
export declare const LOCAL_AUDIO_CONNECTED = "LOCAL_AUDIO_CONNECTED";
export declare const SET_PRIMARY_OUTPUT = "SET_PRIMARY_OUTPUT";
export declare const SET_PRIMARY_INPUT = "SET_PRIMARY_INPUT";
export declare const getInputAudioDevices: () => {
    type: string;
    payload: Object[];
};
export declare const getOutputAudioDevices: () => {
    type: string;
    payload: Object[];
};
export declare const setPrimaryOutput: (id: string) => {
    type: string;
    payload: string;
};
export declare const setPrimaryInput: (id: string) => {
    type: string;
    payload: string;
};
