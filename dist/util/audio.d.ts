import { Session } from 'sip.js';
export declare const setRemoteAudio: (session: Session) => void;
export declare const setLocalAudio: (session: Session) => void;
export declare const cleanupMedia: (sessionId: string) => void;
