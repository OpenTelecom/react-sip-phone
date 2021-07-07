import { Action } from './models';
declare const sipAccounts: (state: {
    sipAccount: null;
    userAgent: null;
    status: string;
} | undefined, action: Action) => {
    sipAccount: any;
    userAgent: null;
    status: string;
} | {
    userAgent: any;
    sipAccount: null;
    status: string;
};
export default sipAccounts;
