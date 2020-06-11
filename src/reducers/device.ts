import { Action } from './models'
import {
    AUDIO_INPUT_DEVICE_DETECTED,
    AUDIO_OUTPUT_DEVICE_DETECTED
} from '../actions/device'
const device = (
    state = {
        audioInput: [],
        audioOutput: []
    },
    action: Action
) => {
    const { type, payload } = action
    switch (type) {
        case AUDIO_INPUT_DEVICE_DETECTED:
            return {
                ...state,
                audioInput: [...state.audioInput, payload]
            }
        case AUDIO_OUTPUT_DEVICE_DETECTED:
            return {
                ...state,
                audioOutput: [...state.audioOutput, payload]
            }

        default:
            return state
    }
}
export default device
