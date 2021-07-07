import * as React from 'react';
import { Session, UserAgent } from 'sip.js';
import { PhoneConfig } from '../../models';
interface Props {
    session: Session;
    userAgent: UserAgent;
    endCall: Function;
    setAppConfigStarted: Function;
    phoneConfig: PhoneConfig;
    deviceId: string;
    strictMode: string;
    appSize: string;
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
declare const _default: import("react-redux").ConnectedComponent<typeof Phone, Pick<React.ClassAttributes<Phone> & Props, "phoneConfig" | "ref" | "key" | "session">>;
export default _default;
