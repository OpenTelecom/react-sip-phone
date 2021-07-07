import * as React from 'react';
import { Session, UserAgent } from 'sip.js';
interface Props {
    session: Session;
    userAgent: UserAgent;
    muteRequest: Function;
    muteSuccess: Function;
    muteFail: Function;
    unMuteRequest: Function;
    unMuteSuccess: Function;
    unMuteFail: Function;
}
declare class Mute extends React.Component<Props> {
    state: {
        onMute: boolean;
    };
    mute(): Promise<unknown> | undefined;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Mute, Pick<React.ClassAttributes<Mute> & Props, "ref" | "key" | "session">>;
export default _default;
