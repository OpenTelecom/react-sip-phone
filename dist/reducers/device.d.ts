import { Action } from './models';
declare const device: (state: {
    audioInput: never[];
    audioOutput: never[];
    primaryAudioOutput: string;
    primaryAudioInput: string;
    sinkId: boolean;
} | undefined, action: Action) => {
    audioInput: any;
    audioOutput: never[];
    primaryAudioOutput: string;
    primaryAudioInput: string;
    sinkId: boolean;
} | {
    audioOutput: any;
    audioInput: never[];
    primaryAudioOutput: string;
    primaryAudioInput: string;
    sinkId: boolean;
} | {
    primaryAudioOutput: any;
    audioInput: never[];
    audioOutput: never[];
    primaryAudioInput: string;
    sinkId: boolean;
} | {
    primaryAudioInput: any;
    audioInput: never[];
    audioOutput: never[];
    primaryAudioOutput: string;
    sinkId: boolean;
};
export default device;
