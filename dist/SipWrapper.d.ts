import * as React from 'react';
import { SipConfig, SipCredentials, PhoneConfig } from './models';
interface Props {
    sipCredentials: SipCredentials;
    sipConfig: SipConfig;
    phoneConfig: PhoneConfig;
    setNewAccount: Function;
    setPhoneConfig: Function;
    setCredentials: Function;
    children: any;
}
declare class SipWrapper extends React.Component<Props> {
    componentDidMount(): void;
    initializeSip(): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof SipWrapper, Pick<React.ClassAttributes<SipWrapper> & Props, "sipCredentials" | "sipConfig" | "phoneConfig" | "children" | "ref" | "key">>;
export default _default;
