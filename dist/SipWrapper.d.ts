import * as React from 'react';
import { SipConfig, SipCredentials, PhoneConfig, AppConfig } from './models';
interface Props {
    sipCredentials: SipCredentials;
    sipConfig: SipConfig;
    phoneConfig: PhoneConfig;
    appConfig: AppConfig;
    setNewAccount: Function;
    setPhoneConfig: Function;
    setCredentials: Function;
    setAppConfig: Function;
    children: any;
}
declare class SipWrapper extends React.Component<Props> {
    componentDidMount(): void;
    initializeSip(): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof SipWrapper, Pick<React.ClassAttributes<SipWrapper> & Props, "sipCredentials" | "sipConfig" | "phoneConfig" | "appConfig" | "children" | "ref" | "key">>;
export default _default;
