import * as React from 'react';
import { PhoneConfig, AppConfig } from '../models';
interface Props {
    phoneConfig: PhoneConfig;
    appConfig: AppConfig;
    name: string;
    inputs: any;
    outputs: any;
    primaryInput: string;
    primaryOutput: string;
    setPrimaryInput: Function;
    setPrimaryOutput: Function;
    getInputAudioDevices: Function;
    getOutputAudioDevices: Function;
    sessions: any;
    sinkIdAllowed: boolean;
}
declare class Status extends React.Component<Props> {
    state: {
        settingsMenu: boolean;
    };
    componentDidMount(): void;
    mapOptions(options: any): any;
    handleChangeDevice(type: string, id: string): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Status, Pick<React.ClassAttributes<Status> & Props, "phoneConfig" | "appConfig" | "name" | "ref" | "key">>;
export default _default;
