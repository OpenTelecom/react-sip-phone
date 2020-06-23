import { Dispatch } from 'redux';
export declare const AUDIO_INPUT_DEVICES_DETECTED = "AUDIO_INPUT_DEVICES_DETECTED";
export declare const AUDIO_OUTPUT_DEVICES_DETECTED = "AUDIO_OUTPUT_DEVICES_DETECTED";
export declare const AUDIO_NEW_INPUT_DEVICES_DETECTED = "AUDIO__NEW_INPUT_DEVICES_DETECTED";
export declare const AUDIO_NEW_OUTPUT_DEVICES_DETECTED = "AUDIO__NEW_OUTPUT_DEVICES_DETECTED";
export declare const AUDIO_DEVICES_SWAP = "AUDIO_DEVICES_SWAP";
export declare const REMOTE_AUDIO_CONNECTED = "REMOTE_AUDIO_CONNECTED";
export declare const LOCAL_AUDIO_CONNECTED = "LOCAL_AUDIO_CONNECTED";
export declare const SET_PRIMARY_OUTPUT = "SET_PRIMARY_OUTPUT";
export declare const SET_PRIMARY_INPUT = "SET_PRIMARY_INPUT";
export declare const SET_LOCAL_AUDIO_SESSIONS_PENDING = "SET_LOCAL_AUDIO_SESSIONS_PENDING";
export declare const SET_LOCAL_AUDIO_SESSION_SUCCESS = "SET_LOCAL_AUDIO_SESSION_SUCCESS";
export declare const SET_LOCAL_AUDIO_SESSION_FAIL = "SET_LOCAL_AUDIO_SESSION_FAIL";
export declare const SET_REMOTE_AUDIO_SESSIONS_PENDING = "SET_REMOTE_AUDIO_SESSIONS_PENDING";
export declare const SET_REMOTE_AUDIO_SESSION_SUCCESS = "SET_REMOTE_AUDIO_SESSION_SUCCESS";
export declare const SET_REMOTE_AUDIO_SESSION_FAIL = "SET_REMOTE_AUDIO_SESSION_FAIL";
export declare const audioSwap: (newArray: any) => {
    type: string;
    payload: any;
};
export declare const getInputAudioDevices: () => {
    type: string;
    payload: Object[];
};
export declare const getNewInputAudioDevices: () => {
    type: string;
    payload: Object[];
};
export declare const getOutputAudioDevices: () => {
    type: string;
    payload: Object[];
};
export declare const getNewOutputAudioDevices: () => {
    type: string;
    payload: Object[];
};
export declare const setPrimaryOutput: (deviceId: string, sessions: any) => (dispatch: Dispatch) => void;
export declare const setPrimaryInput: (deviceId: string, sessions: any) => (dispatch: Dispatch) => void;
