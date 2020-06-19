import SIPAccount from "../lib/SipAccount";
export declare const SIPACCOUNT_UNREGISTERED = "SIPACCOUNT_UNREGISTERED";
export declare const NEW_USERAGENT = "NEW_USERAGENT";
export declare const NEW_ACCOUNT = "NEW_ACCOUNT";
export declare const setNewAccount: (account: SIPAccount) => {
    type: string;
    payload: SIPAccount;
};
