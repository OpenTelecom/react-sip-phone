import { Action } from './models'
import {
    AUDIO_INPUT_DEVICES_DETECTED,
    AUDIO_OUTPUT_DEVICES_DETECTED,
    SET_PRIMARY_INPUT,
    SET_PRIMARY_OUTPUT
} from '../actions/device'
const device = (
    state = {
        audioInput: [],
        audioOutput: [],
        primaryAudioOutput: 'default',
        primaryAudioInput: 'default'
    },
    action: Action
) => {
    const { type, payload } = action
    switch (type) {
        case AUDIO_INPUT_DEVICES_DETECTED:
            return {
                ...state,
                audioInput: payload
            }
        case AUDIO_OUTPUT_DEVICES_DETECTED:
            return {
                ...state,
                audioOutput: payload
            }
        case SET_PRIMARY_OUTPUT:
            return {
                ...state,
                primaryAudioOutput: payload
            }
        case SET_PRIMARY_INPUT:
            return {
                ...state,
                primaryAudioInput: payload
            }
        default:
            return state
    }
}
export default device
