import { Action } from './models';
declare const device: (state: {
    audioInput: never[];
    audioOutput: never[];
    primaryAudioOutput: string;
    primaryAudioInput: string;
} | undefined, action: Action) => {
    audioInput: any;
    audioOutput: never[];
    primaryAudioOutput: string;
    primaryAudioInput: string;
} | {
    audioOutput: any;
    audioInput: never[];
    primaryAudioOutput: string;
    primaryAudioInput: string;
} | {
    primaryAudioOutput: any;
    audioInput: never[];
    audioOutput: never[];
    primaryAudioInput: string;
} | {
    primaryAudioInput: any;
    audioInput: never[];
    audioOutput: never[];
    primaryAudioOutput: string;
};
export default device;
