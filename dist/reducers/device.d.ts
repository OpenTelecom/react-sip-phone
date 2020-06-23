import { Action } from './models';
declare const device: (state: {
    primaryAudioOutput: string;
    primaryAudioInput: string;
    audioInput: never[];
    audioOutput: never[];
    newAudioInput: never[];
    newAudioOutput: never[];
} | undefined, action: Action) => {
    audioInput: any;
    primaryAudioOutput: string;
    primaryAudioInput: string;
    audioOutput: never[];
    newAudioInput: never[];
    newAudioOutput: never[];
} | {
    audioOutput: any;
    primaryAudioOutput: string;
    primaryAudioInput: string;
    audioInput: never[];
    newAudioInput: never[];
    newAudioOutput: never[];
} | {
    primaryAudioOutput: any;
    primaryAudioInput: string;
    audioInput: never[];
    audioOutput: never[];
    newAudioInput: never[];
    newAudioOutput: never[];
} | {
    primaryAudioInput: any;
    primaryAudioOutput: string;
    audioInput: never[];
    audioOutput: never[];
    newAudioInput: never[];
    newAudioOutput: never[];
} | {
    newAudioInput: any;
    primaryAudioOutput: string;
    primaryAudioInput: string;
    audioInput: never[];
    audioOutput: never[];
    newAudioOutput: never[];
} | {
    newAudioOutput: any;
    primaryAudioOutput: string;
    primaryAudioInput: string;
    audioInput: never[];
    audioOutput: never[];
    newAudioInput: never[];
};
export default device;
