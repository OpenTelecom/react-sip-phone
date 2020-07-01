import * as React from 'react';
import { Session, UserAgent } from 'sip.js';
import { PhoneConfig } from '../../models';
interface Props {
    session: Session;
    userAgent: UserAgent;
    endCall: Function;
    phoneConfig: PhoneConfig;
    deviceId: string;
}
declare class Phone extends React.Component<Props> {
    state: {
        dialpadOpen: boolean;
        transferMenu: boolean;
        ended: boolean;
        transferDialString: string;
        attendedTransferStarted: boolean;
        duration: number;
        counterStarted: boolean;
    };
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(newProps: Props): void;
    endCall(): void;
    attendedProcess(bool: boolean): void;
    handleCounter(): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Phone, Pick<React.ClassAttributes<Phone> & Props, "session" | "phoneConfig" | "ref" | "key">>;
export default _default;
