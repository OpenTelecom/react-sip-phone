import { Session, SessionState } from 'sip.js';
import { Dispatch } from 'redux';
export declare const NEW_SESSION = "NEW_SESSION";
export declare const NEW_ATTENDED_TRANSFER = "NEW_ATTENDED_TRANSFER";
export declare const INCOMING_CALL = "INCOMING_CALL";
export declare const ACCEPT_CALL = "ACCEPT_CALL";
export declare const DECLINE_CALL = "DECLINE_CALL";
export declare const SIPSESSION_STATECHANGE = "SIPSESSION_STATECHANGE";
export declare const CLOSE_SESSION = "CLOSE_SESSION";
export declare const SIPSESSION_MAKECALL_REQUEST = "SIPSESSION_MAKECALL_REQUEST";
export declare const SIPSESSION_MAKECALL_SUCCESS = "SIPSESSION_MAKECALL_SUCCESS";
export declare const SIPSESSION_MAKECALL_FAIL = "SIPSESSION_MAKECALL_FAIL";
export declare const SIPSESSION_HOLD_REQUEST = "SIPSESSION_HOLD_REQUEST";
export declare const SIPSESSION_HOLD_SUCCESS = "SIPSESSION_HOLD_SUCCESS";
export declare const SIPSESSION_HOLD_FAIL = "SIPSESSION_HOLD_FAIL";
export declare const SIPSESSION_UNHOLD_REQUEST = "SIPSESSION_UNHOLD_REQUEST";
export declare const SIPSESSION_UNHOLD_SUCCESS = "SIPSESSION_UNHOLD_SUCCESS";
export declare const SIPSESSION_UNHOLD_FAIL = "SIPSESSION_UNHOLD_FAIL";
export declare const SIPSESSION_MUTE_REQUEST = "SIPSESSION_MUTE_REQUEST";
export declare const SIPSESSION_MUTE_SUCCESS = "SIPSESSION_MUTE_SUCCESS";
export declare const SIPSESSION_MUTE_FAIL = "SIPSESSION_MUTE_FAIL";
export declare const SIPSESSION_UNMUTE_REQUEST = "SIPSESSION_UNMUTE_REQUEST";
export declare const SIPSESSION_UNMUTE_SUCCESS = "SIPSESSION_UNMUTE_SUCCESS";
export declare const SIPSESSION_UNMUTE_FAIL = "SIPSESSION_UNMUTE_FAIL";
export declare const SIPSESSION_BLIND_TRANSFER_REQUEST = "SIPSESSION_BLIND_TRANSFER_REQUEST";
export declare const SIPSESSION_BLIND_TRANSFER_SUCCESS = "SIPSESSION_BLIND_TRANSFER_SUCCESS";
export declare const SIPSESSION_BLIND_TRANSFER_FAIL = "SIPSESSION_BLIND_TRANSFER_FAIL";
export declare const SIPSESSION_ATTENDED_TRANSFER_REQUEST = "SIPSESSION_ATTENDED_TRANSFER_REQUEST";
export declare const SIPSESSION_ATTENDED_TRANSFER_PENDING = "SIPSESSION_ATTENDED_TRANSFER_PENDING";
export declare const SIPSESSION_ATTENDED_TRANSFER_READY = "SIPSESSION_ATTENDED_TRANSFER_READY";
export declare const SIPSESSION_ATTENDED_TRANSFER_CANCEL = "SIPSESSION_ATTENDED_TRANSFER_CANCEL";
export declare const SIPSESSION_ATTENDED_TRANSFER_FAIL = "SIPSESSION_ATTENDED_TRANSFER_FAIL";
export declare const SIPSESSION_ATTENDED_TRANSFER_SUCCESS = "SIPSESSION_ATTENDED_TRANSFER_SUCCESS";
export declare const stateChange: (newState: SessionState, id: string) => (dispatch: Dispatch) => void;
export declare const closeSession: (id: string) => (dispatch: Dispatch) => void;
export declare const acceptCall: (session: Session) => {
    type: string;
    payload: Session;
};
export declare const declineCall: (session: Session) => {
    type: string;
    payload: Session;
};
export declare const endCall: (sessionId: string) => {
    type: string;
    payload: string;
};
export declare const holdCallRequest: (session: Session) => (dispatch: Dispatch) => {
    type: string;
} | undefined;
export declare const unHoldCallRequest: (session: Session, onHolds: Array<any>, sessions: Array<any>) => (dispatch: Dispatch) => void;
export declare const blindTransferRequest: () => (dispatch: Dispatch) => void;
export declare const blindTransferSuccess: () => (dispatch: Dispatch) => void;
export declare const blindTransferFail: () => (dispatch: Dispatch) => void;
export declare const attendedTransferRequest: () => (dispatch: Dispatch) => void;
export declare const attendedTransferCancel: (session: Session) => (dispatch: Dispatch) => void;
export declare const attendedTransferReady: () => (dispatch: Dispatch) => void;
export declare const attendedTransferPending: (session: Session) => (dispatch: Dispatch) => void;
export declare const attendedTransferSuccess: () => (dispatch: Dispatch) => void;
export declare const attendedTransferFail: () => (dispatch: Dispatch) => void;
export declare const muteRequest: () => (dispatch: Dispatch) => void;
export declare const muteSuccess: () => (dispatch: Dispatch) => void;
export declare const muteFail: () => (dispatch: Dispatch) => void;
export declare const unMuteRequest: () => (dispatch: Dispatch) => void;
export declare const unMuteSuccess: () => (dispatch: Dispatch) => void;
export declare const unMuteFail: () => (dispatch: Dispatch) => void;