import * as React from 'react';
import { PhoneConfig } from '../models';
interface Props {
    sessions: any;
    incomingCalls: Array<string>;
    phoneConfig: PhoneConfig;
    attendedTransfers: Array<string>;
}
declare class PhoneSessions extends React.Component<Props> {
    render(): JSX.Element;
}
declare const PS: import("react-redux").ConnectedComponent<typeof PhoneSessions, Pick<React.ClassAttributes<PhoneSessions> & Props, "ref" | "phoneConfig" | "key">>;
export default PS;
