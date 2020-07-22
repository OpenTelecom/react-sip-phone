import { PhoneConfig, AppConfig } from '../models';
export declare const SET_CREDENTIALS = "SET_CREDENTIALS";
export declare const SET_PHONE_CONFIG = "SET_PHONE_CONFIG";
export declare const SET_APP_CONFIG = "SET_APP_CONFIG";
export declare const STRICT_MODE_CALL_STARTED = "STRICT_MODE_CALL_STARTED";
export declare const STRICT_MODE_CALL_ENDED = "STRICT_MODE_CALL_ENDED";
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
