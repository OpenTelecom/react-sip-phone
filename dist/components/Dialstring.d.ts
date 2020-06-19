import * as React from 'react';
import SIPAccount from '../lib/SipAccount';
interface Props {
    sipAccount: SIPAccount;
}
declare class Dialstring extends React.Component<Props> {
    state: {
        currentDialString: string;
    };
    handleDial(): void;
    checkDialstring(): boolean;
    render(): JSX.Element;
}
declare const D: import("react-redux").ConnectedComponent<typeof Dialstring, Pick<React.ClassAttributes<Dialstring> & Props, "ref" | "key">>;
export default D;
