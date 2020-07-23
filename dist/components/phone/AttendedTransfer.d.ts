import * as React from 'react';
import { PhoneConfig } from '../../models';
import { Session, UserAgent } from 'sip.js';
import SIPAccount from '../../lib/SipAccount';
interface Props {
    session: Session;
    sipAccount: SIPAccount;
    userAgent: UserAgent;
    destination: string;
    started: Function;
    attendedTransferRequest: Function;
    attendedTransferCancel: Function;
    attendedTransferReady: Function;
    attendedTransferPending: Function;
    attendedTransferSuccess: Function;
    attendedTransferFail: Function;
    attendedTransferLimitReached: Function;
    holdCallRequest: Function;
    stateChange: Function;
    closeSession: Function;
    attendedTransfersList: Array<string>;
    phoneConfig: PhoneConfig;
}
declare class AttendedTransfer extends React.Component<Props> {
    state: {
        attendedTransferSessionPending: null;
        attendedTransferSessionReady: null;
    };
    attendedTransferCall(): void;
    attendedTransferClear(): void;
    connectAttendedTransfer(attendedTransferSession: any): void;
    cancelAttendedTransfer(attendedTransferSession: any): void;
    holdAll(): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof AttendedTransfer, Pick<React.ClassAttributes<AttendedTransfer> & Props, "session" | "destination" | "started" | "ref" | "key">>;
export default _default;
