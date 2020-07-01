import * as React from 'react';
import { PhoneConfig } from '../models';
interface Props {
    phoneConfig: PhoneConfig;
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
declare const _default: import("react-redux").ConnectedComponent<typeof Status, Pick<React.ClassAttributes<Status> & Props, "phoneConfig" | "name" | "ref" | "key">>;
export default _default;
