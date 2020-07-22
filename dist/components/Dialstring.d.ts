import * as React from 'react';
import SIPAccount from '../lib/SipAccount';
import { PhoneConfig, SipConfig } from '../models';
interface Props {
    sipAccount: SIPAccount;
    phoneConfig: PhoneConfig;
    sipConfig: SipConfig;
    sessions: Object;
}
declare class Dialstring extends React.Component<Props> {
    state: {
        currentDialString: string;
    };
    handleDial(): void;
    checkDialstring(): boolean;
    render(): JSX.Element;
}
declare const D: import("react-redux").ConnectedComponent<typeof Dialstring, Pick<React.ClassAttributes<Dialstring> & Props, "phoneConfig" | "sipConfig" | "ref" | "key">>;
export default D;
