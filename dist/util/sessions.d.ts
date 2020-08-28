import { SessionState, Session, UserAgent } from 'sip.js';
export declare class SessionStateHandler {
    private session;
    private ua;
    constructor(session: Session, ua: UserAgent);
    stateChange: (newState: SessionState) => void;
}
export declare const getFullNumber: (number: string) => string;
export declare const statusMask: (status: string) => "Connected" | "Calling..." | "Initial" | "Ended" | "Unknown Status";
export declare const getDurationDisplay: (duration: number) => string;
