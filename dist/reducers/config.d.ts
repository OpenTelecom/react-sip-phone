import { Action } from './models';
declare const config: (state: {
    uri: string;
    password: string;
    phoneConfig: {
        mode: string;
        started: boolean;
    };
} | undefined, action: Action) => {
    phoneConfig: any;
    uri: string;
    password: string;
} | {
    uri: any;
    password: any;
    phoneConfig: {
        mode: string;
        started: boolean;
    };
} | {
    appConfig: any;
    uri: string;
    password: string;
    phoneConfig: {
        mode: string;
        started: boolean;
    };
};
export default config;
