import * as React from 'react';
import { Invitation } from 'sip.js';
interface Props {
    session: Invitation;
    autoanswer: boolean;
    acceptCall: Function;
    declineCall: Function;
}
declare class Incoming extends React.Component<Props> {
    private timer;
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleAccept(): void;
    handleAutoAnswer(): void;
    handleDecline(): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Incoming, Pick<React.ClassAttributes<Incoming> & Props, "session" | "autoanswer" | "ref" | "key">>;
export default _default;
