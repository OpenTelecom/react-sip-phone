import { Action } from './models';
declare const config: (state: {
    uri: string;
    password: string;
    phoneConfig: {};
    appConfig: {
        mode: string;
        started: boolean;
    };
} | undefined, action: Action) => {
    phoneConfig: any;
    uri: string;
    password: string;
    appConfig: {
        mode: string;
        started: boolean;
    };
} | {
    uri: any;
    password: any;
    phoneConfig: {};
    appConfig: {
        mode: string;
        started: boolean;
    };
} | {
    appConfig: any;
    uri: string;
    password: string;
    phoneConfig: {};
};
export default config;
