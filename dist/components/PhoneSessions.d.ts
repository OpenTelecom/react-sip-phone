import * as React from 'react';
import { PhoneConfig } from '../models';
interface Props {
    sessions: Object;
    incomingCalls: Array<string>;
    phoneConfig: PhoneConfig;
    attendedTransfers: Array<string>;
}
declare class PhoneSessions extends React.Component<Props> {
    render(): JSX.Element;
}
declare const PS: import("react-redux").ConnectedComponent<typeof PhoneSessions, Pick<React.ClassAttributes<PhoneSessions> & Props, "phoneConfig" | "ref" | "key">>;
export default PS;
