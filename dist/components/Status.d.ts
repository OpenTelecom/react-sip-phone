import * as React from 'react';
interface Props {
    name: string;
    inputs: Array<Object>;
    outputs: any;
    primaryInput: string;
    primaryOutput: string;
    setPrimaryInput: Function;
    setPrimaryOutput: Function;
    getInputAudioDevices: Function;
    getOutputAudioDevices: Function;
    getNewInputAudioDevices: Function;
    getNewOutputAudioDevices: Function;
    audioSwap: Function;
    newInputs: any;
    newOutputs: any;
    sessions: any;
}
declare class Status extends React.Component<Props> {
    state: {
        settingsMenu: boolean;
    };
    componentDidMount(): void;
    mapOptions(options: any): any;
    handleChangeDevice(type: string, id: string): void;
    getAllAudioDevices: () => void;
    newPrimaryInput: () => void;
    deviceAddedOrRemoved: () => void;
    mediaDevicesChange: () => void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof Status, Pick<React.ClassAttributes<Status> & Props, "name" | "ref" | "key">>;
export default _default;
