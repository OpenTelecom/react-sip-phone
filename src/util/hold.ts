import { phoneStore } from '../index'
import {
    SIPSESSION_HOLD_REQUEST,
    holdCallRequest
} from '../actions/sipSessions'

export const holdAll = (id: string) => {
    const state = phoneStore.getState()
    //@ts-ignore
    const onHolds = state.sipSessions.onHold
    //@ts-ignore
    const sessions = state.sipSessions.sessions
    for (let [sessionId, session] of Object.entries(sessions)) {
        if (
            onHolds.indexOf(sessionId) < 0 &&
            sessionId !== id
        ) {
            try {
                //@ts-ignore
                holdCallRequest(session)
                //dispatch here because class is not connected to redux actions
                phoneStore.dispatch({
                    type: SIPSESSION_HOLD_REQUEST,
                    //@ts-ignore
                    payload: session.id
                })
                return
            } catch (err) {
                return
            }
        }
    }
}


