export declare const SIPACCOUNT_CONNECTING = "SIPACCOUNT_CONNECTING";
export declare const SIPACCOUNT_CONNECTED = "SIPACCOUNT_CONNECTED";
export declare const SIPACCOUNT_DISCONNECTED = "SIPACCOUNT_DISCONNECTED";
export declare const SIPACCOUNT_REGISTERED = "SIPACCOUNT_REGISTERED";
export declare const SIPACCOUNT_UNREGISTERED = "SIPACCOUNT_UNREGISTERED";
export declare const SIPACCOUNT_REGISTRATION_FAILED = "SIPACCOUNT_REGISTRATION_FAILED";
export declare const SIPACCOUNT_MESSAGE = "SIPACCOUNT_MESSAGE";
export declare function onConnected(id: any): {
    type: string;
    payload: {
        id: any;
    };
};
export declare function onDisconnected(id: any): {
    type: string;
    payload: {
        id: any;
    };
};
export declare function onRegistered(id: any): {
    type: string;
    payload: {
        id: any;
    };
};
export declare function onUnregistered(id: any): {
    type: string;
    payload: {
        id: any;
    };
};
export declare function onRegistrationFailed(id: any): {
    type: string;
    payload: {
        id: any;
    };
};
export declare function onMessage(id: any): {
    type: string;
    payload: {
        id: any;
    };
};
export declare function onConnecting(id: any): {
    type: string;
    payload: {
        id: any;
    };
};
