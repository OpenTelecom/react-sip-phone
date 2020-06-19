declare class AccountManager {
    uas: any;
    constructor();
    addSIP: (id: any, uas: any) => void;
    getSIP: (id: any, uas: any) => any;
    delSIP: (id: any) => void;
}
declare const am: AccountManager;
export default am;
