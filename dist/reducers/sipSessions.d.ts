import { Action } from './models';
declare const sipSessions: (state: {
    sessions: {};
    incomingCalls: never[];
    stateChanged: number;
    onHold: never[];
    attendedTransfers: never[];
} | undefined, action: Action) => {
    sessions: {};
    incomingCalls: any[];
    stateChanged: number;
    onHold: never[];
    attendedTransfers: never[];
} | {
    sessions: {};
    attendedTransfers: any[];
    incomingCalls: never[];
    stateChanged: number;
    onHold: never[];
} | {
    incomingCalls: never[];
    sessions: any;
    stateChanged: number;
    onHold: never[];
    attendedTransfers: never[];
} | {
    onHold: any[];
    sessions: {};
    incomingCalls: never[];
    stateChanged: number;
    attendedTransfers: never[];
};
export default sipSessions;
