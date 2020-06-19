import { SessionState, Session } from 'sip.js';
export declare class SessionStateHandler {
    private session;
    constructor(session: Session);
    stateChange: (newState: SessionState) => void;
    holdAll(id: string): void;
}
export declare const getFullNumber: (number: string) => string;
export declare const statusMask: (status: string) => "Connected" | "Calling..." | "Initial" | "Ended" | "Unknown Status";
export declare const getDurationDisplay: (duration: number) => string;
