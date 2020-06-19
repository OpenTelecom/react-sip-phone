import * as React from 'react';
interface Props {
    name: string;
    inputs: any;
    outputs: any;
    primaryInput: string;
    primaryOutput: string;
    setPrimaryInput: Function;
    setPrimaryOutput: Function;
    getInputAudioDevices: Function;
    getOutputAudioDevices: Function;
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
declare const _default: import("react-redux").ConnectedComponent<typeof Status, Pick<React.ClassAttributes<Status> & Props, "name" | "ref" | "key">>;
export default _default;
