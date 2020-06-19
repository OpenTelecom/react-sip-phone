import { PhoneConfig } from '../models';
export declare const SET_CREDENTIALS = "SET_CREDENTIALS";
export declare const SET_CONFIG = "SET_CONFIG";
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
