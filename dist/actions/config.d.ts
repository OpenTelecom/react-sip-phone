import { PhoneConfig, AppConfig } from '../models';
export declare const SET_CREDENTIALS = "SET_CREDENTIALS";
export declare const SET_PHONE_CONFIG = "SET_PHONE_CONFIG";
export declare const SET_APP_CONFIG = "SET_APP_CONFIG";
export declare const STRICT_MODE_SHOW_CALL_BUTTON = "STRICT_MODE_SHOW_CALL_BUTTON";
export declare const STRICT_MODE_HIDE_CALL_BUTTON = "STRICT_MODE_HIDE_CALL_BUTTON";
export declare const ATTENDED_TRANSFER_LIMIT_REACHED = "ATTENDED_TRANSFER_LIMIT_REACHED";
export declare const SESSIONS_LIMIT_REACHED = "SESSIONS_LIMIT_REACHED";
export declare const setCredentials: (uri?: string, password?: string) => {
    type: string;
    payload: {
        uri: string;
        password: string;
    };
};
export declare const setPhoneConfig: (config: PhoneConfig) => {
    type: string;
    payload: PhoneConfig;
};
export declare const setAppConfig: (config: AppConfig) => {
    type: string;
    payload: AppConfig;
};
export declare const setAppConfigStarted: () => {
    type: string;
};
export declare const setAppConfigCallEnded: () => {
    type: string;
};
export declare const attendedTransferLimitReached: () => {
    type: string;
};
export declare const sessionsLimitReached: () => {
    type: string;
};
