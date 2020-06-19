import { Action } from './/models';
declare const config: (state: {
    uri: string;
    password: string;
    phoneConfig: {};
} | undefined, action: Action) => {
    phoneConfig: any;
    uri: string;
    password: string;
} | {
    uri: any;
    password: any;
    phoneConfig: {};
};
export default config;
