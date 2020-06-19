import { Dispatch } from 'redux';
export declare const AUDIO_INPUT_DEVICES_DETECTED = "AUDIO_INPUT_DEVICES_DETECTED";
export declare const AUDIO_OUTPUT_DEVICES_DETECTED = "AUDIO_OUTPUT_DEVICES_DETECTED";
export declare const REMOTE_AUDIO_CONNECTED = "REMOTE_AUDIO_CONNECTED";
export declare const LOCAL_AUDIO_CONNECTED = "LOCAL_AUDIO_CONNECTED";
export declare const SET_PRIMARY_OUTPUT = "SET_PRIMARY_OUTPUT";
export declare const SET_PRIMARY_INPUT = "SET_PRIMARY_INPUT";
export declare const SET_LOCAL_AUDIO_SESSIONS_PENDING = "LOCAL_AUDIO_SESSIONS_PENDING";
export declare const SET_LOCAL_AUDIO_SESSIONS_SUCCESS = "LOCAL_AUDIO_SESSIONS_SUCCESS";
export declare const SET_LOCAL_AUDIO_SESSIONS_FAIL = "LOCAL_AUDIO_SESSIONS_FAIL";
export declare const SET_REMOTE_AUDIO_SESSIONS_PENDING = "SET_REMOTE_AUDIO_SESSIONS_PENDING";
export declare const SET_REMOTE_AUDIO_SESSIONS_SUCCESS = "SET_REMOTE_AUDIO_SESSIONS_SUCCESS";
export declare const SET_REMOTE_AUDIO_SESSIONS_FAIL = "SET_REMOTE_AUDIO_SESSIONS_FAIL";
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
export declare const setDeviceRemoteActiveSessions: () => (dispatch: Dispatch) => void;
export declare const setDeviceLocalActiveSessions: () => (dispatch: Dispatch) => void;
