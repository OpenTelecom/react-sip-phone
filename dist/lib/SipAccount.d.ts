import { SipConfig, SipCredentials } from '../models';
export default class SIPAccount {
    _config: SipConfig;
    _credentials: SipCredentials;
    _userAgent: any;
    _registerer: any;
    constructor(sipConfig: SipConfig, sipCredentials: SipCredentials);
    setupDelegate(): void;
    setupRegistererListener(): void;
    makeCall(number: string): void;
    listener(): void;
}
