import { SessionState, Session } from 'sip.js';
export declare class IncomingSessionStateHandler {
    private incomingSession;
    constructor(incomingSession: Session);
    stateChange: (newState: SessionState) => void;
}
