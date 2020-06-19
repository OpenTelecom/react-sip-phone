import * as React from 'react';
import { Session, UserAgent } from 'sip.js';
interface Props {
    session: Session;
    userAgent: UserAgent;
    holdCallRequest: Function;
    unHoldCallRequest: Function;
    onHold: Array<Object>;
    sessions: Array<Object>;
}
declare class Hold extends React.Component<Props> {
    hold(): void;
    checkHoldState(): boolean;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Hold, Pick<React.ClassAttributes<Hold> & Props, "session" | "ref" | "key">>;
export default _default;
