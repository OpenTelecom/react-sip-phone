import { Action } from './models';
declare const sipSessions: (state: {
    sessions: {};
    incomingCalls: {};
    stateChanged: number;
    onHold: never[];
    attendedTransfers: never[];
} | undefined, action: Action) => {
    sessions: {};
    attendedTransfers: any[];
    incomingCalls: {};
    stateChanged: number;
    onHold: never[];
} | {
    sessions: any;
    incomingCalls: any;
    onHold: never[];
    stateChanged: number;
    attendedTransfers: never[];
} | {
    onHold: any[];
    sessions: {};
    incomingCalls: {};
    stateChanged: number;
    attendedTransfers: never[];
};
export default sipSessions;
